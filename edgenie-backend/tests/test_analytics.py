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
class TestAnalytics:
    def test_dashboard(self, auth_client):
        r = auth_client.get('/api/analytics/dashboard/')
        assert r.status_code == 200
        assert 'subject_performance' in r.data
        assert 'recent_activity' in r.data

    def test_topics(self, auth_client):
        r = auth_client.get('/api/analytics/topics/')
        assert r.status_code == 200
        assert 'results' in r.data

    def test_activity(self, auth_client):
        r = auth_client.get('/api/analytics/activity/')
        assert r.status_code == 200

    def test_weak_topics(self, auth_client):
        r = auth_client.get('/api/analytics/weak-topics/')
        assert r.status_code == 200
        assert 'results' in r.data
