from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger('edgenie')


@shared_task(queue='email', max_retries=3,
             default_retry_delay=60, bind=True)
def send_verification_email(self, user_id):
    from apps.accounts.models import CustomUser
    try:
        user = CustomUser.objects.get(id=user_id)
        link = (f'{settings.FRONTEND_URL}'
                f'/verify-email/{user.verification_token}')
        send_mail(
            subject='Verify your Edgenie account',
            message=(
                f'Hi {user.full_name},\n\n'
                f'Verify your account: {link}\n\n'
                f'The Edgenie Team'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(queue='email')
def send_welcome_email(user_id):
    from apps.accounts.models import CustomUser
    try:
        user = CustomUser.objects.get(id=user_id)
        send_mail(
            subject='Welcome to Edgenie!',
            message=(
                f'Hi {user.full_name},\n\n'
                f'Welcome to Edgenie — your AI exam coach.\n'
                f'Start practising at {settings.FRONTEND_URL}\n\n'
                f'The Edgenie Team'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
    except Exception:
        pass


@shared_task(queue='analytics')
def update_analytics_after_submission(submission_id: str):
    from apps.submissions.models import Submission
    from apps.analytics.models import TopicPerformance, DailyActivity
    from django.utils import timezone
    from datetime import date

    try:
        s = Submission.objects.select_related(
            'question__topic', 'question__paper__subject',
            'student'
        ).get(id=submission_id)

        if s.ai_marks is None:
            return

        if s.question.topic:
            perf, _ = TopicPerformance.objects.get_or_create(
                student=s.student, topic=s.question.topic,
            )
            perf.attempts += 1
            perf.total_marks_possible += s.question.marks
            perf.total_marks_obtained += (s.ai_marks or 0)
            perf.accuracy = (
                (perf.total_marks_obtained / perf.total_marks_possible) * 100
                if perf.total_marks_possible else 0
            )
            perf.last_practiced = timezone.now()
            perf.save()

        today = date.today()
        act, _ = DailyActivity.objects.get_or_create(
            student=s.student, date=today
        )
        act.questions_attempted += 1
        act.time_spent_minutes += 3
        act.save()

        try:
            profile = s.student.studentprofile
            profile.total_practice_time += 3
            profile.save(update_fields=['total_practice_time'])
        except Exception:
            pass

        from django.core.cache import cache
        cache.delete(f'dashboard:{s.student.id}')

    except Exception as e:
        logger.error(f'Analytics update error: {e}')
