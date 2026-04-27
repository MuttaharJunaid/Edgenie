from django.urls import path
from .views import ChatSessionListCreateView, ChatMessageListCreateView
from .zara_views import ZaraChatView

urlpatterns = [
    path('sessions/', ChatSessionListCreateView.as_view(), name='chat_sessions'),
    path('sessions/<uuid:session_id>/messages/', ChatMessageListCreateView.as_view(), name='chat_messages'),

    # Zara — stateless O-Level tutor chatbot (mobile app)
    path('zara/', ZaraChatView.as_view(), name='zara_chat'),
]
