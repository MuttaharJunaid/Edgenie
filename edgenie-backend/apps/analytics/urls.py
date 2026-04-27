from django.urls import path
from .views import (
    DashboardView, TopicAnalyticsView, ActivityView,
    WeakTopicsView, SubjectAnalyticsView
)

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='analytics_dashboard'),
    path('topics/', TopicAnalyticsView.as_view(), name='analytics_topics'),
    path('activity/', ActivityView.as_view(), name='analytics_activity'),
    path('weak-topics/', WeakTopicsView.as_view(), name='analytics_weak_topics'),
    path('subject/', SubjectAnalyticsView.as_view(), name='analytics_subject'),
]
