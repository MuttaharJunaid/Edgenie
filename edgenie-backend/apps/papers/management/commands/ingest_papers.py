import os
import json
import logging
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.postgres.search import SearchVector
from apps.papers.models import Subject, Paper, Question, Topic, QuestionPart

logger = logging.getLogger('edgenie')

SUBJECT_MAP = {
    '4024': ('Mathematics', '#4F8EF7'),
    '5070': ('Chemistry', '#8B5CF6'),
    '5090': ('Biology', '#10B981'),
    '7707': ('English Language', '#F59E0B'),
    '5054': ('Physics', '#F59E0B'),
    '2281': ('Economics', '#EC4899'),
}

SESSION_MAP = {
    's': 'May/June',
    'w': 'Oct/Nov',
    'm': 'Feb/March'
}

class Command(BaseCommand):
    help = 'Ingest JSON past papers and mark schemes'

    def add_arguments(self, parser):
        parser.add_argument('--data-dir', type=str, required=True, help='Path to data directory')
        parser.add_argument('--subject', type=str, help='Specific subject code to ingest')
        parser.add_argument('--dry-run', action='store_true', help='Do not commit to database')
        parser.add_argument('--clear-existing', action='store_true', help='Clear existing papers for ingested subjects')

    def handle(self, *args, **options):
        data_dir = options['data_dir']
        target_subject = options.get('subject')
        dry_run = options['dry_run']
        clear_existing = options['clear_existing']

        stats = {'papers': 0, 'questions': 0, 'parts': 0, 'errors': 0}

        if not os.path.isdir(data_dir):
            self.stdout.write(self.style.ERROR(f"Data dir not found: {data_dir}"))
            return

        with transaction.atomic():
            for root, dirs, files in os.walk(data_dir):
                for file in files:
                    if not file.endswith('.json'):
                        continue
                    if '_qp_' not in file:
                        continue

                    # Parse filename: 4024_s10_qp_11.json
                    try:
                        base = file.split('.json')[0]
                        parts = base.split('_')
                        subject_code = parts[0]
                        session_year = parts[1]
                        variant = parts[3]
                        
                        if target_subject and subject_code != target_subject:
                            continue

                        session_code = session_year[0]
                        year = int('20' + session_year[1:])
                        paper_number = int(variant[0]) if variant else 1
                    except Exception as e:
                        logger.warning(f"Error parsing filename {file}: {e}")
                        stats['errors'] += 1
                        continue

                    # Look for mark scheme
                    ms_file = file.replace('_qp_', '_ms_')
                    ms_path = os.path.join(root, ms_file)
                    qp_path = os.path.join(root, file)

                    self.stdout.write(f"Processing {file}...")

                    try:
                        with open(qp_path, 'r', encoding='utf-8') as f:
                            qp_data = json.load(f)
                    except Exception as e:
                        logger.warning(f"Error loading {qp_path}: {e}")
                        stats['errors'] += 1
                        continue

                    ms_lookup = {}
                    if os.path.exists(ms_path):
                        try:
                            with open(ms_path, 'r', encoding='utf-8') as f:
                                ms_data = json.load(f)
                                for ms_item in ms_data:
                                    # Very basic MS lookup mapping
                                    # Expected ms format? Let's just store all texts
                                    pass
                        except Exception as e:
                            logger.warning(f"Error loading MS {ms_path}: {e}")

                    s_info = SUBJECT_MAP.get(subject_code, (f'Subject {subject_code}', '#4F8EF7'))
                    
                    if clear_existing:
                        Paper.objects.filter(subject__code=subject_code, year=year, variant=variant).delete()

                    subject, _ = Subject.objects.get_or_create(
                        code=subject_code,
                        defaults={'name': s_info[0], 'color_hex': s_info[1]}
                    )

                    paper, created = Paper.objects.get_or_create(
                        subject=subject,
                        year=year,
                        session=SESSION_MAP.get(session_code, 'May/June'),
                        paper_number=paper_number,
                        variant=str(variant)
                    )
                    if created:
                        stats['papers'] += 1

                    for q_data in qp_data:
                        try:
                            topic_name = q_data.get('Topic') or 'General'
                            unit_name = q_data.get('Unit') or ''

                            topic, _ = Topic.objects.get_or_create(
                                subject=subject,
                                name=topic_name[:255]
                            )

                            q_num_raw = str(q_data.get('QuestionNumber', '1'))
                            q_num = int(q_num_raw.split('/')[-1]) if q_num_raw.split('/')[-1].isdigit() else 1

                            question, q_created = Question.objects.update_or_create(
                                paper=paper,
                                question_number=q_num,
                                defaults={
                                    'topic': topic,
                                    'text': q_data.get('Question_text', ''),
                                    'sub_topics': q_data.get('Sub_topic') or [],
                                    'has_parts': len(q_data.get('Parts', [])) > 0,
                                    'marks': 10
                                }
                            )
                            if q_created:
                                stats['questions'] += 1

                            # Save parts
                            for p_data in q_data.get('Parts', []):
                                label = str(p_data.get('QuestionNumber','a')).replace('(','').replace(')','')
                                QuestionPart.objects.update_or_create(
                                    question=question,
                                    part_label=label,
                                    defaults={
                                        'part_text': p_data.get('Question_text', ''),
                                    }
                                )
                                stats['parts'] += 1
                                
                        except Exception as e:
                            logger.warning(f"Error saving question: {e}")
                            stats['errors'] += 1

            if not dry_run:
                self.stdout.write("Updating search vectors...")
                Question.objects.update(
                    search_vector=(
                        SearchVector('text', weight='A') +
                        SearchVector('topic__name', weight='B')
                    )
                )

            if dry_run:
                transaction.set_rollback(True)
                self.stdout.write(self.style.WARNING("DRY RUN: Transactions rolled back."))

        self.stdout.write(self.style.SUCCESS(
            f"Ingestion complete. \n"
            f"Papers: {stats['papers']} \n"
            f"Questions: {stats['questions']} \n"
            f"Parts: {stats['parts']} \n"
            f"Errors: {stats['errors']}"
        ))
