import uuid
from django.db import models


class TopicPerformance(models.Model):
    id = models.UUIDField(primary_key=True,
             default=uuid.uuid4, editable=False)
    student  = models.ForeignKey(
                   'accounts.CustomUser',
                   on_delete=models.CASCADE,
                   related_name='topic_performances')
    topic    = models.ForeignKey(
                   'papers.Topic',
                   on_delete=models.CASCADE,
                   related_name='performances')
    attempts              = models.IntegerField(default=0)
    total_marks_possible  = models.IntegerField(default=0)
    total_marks_obtained  = models.IntegerField(default=0)
    accuracy              = models.FloatField(default=0.0)
    last_practiced        = models.DateTimeField(null=True,
                               blank=True)
    updated_at            = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'topic_performances'
        unique_together = ['student', 'topic']
        indexes = [
            models.Index(fields=['student','accuracy'])
        ]

    def update_accuracy(self):
        if self.total_marks_possible:
            self.accuracy = round(
                (self.total_marks_obtained
                 / self.total_marks_possible) * 100, 1
            )
        self.save(update_fields=['accuracy'])


class DailyActivity(models.Model):
    id = models.UUIDField(primary_key=True,
             default=uuid.uuid4, editable=False)
    student              = models.ForeignKey(
                               'accounts.CustomUser',
                               on_delete=models.CASCADE,
                               related_name='daily_activities')
    date                 = models.DateField()
    questions_attempted  = models.IntegerField(default=0)
    time_spent_minutes   = models.IntegerField(default=0)
    subjects_practiced   = models.JSONField(default=list)
    accuracy_today       = models.FloatField(default=0.0)

    class Meta:
        db_table = 'daily_activities'
        unique_together = ['student', 'date']
        ordering = ['-date']
