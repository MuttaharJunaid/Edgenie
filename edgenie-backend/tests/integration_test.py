#!/usr/bin/env python3
"""
Edgenie.io Comprehensive Integration Test Suite
Tests all frontend flows end-to-end against the live backend.
"""
import json
import sys
import time
import urllib.request
import urllib.error

BASE = "http://localhost:8000"
RESULTS = []
FLOW_TOKEN = None
ADMIN_TOKEN = None
SUBJECT_ID = None
Q_ID = None

def api(method, path, data=None, token=None, expect_status=None):
    """Make an API call and return parsed JSON."""
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        raw = resp.read().decode()
        return json.loads(raw) if raw else {}, resp.status
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            return json.loads(raw), e.code
        except:
            return {"raw": raw}, e.code
    except Exception as e:
        return {"error": str(e)}, 0

def test(name, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    icon = "✅" if passed else "❌"
    RESULTS.append((name, passed))
    print(f"  {icon} {name}" + (f" — {detail}" if detail else ""))

def section(title):
    print(f"\n{'='*50}")
    print(f"  {title}")
    print(f"{'='*50}")

# ============================================
# FLOW 0: Health Check
# ============================================
section("FLOW 0: HEALTH CHECK")
d, code = api("GET", "/health/")
test("Health endpoint", code == 200 and d.get("status") == "healthy",
     f"status={d.get('status')}")
test("Database OK", d.get("checks", {}).get("database") == "ok")
test("Cache OK", d.get("checks", {}).get("cache") == "ok")

# ============================================
# FLOW 1: Registration + Auth
# ============================================
section("FLOW 1: ONBOARDING + AUTH")

# Register
d, code = api("POST", "/api/auth/register/", {
    "email": "flowtest@edgenie.io",
    "full_name": "Flow Test User",
    "password": "FlowTest123!",
    "confirm_password": "FlowTest123!"
})
if code == 400 and "already" in str(d).lower():
    test("Register (user exists)", True, "User already registered — OK for re-run")
    # Login instead
    d, code = api("POST", "/api/auth/login/", {
        "email": "flowtest@edgenie.io",
        "password": "FlowTest123!"
    })
    FLOW_TOKEN = d.get("access")
    test("Login fallback", bool(FLOW_TOKEN), f"token={'yes' if FLOW_TOKEN else 'NO'}")
else:
    has_access = "access" in d
    has_refresh = "refresh" in d
    test("Register — 201", code == 201, f"code={code}")
    test("Register — access token", has_access)
    test("Register — refresh token", has_refresh)
    if "user" in d:
        test("Register — role=student", d["user"].get("role") == "student")
        test("Register — profile exists", d["user"].get("studentprofile") is not None)
    FLOW_TOKEN = d.get("access")

# Login
d, code = api("POST", "/api/auth/login/", {
    "email": "flowtest@edgenie.io",
    "password": "FlowTest123!"
})
FLOW_TOKEN = d.get("access")
FLOW_REFRESH = d.get("refresh")
test("Login — 200", code == 200)
test("Login — access token", bool(FLOW_TOKEN))
test("Login — refresh token", bool(FLOW_REFRESH))
if "user" in d:
    test("Login — streak field", "streak_days" in str(d))

# /me/ endpoint
d, code = api("GET", "/api/auth/me/", token=FLOW_TOKEN)
test("GET /me/ — 200", code == 200, f"email={d.get('email')}")
test("/me/ — email match", d.get("email") == "flowtest@edgenie.io")
test("/me/ — has studentprofile", "studentprofile" in d)
if "studentprofile" in d:
    sp = d["studentprofile"]
    test("/me/ — profile has subjects", "subjects" in sp)
    test("/me/ — profile has streak", "streak_days" in sp)

# ============================================
# FLOW 2: Subject Selection
# ============================================
section("FLOW 2: SUBJECT SELECTION")
d, code = api("GET", "/api/subjects/", token=FLOW_TOKEN)
test("GET /subjects/ — 200", code == 200)
has_results = "results" in d
test("Subjects has results", has_results)
if has_results and d["results"]:
    s = d["results"][0]
    SUBJECT_ID = s.get("id")
    test("Subject has id", "id" in s)
    test("Subject has name", "name" in s)
    test("Subject has code", "code" in s)
    test("Subject has color_hex", "color_hex" in s)
    test(f"Subject count", True, f"{d.get('count', len(d['results']))} subjects")
else:
    test("Subjects — has data", False, "No subjects in DB")

# Select subjects via PATCH /me/
if SUBJECT_ID:
    d, code = api("PATCH", "/api/auth/me/", {"subject_ids": [SUBJECT_ID]}, token=FLOW_TOKEN)
    test("PATCH /me/ subject_ids", code == 200, f"code={code}")

# ============================================
# FLOW 3: Dashboard Stats
# ============================================
section("FLOW 3: DASHBOARD + STATS")
d, code = api("GET", "/api/auth/me/stats/", token=FLOW_TOKEN)
test("GET /me/stats/ — 200", code == 200, f"code={code}")
if code == 200:
    for field in ["total_questions_practiced", "overall_accuracy", "streak_days",
                   "topics_covered_count", "total_practice_time_minutes"]:
        test(f"Stats has {field}", field in d)

d, code = api("GET", "/api/analytics/dashboard/", token=FLOW_TOKEN)
test("GET /analytics/dashboard/ — 200", code == 200)
if code == 200:
    test("Dashboard has subject_performance", "subject_performance" in d)
    test("Dashboard has recent_activity", "recent_activity" in d)
    test("Dashboard has improvement_rate", "improvement_rate" in d)

d, code = api("GET", "/api/analytics/weak-topics/", token=FLOW_TOKEN)
test("GET /analytics/weak-topics/ — 200", code == 200)

# ============================================
# FLOW 4: Search
# ============================================
section("FLOW 4: SEARCH")
d, code = api("GET", "/api/search/trending/", token=FLOW_TOKEN)
test("GET /search/trending/ — 200", code == 200)
test("Trending has key", "trending" in d)

d, code = api("GET", "/api/search/suggestions/?q=cell", token=FLOW_TOKEN)
test("GET /search/suggestions/ — 200", code == 200)
test("Suggestions is list", isinstance(d.get("suggestions"), list))

d, code = api("POST", "/api/search/questions/", {
    "query": "cell division",
    "page": 1,
    "page_size": 10
}, token=FLOW_TOKEN)
test("POST /search/questions/ — 200", code == 200)
if code == 200:
    test("Search has count", "count" in d)
    test("Search has results", "results" in d)
    test("Search has query_understood", "query_understood" in d)
    test("Search has has_next", "has_next" in d)
    test(f"Search results", True, f"count={d.get('count', 0)}")
    if d.get("results"):
        r = d["results"][0]
        for field in ["id", "text", "difficulty", "marks"]:
            test(f"Result has {field}", field in r)

# ============================================
# FLOW 5: Question Detail
# ============================================
section("FLOW 5: QUESTION DETAIL")
d, code = api("GET", "/api/questions/?page_size=1", token=FLOW_TOKEN)
if code == 200 and d.get("results"):
    Q_ID = d["results"][0]["id"]
    test("Got question ID", bool(Q_ID), f"id={Q_ID}")
    
    d2, code2 = api("GET", f"/api/questions/{Q_ID}/", token=FLOW_TOKEN)
    test("GET /questions/<id>/ — 200", code2 == 200)
    if code2 == 200:
        for field in ["id", "question_number", "text", "marks", "difficulty",
                       "marking_scheme", "question_parts", "has_parts"]:
            test(f"Detail has {field}", field in d2)
        test(f"Parts count", True, f"{len(d2.get('question_parts', []))} parts")
else:
    test("Questions available", False, "No questions in DB — run ingest_papers")
    Q_ID = None

# ============================================
# FLOW 6: AI Chat Tutor
# ============================================
section("FLOW 6: AI CHAT TUTOR")
d, code = api("POST", "/api/chat/sessions/", {}, token=FLOW_TOKEN)
test("Create chat session — 201", code == 201 or code == 200)
SESSION_ID = d.get("id")
test("Session has ID", bool(SESSION_ID))

if SESSION_ID:
    d, code = api("POST", f"/api/chat/sessions/{SESSION_ID}/messages/", {
        "content": "Explain photosynthesis for O Level Biology"
    }, token=FLOW_TOKEN)
    test("Chat message — 201", code == 201 or code == 200)
    if code in (200, 201):
        test("Response role=assistant", d.get("role") == "assistant")
        test("Response has content", len(d.get("content", "")) > 10,
             f"len={len(d.get('content', ''))}")
        test("Response has references", "references" in d)
    
    # Follow-up
    d2, code2 = api("POST", f"/api/chat/sessions/{SESSION_ID}/messages/", {
        "content": "Give me a past paper question on this topic"
    }, token=FLOW_TOKEN)
    test("Follow-up message", code2 in (200, 201),
         f"len={len(d2.get('content', ''))}")

# ============================================
# FLOW 7: Mock Exam
# ============================================
section("FLOW 7: MOCK EXAM")
if SUBJECT_ID:
    d, code = api("POST", "/api/mock-exams/", {
        "subject": SUBJECT_ID,
        "duration_minutes": 30,
        "question_count": 5,
        "difficulty": "mixed",
        "focus_weak_topics": False
    }, token=FLOW_TOKEN)
    test("Create mock exam", code == 201 or code == 200, f"code={code}")
    EXAM_ID = d.get("id")
    
    if EXAM_ID:
        test("Exam has status=pending", d.get("status") == "pending")
        test("Exam has questions", len(d.get("questions", [])) > 0,
             f"count={len(d.get('questions', []))}")
        
        if d.get("questions"):
            EQ_ID = d["questions"][0]["id"]
            # Submit answer
            d2, code2 = api("POST", f"/api/mock-exams/{EXAM_ID}/answers/", {
                "question": EQ_ID,
                "answer_text": "This is my test answer."
            }, token=FLOW_TOKEN)
            test("Submit exam answer", code2 in (200, 201), f"code={code2}")
            
            # Submit exam
            d3, code3 = api("POST", f"/api/mock-exams/{EXAM_ID}/submit/",
                           token=FLOW_TOKEN)
            test("Submit exam — 200", code3 == 200)
            if code3 == 200:
                test("Exam status=completed", d3.get("status") == "completed")
                test("Has obtained_marks", "obtained_marks" in d3)
                test("Has score_percentage", "score_percentage" in d3)
                test("Has topic_breakdown", "topic_breakdown" in d3)
    else:
        test("Exam creation", False, f"Response: {str(d)[:100]}")
else:
    test("Mock exam (skipped)", False, "No subject ID available")

# ============================================
# FLOW 8: Analytics
# ============================================
section("FLOW 8: ANALYTICS")
d, code = api("GET", "/api/analytics/activity/?days=30", token=FLOW_TOKEN)
test("GET /analytics/activity/ — 200", code == 200)

d, code = api("GET", "/api/analytics/topics/", token=FLOW_TOKEN)
test("GET /analytics/topics/ — 200", code == 200)

if SUBJECT_ID:
    d, code = api("GET", f"/api/analytics/subject/?subject_id={SUBJECT_ID}",
                  token=FLOW_TOKEN)
    test("GET /analytics/subject/ — 200", code == 200)
    if code == 200:
        test("Subject analytics has topics", "topic_level_accuracy" in d)

# ============================================
# FLOW 9: Answer Grading
# ============================================
section("FLOW 9: ANSWER GRADING")
if Q_ID:
    d, code = api("POST", "/api/submissions/", {
        "question": Q_ID,
        "answer_text": "Mitosis is cell division producing two identical daughter cells. Stages: prophase, metaphase, anaphase, telophase."
    }, token=FLOW_TOKEN)
    test("Create submission — 201", code == 201)
    SUB_ID = d.get("id")
    test("Submission has ID", bool(SUB_ID))
    test("Status is pending", d.get("grading_status") == "pending")
    
    if SUB_ID:
        # Poll for grading
        for i in range(10):
            time.sleep(3)
            d2, code2 = api("GET", f"/api/submissions/{SUB_ID}/", token=FLOW_TOKEN)
            status = d2.get("grading_status", "unknown")
            print(f"    Poll {i+1}: {status}")
            if status == "completed":
                test("Grading completed", True, f"~{(i+1)*3}s")
                test("Has ai_marks", d2.get("ai_marks") is not None,
                     f"marks={d2.get('ai_marks')}")
                test("Has ai_feedback", bool(d2.get("ai_feedback")),
                     f"len={len(d2.get('ai_feedback', ''))}")
                test("Has improvement_tips", isinstance(d2.get("improvement_tips"), list))
                break
            elif status == "failed":
                test("Grading completed", False, "FAILED — check Celery logs")
                break
        else:
            test("Grading completed", False, "Timed out after 30s")
else:
    test("Grading (skipped)", False, "No question ID available")

# ============================================
# ADMIN DASHBOARD FLOWS
# ============================================
section("ADMIN DASHBOARD FLOWS")

# Create admin user if needed
d, code = api("POST", "/api/auth/login/", {
    "email": "admin@edgenie.io",
    "password": "Admin123!@#"
})
ADMIN_TOKEN = d.get("access")
if not ADMIN_TOKEN:
    test("Admin login", False, "No admin user — create via manage.py createsuperuser")
else:
    test("Admin login", True)
    
    # Dashboard
    d, code = api("GET", "/api/admin-tools/dashboard/", token=ADMIN_TOKEN)
    test("Admin dashboard — 200", code == 200, f"code={code}")
    if code == 200:
        for field in ["total_users", "total_questions", "system_health"]:
            test(f"Dashboard has {field}", field in d)
    
    # Users list
    d, code = api("GET", "/api/admin-tools/users/", token=ADMIN_TOKEN)
    test("Admin users list — 200", code == 200)
    if code == 200 and d.get("results"):
        u = d["results"][0]
        for field in ["id", "email", "role", "plan"]:
            test(f"User has {field}", field in u)
    
    # AI Stats
    d, code = api("GET", "/api/admin-tools/ai-stats/", token=ADMIN_TOKEN)
    test("Admin AI stats — 200", code == 200)
    
    # System logs
    d, code = api("GET", "/api/admin-tools/logs/", token=ADMIN_TOKEN)
    test("Admin logs — 200", code == 200)
    
    # Settings
    d, code = api("GET", "/api/admin-tools/settings/", token=ADMIN_TOKEN)
    test("Admin settings — 200", code == 200)

    # Security test: student cannot access admin
    d, code = api("GET", "/api/admin-tools/dashboard/", token=FLOW_TOKEN)
    test("Student blocked from admin", code == 403,
         f"code={code}")

# ============================================
# LANDING PAGE FLOWS
# ============================================
section("LANDING PAGE FLOWS")

# Waitlist
d, code = api("POST", "/api/landing/waitlist/", {
    "email": f"waitlist{int(time.time())}@test.io",
    "full_name": "Waitlist User",
    "role": "student",
    "source": "landing_page"
})
test("Waitlist join — 201", code == 201)
test("Waitlist has position", "position" in d, f"pos={d.get('position')}")

# Duplicate
dup_email = f"dup{int(time.time())}@test.io"
api("POST", "/api/landing/waitlist/", {"email": dup_email})
d, code = api("POST", "/api/landing/waitlist/", {"email": dup_email})
test("Duplicate email blocked", code == 400)

# Contact form
d, code = api("POST", "/api/landing/contact/", {
    "name": "Test User",
    "email": "contact@test.io",
    "subject": "Question",
    "message": "Testing contact form"
})
test("Contact form — 201", code == 201)

# Public stats
d, code = api("GET", "/api/landing/stats/")
test("Public stats — 200", code == 200)
if code == 200:
    for field in ["total_students", "total_questions", "total_subjects", "waitlist_count"]:
        test(f"Stats has {field}", field in d, f"val={d.get(field)}")

# ============================================
# TOKEN REFRESH FLOW
# ============================================
section("TOKEN REFRESH FLOW")
if FLOW_REFRESH:
    d, code = api("POST", "/api/auth/token/refresh/", {"refresh": FLOW_REFRESH})
    test("Token refresh — 200", code == 200)
    test("New access token", "access" in d)

    # Logout
    d, code = api("POST", "/api/auth/logout/", {"refresh": FLOW_REFRESH},
                  token=FLOW_TOKEN)
    test("Logout — 200/205", code in (200, 205), f"code={code}")

    # Verify blacklisted
    d, code = api("POST", "/api/auth/token/refresh/", {"refresh": FLOW_REFRESH})
    test("Blacklisted refresh fails", code == 401, f"code={code}")

# ============================================
# FINAL REPORT
# ============================================
print(f"\n{'='*50}")
print(f"  INTEGRATION TEST REPORT")
print(f"{'='*50}")

passed = sum(1 for _, p in RESULTS if p)
failed = sum(1 for _, p in RESULTS if not p)
total = len(RESULTS)
pct = round(passed / total * 100) if total else 0

print(f"\n  Total tests:  {total}")
print(f"  Passed:       {passed} ✅")
print(f"  Failed:       {failed} ❌")
print(f"  Pass rate:    {pct}%")

if failed:
    print(f"\n  FAILED TESTS:")
    for name, p in RESULTS:
        if not p:
            print(f"    ❌ {name}")

print(f"\n  INTEGRATION READINESS: {pct}%")
if pct >= 90:
    print(f"  LAUNCH DECISION: ✅ READY")
elif pct >= 70:
    print(f"  LAUNCH DECISION: ⚠️  CONDITIONAL (fix failures first)")
else:
    print(f"  LAUNCH DECISION: ❌ NOT READY")

print(f"\n{'='*50}\n")
sys.exit(0 if failed == 0 else 1)
