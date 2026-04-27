"""
JSON file fallback search.
Used when DB is empty — searches raw JSON past paper files.
"""
import os
import json
import logging
from pathlib import Path

logger = logging.getLogger('edgenie.ai.search.fallback')


class JSONFallbackSearch:

    def __init__(self):
        self._cache = {}
        self.data_dir = Path(
            os.environ.get('DATA_DIR', '/app/data')
        )

    def search(self, query: str,
               subject_code: str = None,
               top_k: int = 20) -> list:
        questions = self._load_questions(subject_code)
        if not query.strip():
            return questions[:top_k]

        keywords = [
            w for w in query.lower().split()
            if len(w) > 2
        ]
        scored = []
        for q in questions:
            text = (
                f"{q.get('Topic', '')} "
                f"{q.get('Question_text', '')} "
                f"{' '.join(q.get('Sub_topic') or [])}"
            ).lower()
            score = sum(1 for kw in keywords if kw in text)
            if score > 0:
                q['_score'] = score
                scored.append(q)

        scored.sort(key=lambda x: x.get('_score', 0),
                    reverse=True)
        return scored[:top_k]

    def _load_questions(self, subject_code=None) -> list:
        cache_key = subject_code or 'all'
        if cache_key in self._cache:
            return self._cache[cache_key]

        questions = []
        folders = (
            [subject_code]
            if subject_code
            else ['4024', '5070', '5090', '7707', '5054', '2281']
        )

        for folder in folders:
            folder_path = self.data_dir / str(folder)
            if not folder_path.exists():
                continue
            for qp_file in folder_path.glob('*_qp_*.json'):
                try:
                    with open(qp_file) as f:
                        qp_data = json.load(f)
                    for q in qp_data:
                        q['subject_code'] = folder
                        q['source_file'] = qp_file.name
                        questions.append(q)
                except Exception as e:
                    logger.warning(f'Load error {qp_file}: {e}')

        self._cache[cache_key] = questions
        return questions
