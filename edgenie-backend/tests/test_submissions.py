import pytest
from unittest.mock import patch, MagicMock
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
    return c, user


@pytest.mark.django_db
class TestSubmissions:
    @patch('apps.submissions.tasks.grade_submission.delay')
    def test_create_submission(self, mock_grade, auth_client):
        client, user = auth_client
        q = QuestionFactory()
        r = client.post('/api/submissions/', {
            'question': str(q.id),
            'answer_text': 'My answer here',
        })
        assert r.status_code == 201
        assert r.data['grading_status'] == 'pending'
        mock_grade.assert_called_once()

    def test_submission_requires_answer(self, auth_client):
        client, _ = auth_client
        q = QuestionFactory()
        r = client.post('/api/submissions/', {
            'question': str(q.id),
        })
        assert r.status_code == 400

    def test_list_my_submissions(self, auth_client):
        client, _ = auth_client
        r = client.get('/api/submissions/')
        assert r.status_code == 200


@pytest.mark.django_db
class TestMockExam:
    @patch('apps.submissions.tasks.generate_exam_feedback.delay')
    def test_create_mock_exam(self, mock_fb, auth_client):
        client, _ = auth_client
        from .factories import SubjectFactory
        subject = SubjectFactory()
        QuestionFactory.create_batch(15, paper__subject=subject)
        r = client.post('/api/mock-exams/', {
            'subject': str(subject.id),
            'duration_minutes': 60,
            'question_count': 10,
            'difficulty': 'mixed',
            'focus_weak_topics': False,
        })
        assert r.status_code == 201
        assert len(r.data['questions']) == 10
        assert r.data['status'] == 'pending'

    @patch('apps.submissions.tasks.grade_exam_answer.delay')
    def test_submit_exam_answer(self, mock_grade, auth_client):
        client, _ = auth_client
        from .factories import SubjectFactory
        subject = SubjectFactory()
        QuestionFactory.create_batch(5, paper__subject=subject)
        exam_r = client.post('/api/mock-exams/', {
            'subject': str(subject.id),
            'question_count': 5,
            'duration_minutes': 30,
            'difficulty': 'mixed',
            'focus_weak_topics': False,
        })
        exam_id = exam_r.data['id']
        q_id = exam_r.data['questions'][0]['id']
        r = client.post(
            f'/api/mock-exams/{exam_id}/answers/',
            {'question': q_id, 'answer_text': 'My answer'}
        )
        assert r.status_code == 201
