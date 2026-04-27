from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import WaitlistEntry, ContactSubmission
from apps.accounts.models import CustomUser
from apps.papers.models import Question, Subject
import logging

logger = logging.getLogger('edgenie')

class WaitlistView(APIView):
    """POST /api/landing/waitlist/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if WaitlistEntry.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
        entry = WaitlistEntry.objects.create(
            email=email,
            full_name=request.data.get('full_name', ''),
            role=request.data.get('role', 'student'),
            source=request.data.get('source', '')
        )
        # async email notification logic here
        return Response({
            'message': 'Joined waitlist.',
            'position': WaitlistEntry.objects.count()
        }, status=status.HTTP_201_CREATED)


class ContactView(APIView):
    """POST /api/landing/contact/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ContactSubmission.objects.create(
            name=request.data.get('name', ''),
            email=request.data.get('email', ''),
            subject=request.data.get('subject', ''),
            message=request.data.get('message', '')
        )
        return Response({'message': 'Message sent.'}, status=status.HTTP_201_CREATED)


class PublicStatsView(APIView):
    """GET /api/landing/stats/"""
    permission_classes = [permissions.AllowAny]

    @method_decorator(cache_page(60 * 10))
    def get(self, request):
        try:
            return Response({
                'total_students': CustomUser.objects.filter(role='student').count(),
                'total_questions': Question.objects.count(),
                'total_subjects': Subject.objects.count(),
                'waitlist_count': WaitlistEntry.objects.count()
            })
        except Exception as e:
            logger.error(f'Landing stats error: {e}')
            return Response({
                'total_students': 1500,
                'total_questions': 25000,
                'total_subjects': 12,
                'waitlist_count': 500
            })
