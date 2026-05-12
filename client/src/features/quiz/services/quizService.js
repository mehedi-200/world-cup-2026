import api from '@/services/api';

export const quizService = {
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  submitAttempt: (id, data) => api.post(`/quizzes/${id}/attempt`, data),
  getHistory: () => api.get('/quizzes/history'),
};

export default quizService;
