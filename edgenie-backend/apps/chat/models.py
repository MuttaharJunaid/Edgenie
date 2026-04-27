import uuid
from django.db import models


class ChatSession(models.Model):
    id      = models.UUIDField(primary_key=True,
                  default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
                  'accounts.CustomUser',
                  on_delete=models.CASCADE,
                  related_name='chat_sessions')
    subject = models.ForeignKey(
                  'papers.Subject',
                  on_delete=models.SET_NULL,
                  null=True, blank=True)
    title       = models.CharField(max_length=255, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-updated_at']


class ChatMessage(models.Model):
    ROLES = [('user','User'), ('assistant','Assistant')]

    id         = models.UUIDField(primary_key=True,
                     default=uuid.uuid4, editable=False)
    session    = models.ForeignKey(ChatSession,
                     on_delete=models.CASCADE,
                     related_name='messages')
    role       = models.CharField(max_length=20, choices=ROLES)
    content    = models.TextField()
    # Attached file (PDF uploaded by student for marking)
    attached_file = models.URLField(blank=True)
    references = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
