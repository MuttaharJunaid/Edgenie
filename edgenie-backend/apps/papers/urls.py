from django.urls import path
from .views import (
    SubjectListView, SubjectDetailView, TopicListView,
    PaperListView, PaperDetailView, QuestionListView, QuestionDetailView
)

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subject_list'),
    path('subjects/<uuid:pk>/', SubjectDetailView.as_view(), name='subject_detail'),
    path('topics/', TopicListView.as_view(), name='topic_list'),
    path('papers/', PaperListView.as_view(), name='paper_list'),
    path('papers/<uuid:pk>/', PaperDetailView.as_view(), name='paper_detail'),
    path('questions/', QuestionListView.as_view(), name='question_list'),
    path('questions/<uuid:pk>/', QuestionDetailView.as_view(), name='question_detail'),
]
