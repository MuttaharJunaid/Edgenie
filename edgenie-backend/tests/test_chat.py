import pytest
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from .factories import UserFactory


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
class TestChat:
    def test_create_session(self, auth_client):
        r = auth_client.post('/api/chat/sessions/', {})
        assert r.status_code == 201
        assert 'id' in r.data

    @patch('apps.chat.services.GeminiChatbotService.respond')
    def test_send_message(self, mock_respond, auth_client):
        mock_respond.return_value = {
            'content': 'Photosynthesis is the process...',
            'references': [],
        }
        session_r = auth_client.post('/api/chat/sessions/', {})
        session_id = session_r.data['id']
        r = auth_client.post(
            f'/api/chat/sessions/{session_id}/messages/',
            {'content': 'Explain photosynthesis'}
        )
        assert r.status_code == 201
        assert r.data['role'] == 'assistant'
        assert len(r.data['content']) > 0

    def test_message_wrong_session(self, auth_client):
        import uuid
        fake_id = uuid.uuid4()
        r = auth_client.post(
            f'/api/chat/sessions/{fake_id}/messages/',
            {'content': 'Hello'}
        )
        assert r.status_code == 404

    def test_message_requires_content(self, auth_client):
        session_r = auth_client.post('/api/chat/sessions/', {})
        session_id = session_r.data['id']
        r = auth_client.post(
            f'/api/chat/sessions/{session_id}/messages/',
            {}
        )
        assert r.status_code == 400
