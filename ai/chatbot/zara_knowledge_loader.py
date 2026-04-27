"""
Knowledge loader for Zara — the O-Level AI tutor chatbot.

Reads all JSON files from the /knowledge directory at project root.
Each file contains Q&A pairs: [{ "question": "...", "answer": "..." }]

Embeds every Q&A pair once at startup using sentence-transformers
(all-MiniLM-L6-v2) and stores them in a FAISS flat index for fast
cosine-similarity retrieval.

Subject-to-filename mapping is used to filter results by subject
when the student specifies one.

Usage:
    from ai.chatbot.zara_knowledge_loader import get_zara_index
    index = get_zara_index()
    results = index.retrieve("why does current split", subject="Physics", k=6)
"""
import os
import json
import logging
import numpy as np
from pathlib import Path

logger = logging.getLogger('edgenie.ai.chatbot.zara')

# Singleton — built once on first import, reused across all requests
_instance = None


def get_zara_index() -> 'ZaraKnowledgeIndex':
    global _instance
    if _instance is None:
        _instance = ZaraKnowledgeIndex()
    return _instance


# Maps the subject names the frontend sends to knowledge filenames
SUBJECT_FILE_MAP = {
    'Mathematics':             'mathematics.json',
    'Physics':                 'physics.json',
    'English Language':        'english_language.json',
    'Business Studies':        'business_studies.json',
    'Principles of Accounts':  'principles_of_accounts.json',
    'Chemistry':               'chemistry.json',
}


class ZaraKnowledgeIndex:
    """
    In-memory FAISS index over all knowledge Q&A pairs.
    Supports optional subject filtering at query time.
    """

    def __init__(self):
        # List of all loaded pairs with metadata
        self._pairs: list[dict] = []   # {question, answer, subject, source}
        self._index = None             # faiss.IndexFlatIP
        self._model = None             # SentenceTransformer
        self._ready = False
        self._build()

    # ------------------------------------------------------------------
    # Build
    # ------------------------------------------------------------------

    def _build(self):
        knowledge_dir = self._find_knowledge_dir()
        if knowledge_dir is None:
            logger.error(
                'Zara: /knowledge directory not found. '
                'Create it at the project root with subject JSON files.'
            )
            return

        self._pairs = self._load_files(knowledge_dir)
        if not self._pairs:
            logger.warning('Zara: No Q&A pairs loaded.')
            return

        try:
            import faiss
            from sentence_transformers import SentenceTransformer

            self._model = SentenceTransformer('all-MiniLM-L6-v2')

            texts = [p['question'] for p in self._pairs]
            embeddings = self._model.encode(
                texts,
                convert_to_numpy=True,
                normalize_embeddings=True,
                show_progress_bar=False,
            ).astype(np.float32)

            dim = embeddings.shape[1]
            self._index = faiss.IndexFlatIP(dim)
            self._index.add(embeddings)

            self._ready = True

            # Log per-subject counts
            from collections import Counter
            counts = Counter(p['subject'] for p in self._pairs)
            for subject, count in sorted(counts.items()):
                logger.info(f'Zara knowledge: {count} Q&A pairs — {subject}')
            logger.info(
                f'Zara knowledge index ready: '
                f'{len(self._pairs)} total pairs indexed.'
            )

        except ImportError as e:
            logger.error(
                f'Zara: Missing dependency — {e}. '
                'Run: pip install faiss-cpu sentence-transformers'
            )
        except Exception as e:
            logger.error(f'Zara: Index build failed — {e}')

    def _find_knowledge_dir(self) -> Path | None:
        # Explicit env override
        env_path = os.environ.get('KNOWLEDGE_DIR')
        if env_path:
            p = Path(env_path)
            if p.is_dir():
                return p

        # Walk up from this file to find /knowledge at project root
        current = Path(__file__).resolve().parent
        for _ in range(8):
            candidate = current / 'knowledge'
            if candidate.is_dir():
                return candidate
            current = current.parent
        return None

    def _load_files(self, directory: Path) -> list[dict]:
        pairs = []
        # Build reverse map: filename → subject name
        filename_to_subject = {v: k for k, v in SUBJECT_FILE_MAP.items()}

        for filepath in sorted(directory.glob('*.json')):
            subject = filename_to_subject.get(
                filepath.name,
                filepath.stem.replace('_', ' ').title()
            )
            try:
                with open(filepath, encoding='utf-8') as f:
                    data = json.load(f)

                if not isinstance(data, list):
                    logger.warning(f'Zara: {filepath.name} is not a list, skipping.')
                    continue

                loaded = 0
                for item in data:
                    q = item.get('question', '').strip()
                    a = item.get('answer', '').strip()
                    if q and a:
                        pairs.append({
                            'question': q,
                            'answer': a,
                            'subject': subject,
                            'source': filepath.name,
                        })
                        loaded += 1

            except Exception as e:
                logger.error(f'Zara: Error reading {filepath.name} — {e}')

        return pairs

    # ------------------------------------------------------------------
    # Query
    # ------------------------------------------------------------------

    @property
    def is_ready(self) -> bool:
        return self._ready

    def retrieve(
        self,
        query: str,
        subject: str | None = None,
        k: int = 6,
    ) -> list[dict]:
        """
        Return the top-k most relevant Q&A pairs for the query.

        Args:
            query:   The student's message.
            subject: Optional subject name to filter results.
            k:       Number of results to return.

        Returns:
            List of dicts: { question, answer, subject, source, score }
        """
        if not self._ready or not query.strip():
            return []

        try:
            vec = self._model.encode(
                [query.strip()],
                convert_to_numpy=True,
                normalize_embeddings=True,
            ).astype(np.float32)

            # Search a larger pool if filtering by subject
            search_k = min(k * 4 if subject else k, len(self._pairs))
            scores, indices = self._index.search(vec, search_k)

            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx == -1:
                    continue
                pair = self._pairs[int(idx)]

                # Subject filter — skip if doesn't match
                if subject and pair['subject'].lower() != subject.lower():
                    continue

                results.append({
                    'question': pair['question'],
                    'answer':   pair['answer'],
                    'subject':  pair['subject'],
                    'source':   pair['source'],
                    'score':    round(float(score), 4),
                })

                if len(results) >= k:
                    break

            return results

        except Exception as e:
            logger.error(f'Zara: retrieve error — {e}')
            return []

    def reload(self):
        """Force a full rebuild (call after adding new knowledge files)."""
        self._pairs = []
        self._index = None
        self._ready = False
        self._build()
