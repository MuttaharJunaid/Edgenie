import api from './api';

export const chatService = {
  getSessions: () =>
    api.get('/api/chat/sessions/'),

  createSession: (data?: { subject?: string; title?: string }) =>
    api.post('/api/chat/sessions/', data || {}),

  getMessages: (sessionId: string) =>
    api.get(`/api/chat/sessions/${sessionId}/messages/`),

  sendMessage: (
    sessionId: string,
    content: string,
    file?: { uri: string; type?: string; name?: string },
    subjectId?: string,
  ) => {
    if (file) {
      const formData = new FormData();
      formData.append('content', content);
      if (subjectId) formData.append('subject_id', subjectId);
      // @ts-ignore — React Native FormData accepts { uri, type, name }
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'attachment.pdf',
      });
      return api.post(
        `/api/chat/sessions/${sessionId}/messages/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
    }
    return api.post(`/api/chat/sessions/${sessionId}/messages/`, {
      content,
      subject_id: subjectId,
    });
  },
};

export default chatService;
