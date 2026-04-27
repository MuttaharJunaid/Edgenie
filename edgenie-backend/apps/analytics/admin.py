from django.contrib import admin
from .models import TopicPerformance, DailyActivity

@admin.register(TopicPerformance)
class TopicPerformanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'topic', 'accuracy', 'total_marks_obtained', 'total_marks_possible', 'updated_at')
    list_filter = ('topic', 'accuracy', 'updated_at')
    search_fields = ('student__email', 'topic__name')

@admin.register(DailyActivity)
class DailyActivityAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'questions_attempted', 'time_spent_minutes', 'accuracy_today')
    list_filter = ('date', 'accuracy_today')
    search_fields = ('student__email', 'student__full_name')
