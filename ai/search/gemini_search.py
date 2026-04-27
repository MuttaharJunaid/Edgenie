"""
Gemini-powered semantic search for past paper questions.
Moved from: edgenie-backend/apps/search/services.py
Uses Gemini to understand query intent before DB search.
"""
import logging

from ai.shared.gemini_client import get_genai_client
from ai.shared.utils import safe_parse_json

logger = logging.getLogger('edgenie.ai.search')

QUERY_UNDERSTANDING_PROMPT = """
Extract structured search intent from this student query.
Return ONLY valid JSON, no markdown:
{{
  "topics": ["list of topics mentioned"],
  "subject": "subject name or null",
  "difficulty": "easy/medium/hard or null",
  "year_from": null,
  "year_to": null,
  "keywords": ["key", "concepts"],
  "query_summary": "brief description of what student wants"
}}
Query: "{query}"
"""

UNDERSTANDING_MODEL = 'gemini-2.5-flash'


def understand_query(query: str) -> dict:
    """
    Use Gemini to extract intent from natural language query.
    Returns structured dict or fallback on failure.
    """
    genai = get_genai_client()
    fallback = {
        'keywords': query.split(),
        'query_summary': query,
        'topics': [],
        'subject': None,
        'difficulty': None,
        'year_from': None,
        'year_to': None,
    }
    try:
        model = genai.GenerativeModel(
            UNDERSTANDING_MODEL,
            generation_config={'temperature': 0.1}
        )
        response = model.generate_content(
            QUERY_UNDERSTANDING_PROMPT.format(query=query)
        )
        result = safe_parse_json(response.text, fallback=fallback)
        return result
    except Exception as e:
        logger.warning(f'Query understanding failed: {e}')
        return fallback
