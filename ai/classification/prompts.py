"""
Prompts for the classification model pipeline.
Extracted from scraper/services.py for easy editing.
"""

EXTRACTION_PROMPT = """
Extract every single question from this Cambridge past paper PDF
into EXACTLY this JSON format.
No extra text. No markdown. No apologies.

CRITICAL RULES:
1. Extract the COMPLETE question text - not just numbers or metadata
2. Include all context, diagrams descriptions, and full question details
3. DO NOT extract page headers, footers, or time limits as questions
4. Skip metadata like "1 hour 30 minutes", "Total marks: 80",
   "Answer all questions"
5. Only extract actual QUESTIONS that students need to answer

[
  {
    "QuestionNumber": "1",
    "Question_text": "full question text here",
    "Unit": null,
    "Topic": null,
    "Sub_topic": null,
    "Parts": []
  }
]

IMPORTANT:
- Extract FULL question text with all context
- Set Unit, Topic, and Sub_topic to null (AI will classify later)
- Only valid JSON. Begin with [ and end with ]
"""

EXTRACTION_MODEL = 'gemini-2.5-flash'
