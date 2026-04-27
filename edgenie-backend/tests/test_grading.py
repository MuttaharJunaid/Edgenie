import sys, os
sys.path.insert(0, '/app')
os.environ['DJANGO_SETTINGS_MODULE'] = 'edgenie.settings.development'
import django
django.setup()

from django.conf import settings
import google.generativeai as genai, json

print(f"Key: {settings.GEMINI_API_KEY[:15]}...")
genai.configure(api_key=settings.GEMINI_API_KEY)

# Test 1: simple call
try:
    model = genai.GenerativeModel('gemini-2.5-flash')
    r = model.generate_content('Return ONLY valid JSON object: {"marks_awarded": 3, "feedback": "Good.", "improvement_tips": ["Study harder"]}')
    text = getattr(r, 'text', None)
    print(f"[1] Raw response: {repr(text[:300] if text else 'None')}")
    if text:
        clean = text.strip().replace('```json','').replace('```','').strip()
        d = json.loads(clean)
        print(f"[1] JSON OK: marks={d.get('marks_awarded')}")
except Exception as e:
    print(f"[1] ERROR: {type(e).__name__}: {e}")

# Test 2: grading pipeline test
try:
    from apps.submissions.models import Submission
    from apps.submissions.services import GeminiGradingService
    sub = Submission.objects.select_related('question','question__topic').first()
    if sub:
        print(f"[2] Testing submission id={sub.id}, q.text[:40]={sub.question.text[:40]}")
        svc = GeminiGradingService()
        result = svc.grade_submission(sub)
        print(f"[2] Grading result: marks={result.get('marks')}, feedback_len={len(result.get('feedback',''))}")
    else:
        print("[2] No submissions to test")
except Exception as e:
    import traceback
    print(f"[2] ERROR: {type(e).__name__}: {e}")
    traceback.print_exc()
