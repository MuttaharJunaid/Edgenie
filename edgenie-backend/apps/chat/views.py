from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import (
    MultiPartParser, FormParser, JSONParser
)
from django.utils import timezone
import tempfile, os
from .models import ChatSession, ChatMessage
from .services import GeminiChatbotService
from .serializers import ChatSessionSerializer, ChatMessageSerializer
from apps.core.throttles import AIRateThrottle


class ChatSessionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSessionSerializer

    def get_queryset(self):
        return ChatSession.objects.filter(
            student=self.request.user
        ).prefetch_related('messages')[:20]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class ChatMessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRateThrottle]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        return ChatMessage.objects.filter(
            session__id=self.kwargs['session_id'],
            session__student=self.request.user
        ).order_by('created_at')

    def create(self, request, *args, **kwargs):
        session_id = self.kwargs['session_id']
        try:
            session = ChatSession.objects.get(
                id=session_id, student=request.user
            )
        except ChatSession.DoesNotExist:
            return Response(
                {'error': True, 'message': 'Session not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        content = request.data.get('content', '').strip()
        if not content:
            return Response(
                {'error': True, 'message': 'Message required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle file upload (student submitting answer for marking)
        file_path = None
        temp_file = None
        uploaded_file = request.FILES.get('file')
        if uploaded_file:
            # Save to temp file for Gemini upload
            suffix = os.path.splitext(uploaded_file.name)[1]
            temp_file = tempfile.NamedTemporaryFile(
                delete=False, suffix=suffix
            )
            for chunk in uploaded_file.chunks():
                temp_file.write(chunk)
            temp_file.close()
            file_path = temp_file.name

        # Save user message
        user_msg = ChatMessage.objects.create(
            session=session,
            role='user',
            content=content,
            attached_file=uploaded_file.name if uploaded_file else '',
        )

        # Get AI response using GeminiChatbotService
        context = {
            'subject_id': request.data.get('subject_id', ''),
        }
        bot = GeminiChatbotService()
        result = bot.respond(
            message=content,
            session_id=str(session_id),
            file_path=file_path,
            context=context,
        )

        # Clean up temp file
        if temp_file and os.path.exists(temp_file.name):
            os.unlink(temp_file.name)

        # Save AI message
        ai_msg = ChatMessage.objects.create(
            session=session,
            role='assistant',
            content=result['content'],
            references=result.get('references', []),
        )

        # Update session
        if not session.title and len(content) > 5:
            session.title = content[:50]
        session.updated_at = timezone.now()
        session.save(update_fields=['title', 'updated_at'])

        return Response(
            ChatMessageSerializer(ai_msg).data,
            status=status.HTTP_201_CREATED
        )
