from rest_framework import serializers
from .models import ScraperJob


class ScraperJobSerializer(serializers.ModelSerializer):
    initiated_by_email = serializers.CharField(
        source='initiated_by.email', read_only=True, default=None
    )

    class Meta:
        model = ScraperJob
        fields = [
            'id', 'initiated_by_email', 'subject_code', 'year', 'session',
            'paper_type', 'variant', 'status', 'progress',
            'total_questions', 'classified_questions',
            'error_message', 'started_at', 'completed_at', 'created_at',
        ]
        read_only_fields = [
            'id', 'initiated_by_email', 'status', 'progress',
            'total_questions', 'classified_questions',
            'error_message', 'started_at', 'completed_at', 'created_at',
        ]


class StartScrapeSerializer(serializers.Serializer):
    subject_code = serializers.CharField(max_length=10)
    year = serializers.CharField(max_length=4)
    session = serializers.ChoiceField(choices=['May/June', 'Oct/Nov', 'Feb/March'])
    paper_type = serializers.CharField(max_length=5, default='qp')
    variant = serializers.CharField(max_length=5, default='1')
