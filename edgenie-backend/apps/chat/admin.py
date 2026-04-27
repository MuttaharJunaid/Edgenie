from django.contrib import admin
from .models import ChatSession, ChatMessage

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('role', 'content', 'attached_file', 'references', 'created_at')

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'title', 'created_at', 'updated_at')
    list_filter = ('subject', 'created_at')
    search_fields = ('student__email', 'student__full_name', 'title')
    inlines = [ChatMessageInline]

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'role', 'content_brief', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('content', 'session__student__email')

    def content_brief(self, obj):
        return obj.content[:50] + ('...' if len(obj.content) > 50 else '')
