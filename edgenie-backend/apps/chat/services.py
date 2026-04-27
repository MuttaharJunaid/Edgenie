"""
Chat service — imports from ai/chatbot module.
All AI logic lives in /ai/chatbot/gemini_chatbot.py
"""
from ai.chatbot.gemini_chatbot import EdgenieChatbot

# Re-export for backwards compatibility
GeminiChatbotService = EdgenieChatbot
