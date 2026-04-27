import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestLanding:
    def test_waitlist_signup(self):
        c = APIClient()
        r = c.post('/api/landing/waitlist/', {
            'email': 'waitlist@test.com',
            'full_name': 'Test User',
            'role': 'student',
        })
        assert r.status_code == 201
        assert 'position' in r.data

    def test_duplicate_waitlist(self):
        c = APIClient()
        c.post('/api/landing/waitlist/',
               {'email': 'dup@test.com'})
        r = c.post('/api/landing/waitlist/',
                   {'email': 'dup@test.com'})
        assert r.status_code == 400

    def test_contact_form(self):
        c = APIClient()
        r = c.post('/api/landing/contact/', {
            'name': 'Test', 'email': 'test@test.com',
            'subject': 'Help', 'message': 'I need help',
        })
        assert r.status_code == 201

    def test_public_stats(self):
        r = APIClient().get('/api/landing/stats/')
        assert r.status_code == 200
        assert 'total_questions' in r.data
        assert 'total_subjects' in r.data
