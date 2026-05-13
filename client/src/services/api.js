import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Build a readable error message
    if (error.response?.data) {
      const data = error.response.data;

      // If validation errors array exists, join them into message
      if (data.errors && Array.isArray(data.errors)) {
        error.response.data.message = data.errors.map((e) => e.message || e.msg).join('. ');
      }
    }

    // Auto-logout on 401 (but not on auth endpoints)
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Network error (server down)
    if (!error.response) {
      error.message = 'Cannot connect to server. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default api;
