"""
Shared Gemini client factory.
Two separate API keys used for two different SDKs:

1. google.generativeai (old SDK) — used by classification model
   Key: GEMINI_API_KEY (from classificationModel.py)

2. google.genai (new SDK) — used by chatbot
   Key: CHATBOT_GEMINI_KEY (from gemini_chatbot.py)

Never mix the two SDKs in the same file.
"""
import os


def get_genai_client():
    """
    Returns initialized google.generativeai module.
    Used by: classification, grading, search.
    """
    import google.generativeai as genai
    api_key = os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        raise ValueError('GEMINI_API_KEY not set in environment')
    genai.configure(api_key=api_key)
    return genai


def get_new_genai_client():
    """
    Returns initialized google.genai Client (new SDK).
    Used by: chatbot only (from gemini_chatbot.py).
    """
    from google import genai
    api_key = os.environ.get('CHATBOT_GEMINI_KEY', '')
    if not api_key:
        raise ValueError('CHATBOT_GEMINI_KEY not set in environment')
    return genai.Client(api_key=api_key)
