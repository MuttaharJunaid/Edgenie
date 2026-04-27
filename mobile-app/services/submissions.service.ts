import api from './api';

export interface SubmitAnswerPayload {
  question: string;       // question UUID
  answer_text?: string;
  answer_image?: unknown;     // CloudinaryField or multipart
}

export interface MockExamCreatePayload {
  subject: string;        // subject UUID
  duration_minutes?: number;
  topics?: string[];      // topic UUIDs
  difficulty?: 'easy' | 'mixed' | 'hard';
  question_count?: number;
  focus_weak_topics?: boolean;
}

export const submissionsService = {
  // ─── Single-question submissions ──────────────
  submit: (data: SubmitAnswerPayload) =>
    api.post('/api/submissions/', data),

  submitWithImage: (formData: FormData) =>
    api.post('/api/submissions/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getSubmission: (id: string) =>
    api.get(`/api/submissions/${id}/`),

  getMySubmissions: (questionId?: string) =>
    api.get('/api/submissions/', {
      params: questionId ? { question: questionId } : {},
    }),

  // ─── Mock exams ───────────────────────────────
  createMockExam: (data: MockExamCreatePayload) =>
    api.post('/api/mock-exams/', data),

  getMockExam: (id: string) =>
    api.get(`/api/mock-exams/${id}/`),

  submitMockExamAnswer: (examId: string, data: { question: string; answer_text?: string; answer_image?: unknown }) =>
    api.post(`/api/mock-exams/${examId}/answers/`, data),

  submitMockExam: (examId: string) =>
    api.post(`/api/mock-exams/${examId}/submit/`),

  // ─── Feedback ─────────────────────────────────
  submitFeedback: (data: { session_type: string; rating: number; comment?: string }) =>
    api.post('/api/feedback/', data),
};

export default submissionsService;
