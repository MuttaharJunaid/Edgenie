from celery import shared_task
from django.utils import timezone
import logging

logger = logging.getLogger('edgenie')


@shared_task(queue='grading', bind=True,
             max_retries=3, default_retry_delay=30)
def grade_submission(self, submission_id: str):
    from apps.submissions.models import Submission
    from apps.submissions.services import GeminiGradingService

    try:
        sub = Submission.objects.select_related(
            'question', 'question__topic', 'student'
        ).prefetch_related('question__question_parts').get(
            id=submission_id
        )
        sub.grading_status = 'grading'
        sub.save(update_fields=['grading_status'])

        grader = GeminiGradingService()
        result = grader.grade_submission(sub)

        if result['marks'] is not None:
            sub.ai_marks         = result['marks']
            sub.ai_feedback      = result['feedback']
            sub.improvement_tips = result['improvement_tips']
            sub.grading_status   = 'completed'
            sub.graded_at        = timezone.now()
        else:
            sub.grading_status = 'failed'
        sub.save()

        if result['marks'] is not None:
            from apps.accounts.tasks import (
                update_analytics_after_submission
            )
            update_analytics_after_submission.delay(
                str(submission_id)
            )

    except Exception as exc:
        logger.error(f'Grade submission {submission_id}: {exc}')
        try:
            sub.grading_status = 'failed'
            sub.save(update_fields=['grading_status'])
        except Exception:
            pass
        raise self.retry(exc=exc)


@shared_task(queue='grading', bind=True, max_retries=2)
def grade_exam_answer(self, answer_id: str):
    from apps.submissions.models import MockExamAnswer
    from apps.submissions.services import GeminiGradingService

    try:
        ans = MockExamAnswer.objects.select_related(
            'question'
        ).prefetch_related('question__question_parts').get(
            id=answer_id
        )

        class _FakeSub:
            def __init__(self, a):
                self.question   = a.question
                self.answer_text= a.answer_text
                self.answer_image = a.answer_image

        result = GeminiGradingService().grade_submission(
            _FakeSub(ans)
        )
        if result['marks'] is not None:
            ans.marks_obtained = result['marks']
            ans.ai_feedback    = result['feedback']
            ans.save(update_fields=['marks_obtained','ai_feedback'])

    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(queue='grading')
def generate_exam_feedback(exam_id: str):
    from apps.submissions.models import MockExam
    from apps.submissions.services import GeminiGradingService
    try:
        exam = MockExam.objects.select_related('subject').get(
            id=exam_id
        )
        feedback = GeminiGradingService().generate_exam_feedback(exam)
        exam.ai_feedback = feedback
        exam.save(update_fields=['ai_feedback'])
    except Exception as e:
        logger.error(f'Exam feedback {exam_id}: {e}')
