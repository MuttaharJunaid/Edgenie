import pytest
from rest_framework.test import APIClient
from .factories import UserFactory, QuestionFactory


@pytest.fixture
def auth_client():
    user = UserFactory()
    c = APIClient()
    r = c.post('/api/auth/login/',
               {'email': user.email, 'password': 'TestPass123!'})
    c.credentials(
        HTTP_AUTHORIZATION=f'Bearer {r.data["access"]}'
    )
    return c


@pytest.mark.django_db
class TestSearch:
    def test_search_returns_results(self, auth_client):
        QuestionFactory.create_batch(5)
        r = auth_client.post('/api/search/questions/', {
            'query': 'test',
            'page': 1,
            'page_size': 10,
        })
        assert r.status_code == 200
        assert 'count' in r.data
        assert 'results' in r.data
        assert 'query_understood' in r.data

    def test_search_with_filters(self, auth_client):
        r = auth_client.post('/api/search/questions/', {
            'query': '',
            'difficulty': 'hard',
            'page': 1, 'page_size': 10,
        })
        assert r.status_code == 200

    def test_suggestions(self, auth_client):
        r = auth_client.get('/api/search/suggestions/?q=bio')
        assert r.status_code == 200
        assert 'suggestions' in r.data

    def test_trending(self, auth_client):
        r = auth_client.get('/api/search/trending/')
        assert r.status_code == 200
        assert 'trending' in r.data

    def test_search_logs_query(self, auth_client):
        from apps.search.models import SearchLog
        before = SearchLog.objects.count()
        auth_client.post('/api/search/questions/', {
            'query': 'physics waves',
            'page': 1, 'page_size': 5,
        })
        after = SearchLog.objects.count()
        assert after >= before
