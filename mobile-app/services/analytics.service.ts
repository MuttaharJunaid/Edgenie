import api from './api';

export const analyticsService = {
  getDashboard: () =>
    api.get('/api/analytics/dashboard/'),

  getTopics: () =>
    api.get('/api/analytics/topics/'),

  getActivity: (days: number = 30) =>
    api.get('/api/analytics/activity/', { params: { days } }),

  getWeakTopics: () =>
    api.get('/api/analytics/weak-topics/'),

  getSubjectDetail: (subjectId: string) =>
    api.get('/api/analytics/subject/', { params: { subject_id: subjectId } }),
};

export default analyticsService;
