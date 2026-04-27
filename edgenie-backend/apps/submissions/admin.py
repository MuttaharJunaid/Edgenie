from django.contrib import admin
from .models import Submission, MockExam, MockExamAnswer

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'question', 'ai_marks', 'score_percentage', 'grading_status', 'submitted_at')
    list_filter = ('grading_status', 'submitted_at')
    search_fields = ('student__email', 'student__full_name', 'question__text')

class MockExamAnswerInline(admin.TabularInline):
    model = MockExamAnswer
    extra = 0

@admin.register(MockExam)
class MockExamAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'status', 'total_marks', 'obtained_marks', 'created_at')
    list_filter = ('status', 'subject', 'created_at')
    search_fields = ('student__email', 'student__full_name')
    inlines = [MockExamAnswerInline]

@admin.register(MockExamAnswer)
class MockExamAnswerAdmin(admin.ModelAdmin):
    list_display = ('exam', 'question', 'marks_obtained', 'submitted_at')
    list_filter = ('submitted_at',)
    search_fields = ('exam__student__email', 'question__text')
