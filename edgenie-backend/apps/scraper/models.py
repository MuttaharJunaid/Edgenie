import uuid
from django.db import models


class ScraperJob(models.Model):
    STATUS = [
        ('queued','Queued'), ('downloading','Downloading'),
        ('extracting','Extracting'), ('classifying','Classifying'),
        ('saving','Saving'), ('completed','Completed'),
        ('failed','Failed'),
    ]
    id             = models.UUIDField(primary_key=True,
                         default=uuid.uuid4, editable=False)
    initiated_by   = models.ForeignKey(
                         'accounts.CustomUser',
                         on_delete=models.SET_NULL,
                         null=True)
    subject_code   = models.CharField(max_length=10)
    year           = models.CharField(max_length=4)
    session        = models.CharField(max_length=20)
    paper_type     = models.CharField(max_length=5,
                         default='qp')
    variant        = models.CharField(max_length=5)
    status         = models.CharField(max_length=20,
                         choices=STATUS, default='queued')
    progress       = models.IntegerField(default=0)
    total_questions= models.IntegerField(default=0)
    classified_questions = models.IntegerField(default=0)
    result_file    = models.JSONField(default=list, blank=True)
    error_message  = models.TextField(blank=True)
    started_at     = models.DateTimeField(null=True, blank=True)
    completed_at   = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'scraper_jobs'
        ordering = ['-created_at']


class SystemLog(models.Model):
    LEVELS = [
        ('info','Info'), ('warning','Warning'),
        ('error','Error'), ('critical','Critical'),
    ]
    id         = models.UUIDField(primary_key=True,
                     default=uuid.uuid4, editable=False)
    level      = models.CharField(max_length=20, choices=LEVELS)
    module     = models.CharField(max_length=100)
    message    = models.TextField()
    extra_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'system_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['level', 'created_at']),
        ]
