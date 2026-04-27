"""
Cambridge Past Paper AI Processing System
Moved from: edgenie-backend/apps/scraper/services.py

Original pipeline preserved:
  1. download_pdf()
  2. extract_questions_from_pdf()
  3. classify_question()
  4. classify_and_update_json()
  5. save_classified_json()

Django/Celery integration:
  - ClassificationPipeline class
  - run_pipeline(job_id) for async task execution
  - Progress updates via ScraperJob model
"""
import os
import json
import time
import logging
import requests
import tempfile

from ai.shared.utils import safe_parse_json
from ai.classification.prompts import (
    EXTRACTION_PROMPT,
    EXTRACTION_MODEL
)
from ai.classification.model_loader import get_model
from ai.shared.gemini_client import get_genai_client

logger = logging.getLogger('edgenie.ai.classification')

# Session/year decode maps
SESSION_DECODE = {
    's': 'May/June',
    'w': 'Oct/Nov',
    'm': 'Feb/March'
}

SUBJECT_MAP = {
    '4024': ('Mathematics', '#4F8EF7'),
    '5070': ('Chemistry', '#8B5CF6'),
    '5090': ('Biology', '#10B981'),
    '5054': ('Physics', '#F59E0B'),
    '2281': ('Economics', '#EC4899'),
    '7707': ('English Language', '#F59E0B'),
}


# ─── ORIGINAL FUNCTIONS (preserved from scraper/services.py) ───

def download_pdf(code: str, year: str, session: str,
                 paper_type: str, variant: str):
    """
    Downloads PDF from PapaCambridge.
    Returns: local file path or None on failure.
    """
    session_map = {
        'may-june': 's', 'oct-nov': 'w', 'feb-march': 'm'
    }
    session_code = session_map.get(session.lower(), 's')
    year_short = str(year)[-2:]
    filename = (
        f'{code}_{session_code}{year_short}'
        f'_{paper_type}_{variant}.pdf'
    )
    base_url = os.environ.get(
        'PAPACAMBRIDGE_BASE_URL',
        'https://pastpapers.papacambridge.com'
        '/directories/CAIE/CAIE-pastpapers/upload/'
    )
    url = base_url + filename

    logger.info(f'Downloading PDF: {filename}')
    try:
        r = requests.get(url, stream=True, timeout=30)
        r.raise_for_status()
        tmp = tempfile.NamedTemporaryFile(
            delete=False, suffix='.pdf'
        )
        for chunk in r.iter_content(8192):
            tmp.write(chunk)
        tmp.close()
        logger.info(f'Downloaded: {filename}')
        return tmp.name
    except Exception as e:
        logger.error(f'PDF download failed: {e}')
        return None


def extract_questions_from_pdf(pdf_path: str):
    """
    Sends PDF to Gemini 2.5 Flash, extracts questions as JSON.
    Returns: list of question dicts or None on failure.
    """
    genai = get_genai_client()
    logger.info('Sending PDF to Gemini for extraction...')
    try:
        uploaded = genai.upload_file(pdf_path)

        # Wait for processing
        for _ in range(30):  # max 150 seconds
            if uploaded.state.name != 'PROCESSING':
                break
            time.sleep(5)
            uploaded = genai.get_file(uploaded.name)

        if uploaded.state.name == 'FAILED':
            raise ValueError('Gemini file processing failed')

        model = genai.GenerativeModel(EXTRACTION_MODEL)
        response = model.generate_content(
            [uploaded, EXTRACTION_PROMPT],
            generation_config={
                'temperature': 0.1,
                'response_mime_type': 'application/json'
            }
        )

        # Clean up uploaded file
        try:
            genai.delete_file(uploaded.name)
        except Exception:
            pass

        data = safe_parse_json(response.text, fallback=[])

        # Filter valid questions
        valid = [
            q for q in data
            if len(q.get('Question_text', '')) > 15
        ]
        logger.info(f'Extracted {len(valid)} valid questions')
        return valid

    except Exception as e:
        logger.error(f'Gemini extraction failed: {e}')
        return None


def classify_question(model, tokenizer, text: str,
                      id2label: dict, device) -> dict:
    """
    Runs DistilBERT on a single question text.
    Returns: predicted_label, confidence, top_predictions
    """
    import torch

    if len(text.strip()) < 10:
        return {
            'predicted_label': 'Unknown',
            'confidence': 0.0,
            'top_predictions': []
        }

    inputs = tokenizer(
        text,
        truncation=True,
        max_length=512,
        padding='max_length',
        return_tensors='pt'
    ).to(device)

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.nn.functional.softmax(logits, dim=-1)[0]
        pred_id = logits.argmax(-1).item()
        conf = probs[pred_id].item()

    top_k = torch.topk(probs, 3)
    top_preds = [
        {
            'label': id2label.get(i.item(), 'Unknown'),
            'confidence': p.item()
        }
        for p, i in zip(top_k.values, top_k.indices)
    ]

    return {
        'predicted_label': id2label.get(pred_id, 'Unknown'),
        'confidence': conf,
        'top_predictions': top_preds,
    }


def parse_label(raw: str) -> tuple:
    """
    Parses DistilBERT label into (Unit, Topic, Sub_topic).
    Example:
      "UNIT 1: Motion, Forces Energy - 1.1 Physical Quantities"
      -> ("UNIT 1", "Motion, Forces Energy", "1.1 Physical Quantities")
    """
    raw = raw.strip()

    # Case 1: pipe separator
    if '|' in raw and raw.count('|') >= 2:
        parts = [p.strip() for p in raw.split('|')]
        return (
            parts[0],
            parts[1],
            parts[2] if len(parts) > 2 else 'Unknown'
        )

    # Case 2: "UNIT X: Topic - Subtopic"
    if ':' in raw and '-' in raw:
        before_dash = raw.split('-', 1)[0].strip()
        after_dash = raw.split('-', 1)[1].strip()
        if ':' in before_dash:
            unit = before_dash.split(':', 1)[0].strip()
            topic = before_dash.split(':', 1)[1].strip()
        else:
            unit = before_dash
            topic = 'Unknown'
        return unit, topic, after_dash

    # Fallback
    return raw, 'Unknown', 'Unknown'


def classify_and_update_json(questions_data: list,
                              model, tokenizer,
                              id2label: dict,
                              device,
                              progress_callback=None) -> list:
    """
    Classifies all questions using DistilBERT.
    Added: progress_callback(count, total) for Django progress updates
    """
    import torch

    total = _count_all(questions_data)
    count = [0]

    def process(item):
        result = classify_question(
            model, tokenizer,
            item.get('Question_text', ''),
            id2label, device
        )
        raw = result['predicted_label'].strip()
        unit, topic, sub_topic = parse_label(raw)

        item['Unit'] = unit
        item['Topic'] = topic
        item['Sub_topic'] = [sub_topic]
        item['AI_Confidence'] = result['confidence']
        item['Top_Predictions'] = result['top_predictions']

        count[0] += 1

        if progress_callback and count[0] % 5 == 0:
            progress_callback(count[0], total)

        # Clear GPU cache periodically
        if count[0] % 10 == 0 and device.type == 'cuda':
            torch.cuda.empty_cache()

        for part in item.get('Parts', []):
            process(part)

    for q in questions_data:
        process(q)

    logger.info(f'Classified {count[0]} questions')
    return questions_data


def _count_all(data: list) -> int:
    """Count total questions including nested parts."""
    total = 0
    def rec(item):
        nonlocal total
        total += 1
        for p in item.get('Parts', []):
            rec(p)
    for q in data:
        rec(q)
    return total


# ─── DJANGO INTEGRATION CLASS ───

class ClassificationPipeline:
    """
    Full pipeline runner for Django/Celery integration.
    Wraps original functions with progress tracking
    and Django model updates.
    """

    def run_pipeline(self, job_id: str):
        """
        Run full pipeline: download -> extract -> classify -> save DB
        Updates ScraperJob.progress throughout.
        Called by Celery task: run_scraper_job.delay(job_id)
        """
        from apps.scraper.models import ScraperJob
        from django.utils import timezone

        try:
            job = ScraperJob.objects.get(id=job_id)
            job.status = 'downloading'
            job.started_at = timezone.now()
            job.save(update_fields=['status', 'started_at'])

            # Step 1: Download PDF
            pdf_path = download_pdf(
                job.subject_code, job.year,
                job.session, 'qp', job.variant
            )
            if not pdf_path:
                self._fail(job, 'PDF download failed')
                return

            job.status = 'extracting'
            job.progress = 20
            job.save(update_fields=['status', 'progress'])

            # Step 2: Extract with Gemini
            questions = extract_questions_from_pdf(pdf_path)
            if not questions:
                self._fail(job, 'Question extraction failed')
                self._cleanup(pdf_path)
                return

            job.total_questions = _count_all(questions)
            job.status = 'classifying'
            job.progress = 40
            job.save(update_fields=[
                'total_questions', 'status', 'progress'
            ])

            # Step 3: Load DistilBERT
            model, tokenizer, id2label, device = get_model()

            if model is None:
                logger.warning(
                    'DistilBERT unavailable — saving without classification'
                )
                classified = questions
            else:
                # Step 4: Classify
                def on_progress(count, total):
                    progress = 40 + int((count / total) * 45)
                    job.progress = progress
                    job.questions_classified = count
                    job.save(update_fields=[
                        'progress', 'questions_classified'
                    ])

                classified = classify_and_update_json(
                    questions, model, tokenizer,
                    id2label, device,
                    progress_callback=on_progress
                )

            job.status = 'saving'
            job.progress = 85
            job.save(update_fields=['status', 'progress'])

            # Step 5: Save to DB
            saved = self._save_to_db(classified, job)

            job.status = 'completed'
            job.progress = 100
            job.questions_classified = saved
            job.result_file = classified
            job.completed_at = timezone.now()
            job.save()

            self._cleanup(pdf_path)
            logger.info(
                f'Job {job_id} done: {saved} questions saved'
            )

        except Exception as e:
            logger.error(f'Pipeline error {job_id}: {e}',
                         exc_info=True)
            try:
                job = ScraperJob.objects.get(id=job_id)
                self._fail(job, str(e))
            except Exception:
                pass

    def _save_to_db(self, questions: list, job) -> int:
        """Save classified questions to Django DB."""
        from apps.papers.models import (
            Subject, Topic, Paper, Question, QuestionPart
        )

        s_info = SUBJECT_MAP.get(
            job.subject_code,
            (f'Subject {job.subject_code}', '#4F8EF7')
        )
        subject, _ = Subject.objects.get_or_create(
            code=job.subject_code,
            defaults={
                'name': s_info[0],
                'color_hex': s_info[1],
            }
        )

        session_str = job.session.lower().replace(' ', '-')
        session_code = session_str[0] if session_str else 's'
        session_name = SESSION_DECODE.get(
            session_code, 'May/June'
        )
        paper, _ = Paper.objects.get_or_create(
            subject=subject,
            year=int(job.year),
            session=session_name,
            paper_number=int(str(job.variant)[0] if job.variant else '1'),
            variant=str(job.variant),
        )

        saved = 0
        for q_data in questions:
            try:
                saved += self._save_question(
                    q_data, paper, subject
                )
            except Exception as e:
                logger.warning(
                    f'Save error Q{q_data.get("QuestionNumber")}: {e}'
                )
        return saved

    def _save_question(self, q_data: dict,
                       paper, subject) -> int:
        from apps.papers.models import (
            Topic, Question, QuestionPart
        )
        topic_name = q_data.get('Topic') or 'General'
        topic, _ = Topic.objects.get_or_create(
            subject=subject,
            name=topic_name[:255],
        )
        q_num_raw = str(q_data.get('QuestionNumber', '1'))
        q_num = (
            int(q_num_raw.split('/')[-1])
            if q_num_raw.split('/')[-1].isdigit()
            else 1
        )
        question, created = Question.objects.update_or_create(
            paper=paper,
            question_number=q_num,
            defaults={
                'topic': topic,
                'text': q_data.get('Question_text', ''),
                'sub_topics': q_data.get('Sub_topic') or [],
                'has_parts': len(
                    q_data.get('Parts', [])
                ) > 0,
                'marks': 10,
            }
        )
        for p_data in q_data.get('Parts', []):
            label = (
                str(p_data.get('QuestionNumber', 'a'))
                .replace('(', '').replace(')', '')
            )
            QuestionPart.objects.update_or_create(
                question=question,
                part_label=label[:10],
                defaults={
                    'part_text': p_data.get('Question_text', ''),
                }
            )
        return 1 if created else 0

    def _fail(self, job, error: str):
        from django.utils import timezone
        job.status = 'failed'
        job.error_message = error
        job.completed_at = timezone.now()
        job.save(update_fields=[
            'status', 'error_message', 'completed_at'
        ])

    def _cleanup(self, path: str):
        try:
            if path and os.path.exists(path):
                os.unlink(path)
        except Exception:
            pass
