from rest_framework import serializers
from .models import SearchLog
from apps.papers.serializers import QuestionListSerializer


class SearchQuerySerializer(serializers.Serializer):
    query = serializers.CharField(max_length=500)
    subject_code = serializers.CharField(max_length=10, required=False, default='')
    year_from = serializers.IntegerField(required=False, default=2010)
    year_to = serializers.IntegerField(required=False, default=2025)
    topic_id = serializers.UUIDField(required=False, default=None)


class SearchResultSerializer(serializers.Serializer):
    questions = QuestionListSerializer(many=True)
    total_count = serializers.IntegerField()
    query = serializers.CharField()
    suggestions = serializers.ListField(child=serializers.CharField())


class SearchLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchLog
        fields = ['id', 'query', 'subject', 'result_count', 'searched_at']


class SearchSuggestionSerializer(serializers.Serializer):
    text = serializers.CharField()
    category = serializers.CharField()
    count = serializers.IntegerField()
