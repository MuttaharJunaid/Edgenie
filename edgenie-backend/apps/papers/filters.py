import django_filters
from .models import Question

class QuestionFilter(django_filters.FilterSet):
    subject = django_filters.UUIDFilter(field_name='paper__subject__id')
    topic = django_filters.UUIDFilter(field_name='topic__id')
    year_from = django_filters.NumberFilter(field_name='paper__year', lookup_expr='gte')
    year_to = django_filters.NumberFilter(field_name='paper__year', lookup_expr='lte')
    session = django_filters.CharFilter(field_name='paper__session')
    difficulty = django_filters.CharFilter(field_name='difficulty')
    has_image = django_filters.BooleanFilter(method='filter_has_image')
    has_parts = django_filters.BooleanFilter(method='filter_has_parts')

    class Meta:
        model = Question
        fields = ['subject', 'topic', 'year_from', 'year_to', 'session', 'difficulty']

    def filter_has_image(self, queryset, name, value):
        from django.db.models import Q
        if value:
            return queryset.filter(Q(image_url__isnull=False) | Q(question_parts__image_url__isnull=False)).distinct()
        return queryset.filter(Q(image_url__isnull=True) & Q(question_parts__image_url__isnull=True)).distinct()

    def filter_has_parts(self, queryset, name, value):
        if value:
            return queryset.filter(question_parts__isnull=False).distinct()
        return queryset.filter(question_parts__isnull=True)
