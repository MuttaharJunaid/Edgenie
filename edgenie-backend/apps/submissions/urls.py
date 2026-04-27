from django.urls import path
from .views import (
    SubmissionListCreateView, SubmissionDetailView,
    MockExamListCreateView, MockExamDetailView,
    MockExamSubmitView, MockExamAnswerView, SessionFeedbackView
)

urlpatterns = [
    path('submissions/', SubmissionListCreateView.as_view(), name='submission_list_create'),
    path('submissions/<uuid:pk>/', SubmissionDetailView.as_view(), name='submission_detail'),
    path('mock-exams/', MockExamListCreateView.as_view(), name='mockexam_list_create'),
    path('mock-exams/<uuid:pk>/', MockExamDetailView.as_view(), name='mockexam_detail'),
    path('mock-exams/<uuid:pk>/submit/', MockExamSubmitView.as_view(), name='mockexam_submit'),
    path('mock-exams/<uuid:pk>/answers/', MockExamAnswerView.as_view(), name='mockexam_answers'),
    path('feedback/', SessionFeedbackView.as_view(), name='session_feedback'),
]
