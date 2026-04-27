from celery import shared_task
from django.utils import timezone
import logging

logger = logging.getLogger('edgenie')


@shared_task(
    queue='scraper',
    bind=True,
    max_retries=1,
    time_limit=600,
    soft_time_limit=540
)
def run_scraper_job(self, job_id: str):
    """
    Run the full classification pipeline for a scraper job.
    PDF download → Gemini extraction → DistilBERT → DB save.
    """
    from apps.scraper.services import ClassificationService
    service = ClassificationService()
    service.run_pipeline(job_id)


@shared_task(queue='scraper')
def log_system_event(level: str, module: str,
                     message: str, extra: dict = None):
    """Save a system log entry"""
    # Skipping SystemLog create logic as model is mostly a stub or not needed yet 
    # but I will adhere to the layout:
    # from apps.scraper.models import SystemLog
    # SystemLog.objects.create(level=level, module=module, message=message, extra_data=extra or {})
    logger.info(f"{module}: {message}")
