from rest_framework import serializers
from .models import Subject, Topic, Paper, Question, QuestionPart

class SubjectSerializer(serializers.ModelSerializer):
    topics_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'board', 'level', 'icon_url', 'color_hex', 'topics_count']

    def get_topics_count(self, obj):
        return obj.topics.count()


class TopicSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'questions_count']


class PaperSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Paper
        fields = ['id', 'subject', 'year', 'session', 'paper_number', 'variant', 'total_marks', 'pdf_url']


class QuestionPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionPart
        fields = ['id', 'part_label', 'part_text', 'marking_answer', 'marks', 'image_url']

class MiniTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']

class MiniSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'color_hex']

class MiniPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ['id', 'year', 'session', 'paper_number', 'pdf_url']


class QuestionListSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()
    topic = MiniTopicSerializer(read_only=True)
    subject = serializers.SerializerMethodField()
    paper = MiniPaperSerializer(read_only=True)
    parts_preview = serializers.SerializerMethodField()
    relevance_score = serializers.SerializerMethodField()
    has_image = serializers.SerializerMethodField()
    has_parts = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'question_number', 'text', 'marks', 'difficulty',
            'has_image', 'has_parts', 'topic', 'subject', 'paper',
            'parts_preview', 'relevance_score'
        ]

    def get_text(self, obj):
        return obj.text[:150] + ('...' if len(obj.text) > 150 else '')

    def get_subject(self, obj):
        if obj.paper and obj.paper.subject:
            s = obj.paper.subject
            return {'id': s.id, 'name': s.name, 'code': s.code, 'color_hex': s.color_hex}
        return None

    def get_parts_preview(self, obj):
        parts = obj.question_parts.all()[:3]
        return [f"{p.part_label}: {p.part_text[:60]}" for p in parts]

    def get_relevance_score(self, obj):
        return getattr(obj, '_relevance_score', 0.0)

    def get_has_image(self, obj):
        return bool(obj.image_url) or obj.question_parts.filter(image_url__isnull=False).exists()

    def get_has_parts(self, obj):
        return obj.question_parts.exists()


class QuestionDetailSerializer(QuestionListSerializer):
    question_parts = QuestionPartSerializer(many=True, read_only=True)
    marking_scheme = serializers.CharField()
    unit = serializers.SerializerMethodField()
    sub_topics = serializers.SerializerMethodField()
    tags = serializers.JSONField()
    full_text = serializers.CharField(source='text')

    class Meta:
        model = Question
        fields = QuestionListSerializer.Meta.fields + [
            'marking_scheme', 'question_parts', 'unit', 'sub_topics',
            'tags', 'full_text'
        ]

    def get_unit(self, obj):
        return None # Simplified schema doesn't have units anymore

    def get_sub_topics(self, obj):
        return [] # Simplified schema doesn't have subtopics anymore
