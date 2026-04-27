from django.urls import path
from .views import SearchQuestionsView, SearchSuggestionsView, TrendingSearchesView

urlpatterns = [
    path('questions/', SearchQuestionsView.as_view(), name='search_questions'),
    path('suggestions/', SearchSuggestionsView.as_view(), name='search_suggestions'),
    path('trending/', TrendingSearchesView.as_view(), name='trending_searches'),
]
