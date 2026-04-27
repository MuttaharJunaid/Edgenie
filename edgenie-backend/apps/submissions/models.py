import uuid
from django.db import models
from cloudinary.models import CloudinaryField


class Submission(models.Model):
    STATUS = [
        ('pending','Pending'), ('grading','Grading'),
        ('completed','Completed'), ('failed','Failed'),
    ]
    id             = models.UUIDField(primary_key=True,
                         default=uuid.uuid4, editable=False)
    student        = models.ForeignKey(
                         'accounts.CustomUser',
                         on_delete=models.CASCADE,
                         related_name='submissions')
    question       = models.ForeignKey(
                         'papers.Question',
                         on_delete=models.CASCADE,
                         related_name='submissions')
    answer_text    = models.TextField(blank=True)
    answer_image   = CloudinaryField('answers', blank=True, null=True)
    ai_marks       = models.IntegerField(null=True, blank=True)
    ai_feedback    = models.TextField(blank=True)
    improvement_tips = models.JSONField(default=list, blank=True)
    score_percentage = models.FloatField(null=True, blank=True)
    grading_status = models.CharField(max_length=20,
                         choices=STATUS, default='pending')
    submitted_at   = models.DateTimeField(auto_now_add=True)
    graded_at      = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'submissions'
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['student','submitted_at']),
            models.Index(fields=['question','student']),
        ]

    def save(self, *args, **kwargs):
        if self.ai_marks is not None and self.question.marks:
            self.score_percentage = round(
                (self.ai_marks / self.question.marks) * 100, 1
            )
        super().save(*args, **kwargs)


class MockExam(models.Model):
    STATUS = [
        ('pending','Pending'), ('ongoing','Ongoing'),
        ('completed','Completed'),
    ]
    id              = models.UUIDField(primary_key=True,
                          default=uuid.uuid4, editable=False)
    student         = models.ForeignKey(
                          'accounts.CustomUser',
                          on_delete=models.CASCADE,
                          related_name='mock_exams')
    subject         = models.ForeignKey(
                          'papers.Subject',
                          on_delete=models.CASCADE)
    questions       = models.ManyToManyField(
                          'papers.Question', blank=True)
    duration_minutes= models.IntegerField(default=60)
    started_at      = models.DateTimeField(null=True, blank=True)
    completed_at    = models.DateTimeField(null=True, blank=True)
    total_marks     = models.IntegerField(default=0)
    obtained_marks  = models.IntegerField(default=0)
    status          = models.CharField(max_length=20,
                          choices=STATUS, default='pending')
    topic_breakdown = models.JSONField(default=dict, blank=True)
    question_results= models.JSONField(default=list, blank=True)
    ai_feedback     = models.TextField(blank=True)
    config          = models.JSONField(default=dict, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mock_exams'
        ordering = ['-created_at']

    @property
    def score_percentage(self):
        if not self.total_marks:
            return 0
        return round(
            (self.obtained_marks / self.total_marks) * 100, 1
        )


class MockExamAnswer(models.Model):
    id            = models.UUIDField(primary_key=True,
                        default=uuid.uuid4, editable=False)
    exam          = models.ForeignKey(MockExam,
                        on_delete=models.CASCADE,
                        related_name='answers')
    question      = models.ForeignKey(
                        'papers.Question',
                        on_delete=models.CASCADE)
    answer_text   = models.TextField(blank=True)
    answer_image  = CloudinaryField('exam_answers',
                        blank=True, null=True)
    marks_obtained= models.IntegerField(null=True, blank=True)
    ai_feedback   = models.TextField(blank=True)
    submitted_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mock_exam_answers'
        unique_together = ['exam', 'question']


class SessionFeedback(models.Model):
    user = models.ForeignKey(
        'accounts.CustomUser', on_delete=models.CASCADE
    )
    session_type = models.CharField(max_length=50)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'session_feedback'
