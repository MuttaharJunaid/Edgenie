import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAuthService = {
  login: (email, password) =>
    client.post('/api/auth/login/', { email, password }),
  logout: (refresh) =>
    client.post('/api/auth/logout/', { refresh }),
};

export const adminDashboardService = {
  getStats: () =>
    client.get('/api/admin-tools/dashboard/'),
};

export const adminUsersService = {
  list: (params) =>
    client.get('/api/admin-tools/users/', { params }),
  detail: (id) =>
    client.get(`/api/admin-tools/users/${id}/`),
  update: (id, data) =>
    client.patch(`/api/admin-tools/users/${id}/`, data),
};

export const adminQuestionService = {
  list: (params) =>
    client.get('/api/questions/', { params }),
  detail: (id) =>
    client.get(`/api/questions/${id}/`),
};

export const adminScraperService = {
  createJob: (data) =>
    client.post('/api/admin-tools/scraper/jobs/', data),
  listJobs: (params) =>
    client.get('/api/admin-tools/scraper/jobs/', { params }),
  getJob: (id) =>
    client.get(`/api/admin-tools/scraper/jobs/${id}/`),
  cancelJob: (id) =>
    client.post(`/api/admin-tools/scraper/jobs/${id}/cancel/`),
};

export const adminLogsService = {
  list: (params) =>
    client.get('/api/admin-tools/logs/', { params }),
};

export const adminAIStatsService = {
  get: () =>
    client.get('/api/admin-tools/ai-stats/'),
};

export const adminSettingsService = {
  get: () =>
    client.get('/api/admin-tools/settings/'),
  update: (data) =>
    client.patch('/api/admin-tools/settings/', data),
};

export default client;
