import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from .factories import UserFactory, SubjectFactory

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def user():
    return UserFactory()

@pytest.fixture
def auth_client(user):
    c = APIClient()
    r = c.post('/api/auth/login/',
               {'email': user.email, 'password': 'TestPass123!'})
    c.credentials(
        HTTP_AUTHORIZATION=f'Bearer {r.data["access"]}'
    )
    return c


@pytest.mark.django_db
class TestRegister:
    def test_register_creates_user(self, client):
        r = client.post('/api/auth/register/', {
            'email': 'new@test.com',
            'full_name': 'New User',
            'password': 'Secure123!',
            'confirm_password': 'Secure123!',
        })
        assert r.status_code == 201
        assert 'access' in r.data
        assert 'refresh' in r.data
        assert r.data['user']['email'] == 'new@test.com'

    def test_register_duplicate_email(self, client, user):
        r = client.post('/api/auth/register/', {
            'email': user.email,
            'full_name': 'Another',
            'password': 'Secure123!',
            'confirm_password': 'Secure123!',
        })
        assert r.status_code == 400
        assert r.data['error'] is True

    def test_register_password_mismatch(self, client):
        r = client.post('/api/auth/register/', {
            'email': 'x@test.com',
            'full_name': 'X',
            'password': 'Secure123!',
            'confirm_password': 'Different!',
        })
        assert r.status_code == 400

    def test_register_creates_student_profile(self, client):
        r = client.post('/api/auth/register/', {
            'email': 'prof@test.com',
            'full_name': 'Prof',
            'password': 'Secure123!',
            'confirm_password': 'Secure123!',
        })
        assert r.status_code == 201
        assert r.data['user']['studentprofile'] is not None


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, client, user):
        r = client.post('/api/auth/login/', {
            'email': user.email,
            'password': 'TestPass123!'
        })
        assert r.status_code == 200
        assert 'access' in r.data
        assert r.data['user']['id'] == str(user.id)

    def test_login_wrong_password(self, client, user):
        r = client.post('/api/auth/login/', {
            'email': user.email, 'password': 'wrong'
        })
        assert r.status_code == 400

    def test_login_nonexistent_user(self, client):
        r = client.post('/api/auth/login/', {
            'email': 'nobody@test.com', 'password': 'x'
        })
        assert r.status_code == 400


@pytest.mark.django_db
class TestMe:
    def test_get_me(self, auth_client, user):
        r = auth_client.get('/api/auth/me/')
        assert r.status_code == 200
        assert r.data['email'] == user.email

    def test_me_requires_auth(self, client):
        r = client.get('/api/auth/me/')
        assert r.status_code == 401

    def test_update_me(self, auth_client):
        r = auth_client.patch('/api/auth/me/', {
            'full_name': 'Updated Name'
        })
        assert r.status_code == 200
        assert r.data['full_name'] == 'Updated Name'

    def test_update_subjects(self, auth_client):
        s = SubjectFactory()
        r = auth_client.patch('/api/auth/me/', {
            'subject_ids': [str(s.id)]
        })
        assert r.status_code == 200

    def test_get_stats(self, auth_client):
        r = auth_client.get('/api/auth/me/stats/')
        assert r.status_code == 200
        assert 'total_questions_practiced' in r.data
        assert 'overall_accuracy' in r.data
        assert 'streak_days' in r.data
