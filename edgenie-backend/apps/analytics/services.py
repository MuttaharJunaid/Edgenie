"""Analytics service computing student performance metrics."""
from django.db.models import Avg, Count, Sum, Q, F
from django.db.models.functions import TruncDate
from apps.submissions.models import Submission, MockExam
from apps.accounts.models import StudentProfile


class AnalyticsService:
    """Compute analytics for a given student user."""

    @staticmethod
    def get_overview(user):
        """Return overall performance summary."""
        subs = Submission.objects.filter(student=user, ai_marks__isnull=False)
        total = subs.count()
        profile = getattr(user, 'studentprofile', None)
        streak = profile.streak_days if profile else 0

        if total == 0:
            return {
                'total_questions': 0,
                'overall_accuracy': 0,
                'total_study_hours': 0,
                'streak_days': streak,
                'topics_mastered': 0,
            }

        marks_possible = subs.aggregate(t=Sum('question__marks'))['t'] or 0
        marks_obtained = subs.aggregate(t=Sum('ai_marks'))['t'] or 0
        accuracy = round((marks_obtained / marks_possible) * 100, 1) if marks_possible else 0
        practice_time = profile.total_practice_time if profile else 0

        topic_stats = subs.values(
            'question__topic'
        ).annotate(
            attempts=Count('id'),
            total_m=Sum('question__marks'),
            obtained_m=Sum('ai_marks'),
        ).filter(attempts__gte=5)

        mastered = sum(
            1 for t in topic_stats
            if t['total_m'] > 0 and (t['obtained_m'] / t['total_m']) >= 0.8
        )

        return {
            'total_questions': total,
            'overall_accuracy': accuracy,
            'total_study_hours': round(practice_time / 60, 1),
            'streak_days': streak,
            'topics_mastered': mastered,
        }

    @staticmethod
    def get_subject_breakdown(user):
        """Per-subject accuracy and question count."""
        return list(
            Submission.objects.filter(
                student=user, ai_marks__isnull=False
            ).values(
                subject_code=F('question__paper__subject__code'),
                subject_name=F('question__paper__subject__name'),
            ).annotate(
                total=Count('id'),
                total_marks=Sum('question__marks'),
                obtained_marks=Sum('ai_marks'),
            ).order_by('-total')
        )

    @staticmethod
    def get_topic_performance(user, subject_code=None):
        """Per-topic accuracy for focus recommendations."""
        qs = Submission.objects.filter(student=user, ai_marks__isnull=False)
        if subject_code:
            qs = qs.filter(question__paper__subject__code=subject_code)

        return list(
            qs.values(
                topic_name=F('question__topic__name'),
            ).annotate(
                attempts=Count('id'),
                total_marks=Sum('question__marks'),
                obtained_marks=Sum('ai_marks'),
            ).filter(attempts__gte=1).order_by('obtained_marks')
        )

    @staticmethod
    def get_daily_activity(user, days=30):
        """Daily question count for the last N days."""
        from django.utils import timezone
        from datetime import timedelta
        cutoff = timezone.now() - timedelta(days=days)

        return list(
            Submission.objects.filter(
                student=user, submitted_at__gte=cutoff
            ).annotate(
                date=TruncDate('submitted_at')
            ).values('date').annotate(
                count=Count('id'),
            ).order_by('date')
        )

    @staticmethod
    def get_weak_topics(user, limit=5):
        """Return the weakest topics for recommendations."""
        topics = AnalyticsService.get_topic_performance(user)
        weak = []
        for t in topics:
            if t['attempts'] >= 3 and t['total_marks'] > 0:
                acc = (t['obtained_marks'] / t['total_marks']) * 100
                weak.append({
                    'topic_name': t['topic_name'],
                    'accuracy': round(acc, 1),
                    'attempts': t['attempts'],
                })
        weak.sort(key=lambda x: x['accuracy'])
        return weak[:limit]

    @staticmethod
    def get_mock_exam_history(user):
        """Return mock exam results over time."""
        return list(
            MockExam.objects.filter(
                student=user, status='completed'
            ).values(
                'id', 'subject__code', 'obtained_marks', 'total_marks',
                'started_at', 'completed_at',
            ).order_by('-started_at')[:20]
        )
