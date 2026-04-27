from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Subject, Topic, Paper, Question, QuestionPart

class QuestionPartInline(admin.TabularInline):
    model = QuestionPart
    extra = 1

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'board', 'level', 'is_active')
    search_fields = ('name', 'code')
    list_filter = ('board', 'level', 'is_active')

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'unit', 'order')
    list_filter = ('subject',)
    search_fields = ('name', 'subject__name')

@admin.register(Paper)
class PaperAdmin(admin.ModelAdmin):
    list_display = ('subject', 'year', 'session', 'paper_number', 'variant')
    list_filter = ('subject', 'year', 'session')
    search_fields = ('subject__name', 'subject__code')

@admin.register(Question)
class QuestionAdmin(ImportExportModelAdmin):
    list_display = ('question_number', 'paper', 'topic', 'marks', 'difficulty')
    list_filter = ('difficulty', 'paper__subject', 'paper__year')
    search_fields = ('text', 'topic__name')
    inlines = [QuestionPartInline]

@admin.register(QuestionPart)
class QuestionPartAdmin(admin.ModelAdmin):
    list_display = ('question', 'part_label', 'marks')
    search_fields = ('question__question_number', 'part_text')
