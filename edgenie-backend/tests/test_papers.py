import pytest
from rest_framework.test import APIClient
from .factories import (
    UserFactory, SubjectFactory, TopicFactory,
    PaperFactory, QuestionFactory
)


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
class TestSubjects:
    def test_list_subjects(self, auth_client):
        SubjectFactory.create_batch(3)
        r = auth_client.get('/api/subjects/')
        assert r.status_code == 200
        assert r.data['count'] >= 3

    def test_subject_has_topics_count(self, auth_client):
        s = SubjectFactory()
        TopicFactory.create_batch(5, subject=s)
        r = auth_client.get(f'/api/subjects/{s.id}/')
        assert r.status_code == 200
        assert r.data['topics_count'] == 5


@pytest.mark.django_db
class TestQuestions:
    def test_list_questions(self, auth_client):
        QuestionFactory.create_batch(5)
        r = auth_client.get('/api/questions/')
        assert r.status_code == 200
        assert r.data['count'] >= 5

    def test_filter_by_difficulty(self, auth_client):
        QuestionFactory.create_batch(3, difficulty='hard')
        QuestionFactory.create_batch(2, difficulty='easy')
        r = auth_client.get('/api/questions/?difficulty=hard')
        assert r.status_code == 200
        for q in r.data['results']:
            assert q['difficulty'] == 'hard'

    def test_question_detail(self, auth_client):
        q = QuestionFactory()
        r = auth_client.get(f'/api/questions/{q.id}/')
        assert r.status_code == 200
        assert r.data['id'] == str(q.id)
        assert 'marking_scheme' in r.data
        assert 'question_parts' in r.data

    def test_requires_auth(self):
        c = APIClient()
        r = c.get('/api/questions/')
        assert r.status_code == 401
