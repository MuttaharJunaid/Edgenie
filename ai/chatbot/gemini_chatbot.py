"""
Gemini Chatbot Service for Edgenie.io
Moved from: edgenie-backend/apps/chat/services.py

Original functions preserved:
  - process_file_with_gemini(file_path, user_prompt)

Django integration:
  - EdgenieChatbot class with respond() method
  - Conversation history support
  - Reference question finder
"""
import os
import logging
from google.genai import types

from ai.shared.gemini_client import get_new_genai_client
from ai.chatbot.prompts import (
    CHATBOT_SYSTEM_INSTRUCTION,
    CHATBOT_MODEL
)

logger = logging.getLogger('edgenie.ai.chatbot')


def process_file_with_gemini(file_path: str,
                              user_prompt: str) -> str:
    """
    ORIGINAL FUNCTION — preserved from gemini_chatbot.py
    Takes a file path (PDF or image) + user prompt.
    Uploads file to Gemini, gets response, deletes file.
    Returns: AI response text string.
    """
    client = get_new_genai_client()
    try:
        uploaded_file = client.files.upload(file=file_path)
        response = client.models.generate_content(
            model=CHATBOT_MODEL,
            contents=[uploaded_file, user_prompt],
            config=types.GenerateContentConfig(
                system_instruction=CHATBOT_SYSTEM_INSTRUCTION
            )
        )
        # Clean up file from Google servers
        client.files.delete(name=uploaded_file.name)
        return response.text
    except Exception as e:
        logger.error(f'process_file_with_gemini error: {e}')
        return f"An error occurred: {e}"


class EdgenieChatbot:
    """
    Django-integrated chatbot wrapper.
    Uses same Gemini client as original script.
    """

    def __init__(self):
        self.client = get_new_genai_client()

    def respond(self, message: str,
                session_id: str = None,
                file_path: str = None,
                context: dict = None) -> dict:
        """
        Generate AI tutor response.

        Args:
            message:    Student's text message
            session_id: Chat session UUID for history
            file_path:  Local path to uploaded file (PDF/image)
            context:    Dict with subject_id, subject_name

        Returns:
            { 'content': str, 'references': list }
        """
        try:
            contents = self._build_contents(
                message, file_path, session_id
            )
            response = self.client.models.generate_content(
                model=CHATBOT_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=CHATBOT_SYSTEM_INSTRUCTION,
                    temperature=0.7,
                    max_output_tokens=1024,
                )
            )

            # Clean up uploaded file if any
            if file_path and hasattr(self, '_last_uploaded_file'):
                try:
                    self.client.files.delete(
                        name=self._last_uploaded_file
                    )
                except Exception:
                    pass

            references = self._find_references(message, context)
            return {
                'content': response.text,
                'references': references,
            }
        except Exception as e:
            logger.error(f'EdgenieChatbot.respond error: {e}')
            return {
                'content': (
                    'I am temporarily unavailable. '
                    'Please try again in a moment.'
                ),
                'references': [],
            }

    def _build_contents(self, message: str,
                        file_path: str,
                        session_id: str) -> list:
        """Build contents array including history + file."""
        contents = []

        # Add conversation history from DB
        history = self._get_history(session_id)
        for msg in history[-10:]:
            role = 'user' if msg['role'] == 'user' else 'model'
            contents.append({
                'role': role,
                'parts': [{'text': msg['content']}]
            })

        # Current turn
        current_parts = []

        # Upload file if provided
        if file_path and os.path.exists(file_path):
            try:
                uploaded = self.client.files.upload(file=file_path)
                current_parts.append(uploaded)
                self._last_uploaded_file = uploaded.name
                logger.info(f'File uploaded: {file_path}')
            except Exception as e:
                logger.warning(f'File upload failed: {e}')

        current_parts.append({'text': message})
        contents.append({'role': 'user', 'parts': current_parts})
        return contents

    def _get_history(self, session_id: str) -> list:
        """Load conversation history from Django DB."""
        if not session_id:
            return []
        try:
            from apps.chat.models import ChatMessage
            msgs = ChatMessage.objects.filter(
                session__id=session_id
            ).order_by('created_at')[:20]
            return [
                {'role': m.role, 'content': m.content}
                for m in msgs
            ]
        except Exception:
            return []

    def _find_references(self, query: str,
                         context: dict = None) -> list:
        """Find related past paper questions to reference."""
        try:
            from apps.papers.models import Question
            from django.db.models import Q

            qs = Question.objects.select_related(
                'topic', 'paper', 'paper__subject'
            )
            if context and context.get('subject_id'):
                qs = qs.filter(
                    paper__subject__id=context['subject_id']
                )

            keywords = [
                w for w in query.lower().split()
                if len(w) > 3
            ][:3]
            if not keywords:
                return []

            f = Q()
            for kw in keywords:
                f |= (
                    Q(text__icontains=kw) |
                    Q(topic__name__icontains=kw)
                )

            refs = qs.filter(f)[:3]
            return [{
                'question_id': str(q.id),
                'question_number': q.question_number,
                'topic': q.topic.name if q.topic else '',
                'year': q.paper.year,
                'session': q.paper.session,
                'subject': q.paper.subject.name,
                'excerpt': (
                    q.text[:100] + '...'
                    if len(q.text) > 100 else q.text
                ),
            } for q in refs]
        except Exception as e:
            logger.warning(f'Reference finder error: {e}')
            return []
