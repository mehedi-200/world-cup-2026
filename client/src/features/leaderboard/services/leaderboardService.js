import api from '@/services/api';

export const leaderboardService = {
  getAll: (params) => api.get('/leaderboard', { params }),
  getMyRank: () => api.get('/leaderboard/me'),
};

export default leaderboardService;
