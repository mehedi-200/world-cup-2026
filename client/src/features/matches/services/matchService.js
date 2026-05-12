import api from '@/services/api';

export const matchService = {
  getAll: (params) => api.get('/matches', { params }),
  getById: (id) => api.get(`/matches/${id}`),
  getLive: () => api.get('/matches/live'),
};

export default matchService;
