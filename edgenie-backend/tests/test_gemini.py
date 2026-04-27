import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edgenie.settings.development')
django.setup()

import google.generativeai as genai
from django.conf import settings

print(f"GEMINI_API_KEY: {settings.GEMINI_API_KEY[:20]}...")
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel(
    'gemini-2.5-flash',
    generation_config={'temperature': 0.1, 'max_output_tokens': 200}
)
try:
    r = model.generate_content(
        'Return ONLY valid JSON, no extra text: {"marks_awarded": 3, "feedback": "Good answer.", "improvement_tips": ["Study more"]}'
    )
    raw = getattr(r, 'text', None)
    print(f'SUCCESS text: {repr(raw[:300] if raw else None)}')
except Exception as e:
    print(f'ERROR: {type(e).__name__}: {str(e)[:300]}')
