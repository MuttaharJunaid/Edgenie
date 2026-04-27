"""
Zara chatbot endpoint for the Edgenie mobile app.

POST /api/chat/zara/
Auth: Bearer JWT (IsAuthenticated)

Request body:
    {
        "message":  "Why does current split in a parallel circuit?",
        "history":  [
            { "role": "user",      "content": "..." },
            { "role": "assistant", "content": "..." }
        ],
        "subject":  "Physics",   // optional — one of the 6 O-Level subjects
        "chat_id":  "abc-123"    // optional — for client-side session tracking
    }

Response:
    { "reply": "..." }

Stateless — history is sent from the mobile app on every call.
No DB reads or writes occur here.
"""
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.core.throttles import AIRateThrottle

logger = logging.getLogger('edgenie.chat.zara')

VALID_SUBJECTS = {
    'Mathematics',
    'Physics',
    'English Language',
    'Business Studies',
    'Principles of Accounts',
    'Chemistry',
}


class ZaraChatView(APIView):
    """
    Stateless RAG-powered Zara tutor endpoint.
    Accessible to any authenticated student.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRateThrottle]

    def post(self, request):
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])
        subject = request.data.get('subject', None)
        chat_id = request.data.get('chat_id', None)

        if not message:
            return Response(
                {'error': True, 'message': 'message field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Sanitise history
        if not isinstance(history, list):
            history = []
        clean_history = [
            turn for turn in history
            if isinstance(turn, dict)
            and turn.get('role') in ('user', 'assistant')
            and isinstance(turn.get('content'), str)
            and turn['content'].strip()
        ]

        # Validate subject
        if subject and subject not in VALID_SUBJECTS:
            subject = None  # ignore unknown subjects, don't error

        try:
            from ai.chatbot.zara_service import ZaraService
            service = ZaraService()
            result = service.respond(
                message=message,
                history=clean_history,
                subject=subject,
                chat_id=chat_id,
            )
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f'ZaraChatView error: {e}')
            return Response(
                {
                    'reply': (
                        'I\'m having a little trouble right now. '
                        'Please try again in a moment! 😊'
                    )
                },
                status=status.HTTP_200_OK,
            )
