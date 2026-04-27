from django.urls import path
from .views import ChatSessionListCreateView, ChatMessageListCreateView

urlpatterns = [
    path('sessions/', ChatSessionListCreateView.as_view(), name='chat_sessions'),
    path('sessions/<uuid:session_id>/messages/', ChatMessageListCreateView.as_view(), name='chat_messages'),
]
