import api from './api';

export const papersService = {
  getSubjects: () =>
    api.get('/api/subjects/'),

  getTopics: (subjectId: string) =>
    api.get(`/api/topics/`, { params: { subject: subjectId } }),

  getQuestions: (params?: Record<string, any>) =>
    api.get('/api/questions/', { params }),

  getQuestion: (id: string) =>
    api.get(`/api/questions/${id}/`),

  getPapers: (params?: Record<string, any>) =>
    api.get('/api/papers/', { params }),
};

export default papersService;
