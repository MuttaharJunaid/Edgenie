import api from './api';

export interface SearchPayload {
  query: string;
  subject_id?: string;
  topic_id?: string;
  difficulty?: string;
  year_from?: number;
  year_to?: number;
}

export const searchService = {
  search: (payload: SearchPayload) =>
    api.post('/api/search/questions/', payload),

  getSuggestions: (q: string) =>
    api.get('/api/search/suggestions/', { params: { q } }),

  getTrending: () =>
    api.get('/api/search/trending/'),
};

export default searchService;
