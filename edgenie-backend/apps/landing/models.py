import uuid
from django.db import models


class WaitlistEntry(models.Model):
    id         = models.UUIDField(primary_key=True,
                     default=uuid.uuid4, editable=False)
    email      = models.EmailField(unique=True)
    full_name  = models.CharField(max_length=255, blank=True)
    role       = models.CharField(
                     max_length=50, blank=True,
                     help_text='student/teacher/parent'
                 )
    source     = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'waitlist_entries'
        ordering = ['-created_at']


class ContactSubmission(models.Model):
    id         = models.UUIDField(primary_key=True,
                     default=uuid.uuid4, editable=False)
    name       = models.CharField(max_length=255)
    email      = models.EmailField()
    subject    = models.CharField(max_length=255)
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_submissions'
        ordering = ['-created_at']
