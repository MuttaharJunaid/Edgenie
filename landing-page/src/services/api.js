import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const landingService = {
  joinWaitlist: (data) =>
    axios.post(`${BASE_URL}/api/landing/waitlist/`, data),

  submitContact: (data) =>
    axios.post(`${BASE_URL}/api/landing/contact/`, data),

  getPublicStats: () =>
    axios.get(`${BASE_URL}/api/landing/stats/`),
};

export default landingService;
