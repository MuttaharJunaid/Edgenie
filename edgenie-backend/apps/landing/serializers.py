from rest_framework import serializers
from .models import WaitlistEntry, ContactSubmission


class WaitlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitlistEntry
        fields = ['id', 'email', 'name', 'source', 'referral_code', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class LandingStatsSerializer(serializers.Serializer):
    total_waitlist = serializers.IntegerField()
    total_users = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    subjects_count = serializers.IntegerField()
