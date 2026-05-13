import api from '@/services/api';

const adminService = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  getActivity: (limit) => api.get('/admin/activity', { params: { limit } }),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Matches
  getMatches: (params) => api.get('/matches', { params }),
  createMatch: (data) => api.post('/matches', data),
  updateMatch: (id, data) => api.put(`/matches/${id}`, data),
  deleteMatch: (id) => api.delete(`/matches/${id}`),
  addMatchEvent: (id, data) => api.post(`/matches/${id}/events`, data),

  // Teams
  getTeams: () => api.get('/teams'),
  createTeam: (data) => api.post('/teams', data),
  updateTeam: (id, data) => api.put(`/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  updateStandings: (id, data) => api.put(`/teams/${id}/standings`, data),

  // Groups
  getGroups: () => api.get('/groups'),
  createGroup: (data) => api.post('/groups', data),
  updateGroup: (id, data) => api.put(`/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/groups/${id}`),

  // Quizzes
  getAllQuizzes: () => api.get('/quizzes/admin/all'),
  createQuiz: (data) => api.post('/quizzes', data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  addQuestion: (quizId, data) => api.post(`/quizzes/${quizId}/questions`, data),
  updateQuestion: (qid, data) => api.put(`/quizzes/questions/${qid}`, data),
  deleteQuestion: (qid) => api.delete(`/quizzes/questions/${qid}`),

  // Polls
  getAllPolls: () => api.get('/polls/admin/all'),
  createPoll: (data) => api.post('/polls', data),
  updatePoll: (id, data) => api.put(`/polls/${id}`, data),
  deletePoll: (id) => api.delete(`/polls/${id}`),
  addPollOption: (pollId, data) => api.post(`/polls/${pollId}/options`, data),
  deletePollOption: (oid) => api.delete(`/polls/options/${oid}`),

  // Predictions
  scorePredictions: (matchId) => api.post(`/predictions/score/${matchId}`),
  scoreAllPredictions: () => api.post('/predictions/score/all'),
};

export default adminService;
