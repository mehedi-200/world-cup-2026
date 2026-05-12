import api from '@/services/api';

export const groupService = {
  getAll: () => api.get('/groups'),
  getById: (id) => api.get(`/groups/${id}`),
};

export default groupService;
