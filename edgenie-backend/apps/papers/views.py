from rest_framework import generics, permissions
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from .models import Subject, Topic, Paper, Question
from .serializers import (
    SubjectSerializer, TopicSerializer, PaperSerializer,
    QuestionListSerializer, QuestionDetailSerializer
)
from .filters import QuestionFilter


class SubjectListView(generics.ListAPIView):
    """GET /api/subjects/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.filter(is_active=True).order_by('name')


class SubjectDetailView(generics.RetrieveAPIView):
    """GET /api/subjects/<id>/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.filter(is_active=True)


class TopicListView(generics.ListAPIView):
    """GET /api/topics/?subject=<id>"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TopicSerializer

    def get_queryset(self):
        subject_id = self.request.query_params.get('subject')
        qs = Topic.objects.all().order_by('name')
        if subject_id:
            qs = qs.filter(subject__id=subject_id)
        return qs


class PaperListView(generics.ListAPIView):
    """GET /api/papers/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaperSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subject', 'year', 'session']
    queryset = Paper.objects.select_related('subject').order_by('-year', 'session', 'paper_number')


class PaperDetailView(generics.RetrieveAPIView):
    """GET /api/papers/<id>/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaperSerializer
    queryset = Paper.objects.select_related('subject')


class QuestionListView(generics.ListAPIView):
    """GET /api/questions/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuestionListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = QuestionFilter
    
    def get_queryset(self):
        return Question.objects.select_related('topic', 'paper', 'paper__subject').prefetch_related('question_parts').order_by('-paper__year')


class QuestionDetailView(generics.RetrieveAPIView):
    """GET /api/questions/<id>/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuestionDetailSerializer
    
    def get_queryset(self):
        return Question.objects.select_related('topic', 'paper', 'paper__subject').prefetch_related('question_parts')
