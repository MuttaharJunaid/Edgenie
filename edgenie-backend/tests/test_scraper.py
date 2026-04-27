import pytest
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from .factories import AdminFactory, ScraperJobFactory


@pytest.fixture
def admin_client():
    admin = AdminFactory()
    c = APIClient()
    r = c.post('/api/auth/login/', {
        'email': admin.email, 'password': 'TestPass123!'
    })
    c.credentials(
        HTTP_AUTHORIZATION=f'Bearer {r.data["access"]}'
    )
    return c


@pytest.mark.django_db
class TestScraper:
    @patch('apps.scraper.tasks.run_scraper_job.delay')
    def test_create_scraper_job(self, mock_task, admin_client):
        r = admin_client.post(
            '/api/admin-tools/scraper/jobs/',
            {
                'subject_code': '5090',
                'year': '2020',
                'session': 'may-june',
                'paper_type': 'qp',
                'variant': '11',
            }
        )
        assert r.status_code == 201
        assert r.data['status'] == 'queued'
        mock_task.assert_called_once()

    def test_student_cannot_create_job(self):
        from .factories import UserFactory
        student = UserFactory()
        c = APIClient()
        r_login = c.post('/api/auth/login/', {
            'email': student.email, 'password': 'TestPass123!'
        })
        c.credentials(
            HTTP_AUTHORIZATION=f'Bearer {r_login.data["access"]}'
        )
        r = c.post('/api/admin-tools/scraper/jobs/', {
            'subject_code': '5090', 'year': '2020',
            'session': 'may-june', 'paper_type': 'qp',
            'variant': '11',
        })
        assert r.status_code == 403

    def test_get_job_status(self, admin_client):
        job = ScraperJobFactory()
        r = admin_client.get(
            f'/api/admin-tools/scraper/jobs/{job.id}/'
        )
        assert r.status_code == 200
        assert 'progress' in r.data
        assert 'status' in r.data

    def test_admin_dashboard(self, admin_client):
        r = admin_client.get('/api/admin-tools/dashboard/')
        assert r.status_code == 200
        assert 'total_users' in r.data
        assert 'total_questions' in r.data

    def test_list_users(self, admin_client):
        r = admin_client.get('/api/admin-tools/users/')
        assert r.status_code == 200
        assert 'results' in r.data

    def test_system_logs(self, admin_client):
        r = admin_client.get('/api/admin-tools/logs/')
        assert r.status_code == 200

    def test_ai_stats(self, admin_client):
        r = admin_client.get('/api/admin-tools/ai-stats/')
        assert r.status_code == 200
