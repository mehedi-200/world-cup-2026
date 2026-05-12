import api from '@/services/api';

export const predictionService = {
  getAll: (params) => api.get('/predictions', { params }),
  create: (data) => api.post('/predictions', data),
  update: (id, data) => api.put(`/predictions/${id}`, data),
  getByMatch: (matchId) => api.get(`/predictions/match/${matchId}`),
};

export default predictionService;
