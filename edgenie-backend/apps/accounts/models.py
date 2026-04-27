import uuid
import secrets
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)
from django.db import models
from cloudinary.models import CloudinaryField


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError('Email required')
        email = self.normalize_email(email)
        extra.setdefault('role', 'student')
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.update({
            'is_staff': True, 'is_superuser': True,
            'role': 'admin', 'is_verified': True,
        })
        return self.create_user(email, password, **extra)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLES = [('student', 'Student'), ('admin', 'Admin')]
    PLANS = [('free', 'Free'), ('pro', 'Pro')]

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    email      = models.EmailField(unique=True)
    full_name  = models.CharField(max_length=255)
    role       = models.CharField(max_length=20, choices=ROLES,
                                  default='student')
    plan       = models.CharField(max_length=20, choices=PLANS,
                                  default='free')
    is_verified = models.BooleanField(default=False)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    avatar      = CloudinaryField('avatar', blank=True, null=True)
    verification_token = models.CharField(
        max_length=255, blank=True
    )
    stripe_customer_id = models.CharField(
        max_length=255, blank=True
    )
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()
    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f'{self.full_name} ({self.email})'


class StudentProfile(models.Model):
    GRADES = [
        ('A*','A*'),('A','A'),('B','B'),
        ('C','C'),('D','D'),('E','E'),
    ]
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    user   = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE,
        related_name='studentprofile'
    )
    subjects = models.ManyToManyField(
        'papers.Subject', blank=True
    )
    target_grade         = models.CharField(
        max_length=5, choices=GRADES, default='A'
    )
    weak_topics          = models.JSONField(default=dict, blank=True)
    total_practice_time  = models.IntegerField(default=0)
    streak_days          = models.IntegerField(default=0)
    last_active          = models.DateTimeField(null=True, blank=True)
    onboarding_complete  = models.BooleanField(default=False)
    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_profiles'

    def get_overall_accuracy(self):
        from apps.submissions.models import Submission
        subs = Submission.objects.filter(
            student=self.user, ai_marks__isnull=False
        ).select_related('question')
        total_p = sum(s.question.marks for s in subs)
        total_o = sum(s.ai_marks for s in subs)
        if not total_p:
            return 0.0
        return round((total_o / total_p) * 100, 1)


class Achievement(models.Model):
    id         = models.UUIDField(primary_key=True,
                     default=uuid.uuid4, editable=False)
    user       = models.ForeignKey(
                     CustomUser, on_delete=models.CASCADE,
                     related_name='achievements')
    badge_key  = models.CharField(max_length=50)
    badge_name = models.CharField(max_length=100)
    description= models.TextField(blank=True)
    earned_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'achievements'
        unique_together = ['user', 'badge_key']
        ordering = ['-earned_at']

    def __str__(self):
        return f'{self.user.full_name} — {self.badge_name}'
