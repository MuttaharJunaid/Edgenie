from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Achievement, StudentProfile

User = get_user_model()

STREAK_MILESTONES = {
    7: ('streak_7', '7-Day Streak', 'Studied 7 days in a row!'),
    30: ('streak_30', '30-Day Streak', 'Studied 30 days straight!'),
    100: ('streak_100', 'Century Streak', '100 consecutive days of learning!'),
}

QUESTION_MILESTONES = {
    100: ('q_100', '100 Questions', 'Answered 100 questions!'),
    500: ('q_500', '500 Questions', 'Answered 500 questions!'),
    1000: ('q_1000', 'Question Master', 'Answered 1000 questions!'),
}


@receiver(post_save, sender=User)
def create_student_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'student':
        StudentProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=StudentProfile)
def check_streak_achievements(sender, instance, **kwargs):
    if instance.streak_days in STREAK_MILESTONES:
        key, name, desc = STREAK_MILESTONES[instance.streak_days]
        Achievement.objects.get_or_create(
            user=instance.user, badge_key=key,
            defaults={'badge_name': name, 'description': desc}
        )
