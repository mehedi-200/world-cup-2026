import api from '@/services/api';

export const votingService = {
  getAll: () => api.get('/polls'),
  getById: (id) => api.get(`/polls/${id}`),
  castVote: (id, optionId) => api.post(`/polls/${id}/vote`, { option_id: optionId }),
};

export default votingService;
