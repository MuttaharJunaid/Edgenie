from django.contrib import admin
from .models import ScraperJob, SystemLog

@admin.action(description="Re-run failed jobs")
def rerun_failed_jobs(modeladmin, request, queryset):
    from .tasks import run_scrape_job
    failed_jobs = queryset.filter(status='failed')
    for job in failed_jobs:
        job.status = 'queued'
        job.error_message = ''
        job.save()
        run_scrape_job.delay(str(job.id))
    modeladmin.message_user(request, f"Successfully re-queued {failed_jobs.count()} jobs.")

@admin.register(ScraperJob)
class ScraperJobAdmin(admin.ModelAdmin):
    list_display = ('subject_code', 'year', 'session', 'status', 'progress', 
                    'total_questions', 'classified_questions', 'created_at')
    list_filter = ('status', 'subject_code', 'year', 'session')
    search_fields = ('subject_code', 'error_message')
    actions = [rerun_failed_jobs]

@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ('level', 'module', 'message_brief', 'created_at')
    list_filter = ('level', 'module', 'created_at')
    search_fields = ('message', 'module')
    readonly_fields = ('level', 'module', 'message', 'extra_data', 'created_at')

    def message_brief(self, obj):
        return obj.message[:80] + ('...' if len(obj.message) > 80 else '')
