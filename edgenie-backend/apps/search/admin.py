from django.contrib import admin
from .models import SearchLog

@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = ('query', 'student', 'subject', 'result_count', 'searched_at')
    list_filter = ('subject', 'searched_at')
    search_fields = ('query', 'student__email', 'student__full_name')
    readonly_fields = ('query', 'student', 'subject', 'result_count', 'filters_applied', 'searched_at')
