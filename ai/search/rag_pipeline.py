"""
FAISS RAG pipeline for semantic question search.
Builds and queries embeddings index.
"""
import os
import json
import logging
import numpy as np
from pathlib import Path

logger = logging.getLogger('edgenie.ai.search.rag')

_instance = None


def get_rag_pipeline():
    global _instance
    if _instance is None:
        _instance = RAGPipeline()
    return _instance


class RAGPipeline:

    def __init__(self):
        self._index = None
        self._id_map = {}
        self._model = None
        self._ready = False
        self._load()

    def _load(self):
        index_path = Path(os.environ.get(
            'FAISS_INDEX_PATH',
            '/app/data/faiss_index/questions.index'
        ))
        id_map_path = Path(os.environ.get(
            'FAISS_ID_MAP_PATH',
            '/app/data/faiss_index/id_map.json'
        ))

        if not index_path.exists() or not id_map_path.exists():
            logger.warning(
                'FAISS index not found. '
                'Run: python manage.py build_embeddings'
            )
            return

        try:
            import faiss
            from sentence_transformers import SentenceTransformer

            self._index = faiss.read_index(str(index_path))
            with open(id_map_path) as f:
                self._id_map = {
                    int(k): v
                    for k, v in json.load(f).items()
                }
            self._model = SentenceTransformer('all-MiniLM-L6-v2')
            self._ready = True
            logger.info(
                f'RAG ready: {self._index.ntotal} vectors'
            )
        except Exception as e:
            logger.error(f'RAG load failed: {e}')

    @property
    def is_ready(self) -> bool:
        return self._ready

    def search(self, query: str, top_k: int = 50) -> list:
        if not self._ready or not query.strip():
            return []
        try:
            vec = self._model.encode(
                [query.strip()],
                convert_to_numpy=True,
                normalize_embeddings=True,
            ).astype(np.float32)

            k = min(top_k, self._index.ntotal)
            D, I = self._index.search(vec, k)

            results = []
            for dist, idx in zip(D[0], I[0]):
                if idx == -1:
                    continue
                qid = self._id_map.get(int(idx))
                if qid:
                    score = float(1.0 / (1.0 + dist))
                    results.append({
                        'question_id': qid,
                        'score': round(score, 4)
                    })

            results.sort(key=lambda x: x['score'], reverse=True)
            return results

        except Exception as e:
            logger.error(f'RAG search error: {e}')
            return []

    def reload(self):
        self._ready = False
        self._index = None
        self._id_map = {}
        self._model = None
        self._load()
