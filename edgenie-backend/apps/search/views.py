from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .services import GeminiSearchService, JSONFallbackSearchService
from .models import SearchLog
from apps.papers.serializers import QuestionListSerializer
from apps.core.throttles import AIRateThrottle
from django.db.models import Count
from datetime import timedelta
from django.utils import timezone

class SearchQuestionsView(APIView):
    """POST /api/search/questions/"""
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [AIRateThrottle]

    def post(self, request):
        query = request.data.get('query', '')
        filters = {
            'subject_id': request.data.get('subject_id'),
            'difficulty': request.data.get('difficulty'),
            'year_from': request.data.get('year_from'),
            'year_to': request.data.get('year_to'),
            'session': request.data.get('session'),
        }
        page = int(request.data.get('page', 1))
        page_size = int(request.data.get('page_size', 20))

        # Log search
        if query and page == 1:
            SearchLog.objects.create(
                student=request.user,
                query=query[:255]
            )

        # 1. Try Gemini
        service = GeminiSearchService()
        result = service.search(query, filters, page, page_size)

        # 2. Fallback
        if not result['results'] and query.strip():
            fb_service = JSONFallbackSearchService()
            result = fb_service.search(query, filters, page, page_size)

        # Serialize
        serialized_results = QuestionListSerializer(result['results'], many=True).data

        return Response({
            'count': result['count'],
            'results': serialized_results,
            'has_next': result['has_next'],
            'query_understood': result['query_understood'],
        })


class SearchSuggestionsView(APIView):
    """GET /api/search/suggestions/"""
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 5)) # 5 min cache
    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if len(q) < 2:
            return Response({'suggestions': []})

        from apps.papers.models import Topic, Subject
        
        suggestions = []
        # Subjects
        for s in Subject.objects.filter(name__icontains=q)[:3]:
            suggestions.append(s.name)
            
        # Topics
        for t in Topic.objects.filter(name__icontains=q)[:4]:
            if t.name not in suggestions:
                suggestions.append(t.name)
                
        # Recent SearchLogs
        for log in SearchLog.objects.filter(query__icontains=q).values('query').annotate(c=Count('id')).order_by('-c')[:4]:
            if log['query'] not in suggestions:
                suggestions.append(log['query'])

        return Response({'suggestions': suggestions[:8]})


class TrendingSearchesView(APIView):
    """GET /api/search/trending/"""
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 5)) # 5 min cache
    def get(self, request):
        last_7_days = timezone.now() - timedelta(days=7)
        trending = SearchLog.objects.filter(
            searched_at__gte=last_7_days
        ).values('query').annotate(
            count=Count('id')
        ).order_by('-count')[:10]

        return Response({
            'trending': list(trending)
        })
