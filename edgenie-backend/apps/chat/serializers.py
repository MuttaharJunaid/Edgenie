from rest_framework import serializers
from .models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'role', 'content', 'references',
            'attached_file', 'created_at'
        ]
        read_only_fields = [
            'id', 'role', 'references', 'created_at'
        ]


class ChatSessionSerializer(serializers.ModelSerializer):
    last_message  = serializers.SerializerMethodField()
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id', 'subject', 'title', 'created_at',
            'updated_at', 'last_message', 'message_count'
        ]

    def get_last_message(self, obj):
        m = obj.messages.last()
        return m.content[:80] if m else ''

    def get_message_count(self, obj):
        return obj.messages.count()
