"""Prompts for the Gemini grading service."""

GRADING_PROMPT = """
You are a strict CAIE examiner. Grade the student answer below.

Question: {question_text}
{parts_section}
Marking Scheme: {marking_scheme}
Total marks: {total_marks}

Student Answer: {student_answer}

Respond with ONLY a JSON object, no other text, no markdown, no explanation:
{{"marks_awarded": 0, "feedback": "your feedback here", "improvement_tips": ["tip1", "tip2"]}}

Replace the values above with your actual assessment. marks_awarded must be an integer between 0 and {total_marks}.
"""

EXAM_FEEDBACK_PROMPT = """
A student scored {score}% on a {subject} mock exam.

Topic breakdown: {breakdown}
Weak topics (below 50%): {weak_topics}

Write 2-3 sentences of specific, encouraging feedback:
- Acknowledge their performance level
- Name 1-2 topics to improve
- Give one actionable study tip
Keep it concise and motivating for a teenager.
"""

GRADING_MODEL = 'gemini-2.5-flash'
