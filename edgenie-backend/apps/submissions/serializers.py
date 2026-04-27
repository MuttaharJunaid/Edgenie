from rest_framework import serializers
from .models import Submission, MockExam, MockExamAnswer
from apps.papers.serializers import QuestionListSerializer
import bleach

class SubmissionSerializer(serializers.ModelSerializer):
    question_detail = QuestionListSerializer(source='question', read_only=True)

    class Meta:
        model = Submission
        fields = [
            'id', 'question', 'question_detail', 'answer_text', 'answer_image',
            'ai_marks', 'ai_feedback', 'improvement_tips', 'score_percentage',
            'grading_status', 'submitted_at', 'graded_at'
        ]
        read_only_fields = [
            'ai_marks', 'ai_feedback', 'improvement_tips', 'score_percentage',
            'grading_status', 'graded_at'
        ]

    def validate(self, attrs):
        if not attrs.get('answer_text') and not attrs.get('answer_image'):
            raise serializers.ValidationError("Either answer_text or answer_image is required.")
        return attrs

    def validate_answer_text(self, value):
        if len(value) > 5000:
            raise serializers.ValidationError("Answer text is too long (max 5000 chars).")
        return bleach.clean(value)


class MockExamCreateSerializer(serializers.Serializer):
    subject = serializers.UUIDField()
    duration_minutes = serializers.IntegerField(min_value=15, max_value=180, default=60)
    topics = serializers.ListField(child=serializers.UUIDField(), default=list)
    difficulty = serializers.ChoiceField(choices=['easy', 'mixed', 'hard'], default='mixed')
    question_count = serializers.IntegerField(min_value=5, max_value=50, default=20)
    focus_weak_topics = serializers.BooleanField(default=False)


class MockExamAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockExamAnswer
        fields = ['id', 'question', 'answer_text', 'answer_image', 'marks_obtained', 'ai_feedback', 'submitted_at']
        read_only_fields = ['marks_obtained']


class MockExamSerializer(serializers.ModelSerializer):
    subject = serializers.SerializerMethodField()
    questions = QuestionListSerializer(many=True, read_only=True)
    answers = MockExamAnswerSerializer(many=True, read_only=True)
    score_percentage = serializers.ReadOnlyField()

    class Meta:
        model = MockExam
        fields = [
            'id', 'subject', 'questions', 'answers', 'duration_minutes',
            'started_at', 'completed_at', 'total_marks', 'obtained_marks',
            'score_percentage', 'status', 'topic_breakdown', 'question_results',
            'ai_feedback', 'config', 'created_at'
        ]

    def get_subject(self, obj):
        return {
            'id': obj.subject.id,
            'name': obj.subject.name,
            'code': obj.subject.code
        }
