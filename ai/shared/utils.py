"""Shared utility functions used across all AI services."""
import json
import re
import logging

logger = logging.getLogger('edgenie.ai')


def clean_json_response(text: str) -> str:
    """
    Remove markdown code fences from Gemini responses.
    Gemini sometimes wraps JSON in ```json ... ```
    This function always returns clean JSON string.
    """
    text = text.strip()
    if '```' in text:
        parts = text.split('```')
        for part in parts:
            part = part.strip()
            if part.startswith('json'):
                part = part[4:].strip()
            if part.startswith('[') or part.startswith('{'):
                return part
    return text


def safe_parse_json(text: str, fallback=None):
    """
    Parse JSON safely. Returns fallback on failure.
    Tries multiple strategies before giving up.
    """
    try:
        cleaned = clean_json_response(text)
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try extracting JSON from surrounding text
        match = re.search(r'(\[.*\]|\{.*\})', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except Exception:
                pass
        logger.warning(f'JSON parse failed: {text[:100]}')
        return fallback


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp a float between min and max."""
    return max(min_val, min(max_val, value))
