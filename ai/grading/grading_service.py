"""
Gemini AI grading service.
Moved from: edgenie-backend/apps/submissions/services.py
Grades student answers against official marking schemes.
"""
import json
import re
import logging

from ai.shared.gemini_client import get_genai_client
from ai.shared.utils import clamp
from ai.grading.prompts import (
    GRADING_PROMPT,
    EXAM_FEEDBACK_PROMPT,
    GRADING_MODEL
)

logger = logging.getLogger('edgenie.ai.grading')


class GradingService:

    def grade_submission(self, submission) -> dict:
        """
        Grade a Django Submission object.
        Returns: { marks, feedback, improvement_tips }
        """
        genai = get_genai_client()
        q = submission.question

        parts_section = ''
        if q.has_parts:
            parts = q.question_parts.all()
            parts_section = 'Parts:\n' + '\n'.join([
                f'({p.part_label}): {p.part_text}'
                for p in parts
            ])

        ms = q.marking_scheme or ''
        if not ms and q.has_parts:
            ms = '\n'.join([
                f'({p.part_label}) {p.marking_answer}'
                for p in q.question_parts.all()
                if p.marking_answer
            ])
        if not ms:
            ms = (
                'No specific marking scheme. '
                'Grade on accuracy and completeness.'
            )

        answer = (
            submission.answer_text
            or '[Image answer submitted]'
        )

        prompt = GRADING_PROMPT.format(
            question_text=q.text,
            parts_section=parts_section,
            marking_scheme=ms,
            total_marks=q.marks,
            student_answer=answer,
        )

        try:
            model = genai.GenerativeModel(
                GRADING_MODEL,
                generation_config={
                    'temperature': 0.1,
                    'max_output_tokens': 512
                }
            )
            r = model.generate_content(prompt)

            # Guard against blocked/empty response
            raw = getattr(r, 'text', None) or ''
            if not raw:
                try:
                    raw = r.candidates[0].content.parts[0].text
                except Exception:
                    pass

            if not raw:
                logger.warning('Grading: empty Gemini response')
                return self._error()

            # Strip code fences
            text = raw.strip().replace('```json', '').replace('```', '').strip()

            # Try direct JSON parse first
            result = None
            try:
                result = json.loads(text)
            except json.JSONDecodeError:
                m = re.search(r'\{\s*"marks_awarded".*?\}', text, re.DOTALL)
                if m:
                    try:
                        result = json.loads(m.group())
                    except json.JSONDecodeError:
                        pass
                if result is None:
                    m = re.search(r'\{[^{}]*\}', text, re.DOTALL)
                    if m:
                        try:
                            result = json.loads(m.group())
                        except json.JSONDecodeError:
                            pass

            if result is None:
                m2 = re.search(r'marks_awarded["\s]*:[\s]*(\d+)', text)
                if m2:
                    return {
                        'marks': int(clamp(int(m2.group(1)), 0, q.marks)),
                        'feedback': 'Partial grading result.',
                        'improvement_tips': [],
                    }
                logger.warning(f'Grading: could not parse JSON: {text[:200]}')
                return self._error()

            marks = int(clamp(
                int(result.get('marks_awarded', 0)), 0, q.marks
            ))
            return {
                'marks': marks,
                'feedback': result.get('feedback', ''),
                'improvement_tips': result.get('improvement_tips', []),
            }
        except Exception as e:
            logger.error(f'Grading error: {e}')
            return self._error()

    def generate_exam_feedback(self, exam) -> str:
        """Generate overall AI feedback for completed mock exam."""
        genai = get_genai_client()
        try:
            weak = [
                t for t, d in exam.topic_breakdown.items()
                if d.get('possible', 0) > 0
                and (d.get('obtained', 0)
                     / d['possible']) * 100 < 50
            ]
            prompt = EXAM_FEEDBACK_PROMPT.format(
                score=exam.score_percentage,
                subject=exam.subject.name,
                breakdown=json.dumps(exam.topic_breakdown),
                weak_topics=', '.join(weak) or 'None',
            )
            model = genai.GenerativeModel(GRADING_MODEL)
            r = model.generate_content(prompt)
            return r.text.strip()
        except Exception as e:
            logger.error(f'Exam feedback error: {e}')
            return self._default_feedback(exam)

    def _error(self) -> dict:
        return {
            'marks': None,
            'feedback': 'Grading temporarily unavailable. Your answer has been saved.',
            'improvement_tips': [],
        }

    def _default_feedback(self, exam) -> str:
        s = exam.score_percentage
        if s >= 75:
            return 'Great work! Maintain this level by practicing regularly.'
        elif s >= 50:
            return (
                'Good effort! Focus on your weak topics '
                'and review marking schemes.'
            )
        return (
            'Keep going! Review each topic carefully '
            'and practice past papers regularly.'
        )
