import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Don't attach token for login/register requests
  if (token && !config.url?.includes('/auth/login') && !config.url?.includes('/auth/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error or server down (no response at all)
    if (!error.response) {
      error.message = 'Cannot connect to server. Please make sure the backend is running.';
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Build a readable error message
    if (data) {
      // Validation errors array → join into message
      if (data.errors && Array.isArray(data.errors)) {
        data.message = data.errors.map((e) => e.message || e.msg).join('. ');
      }

      // 500 with no useful message → make it readable
      if (status === 500 && (!data.message || data.message === 'Something went wrong')) {
        data.message = 'Server error. Please make sure the backend is running.';
      }
    }

    // Auto-logout on 401 (but not on auth endpoints)
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/');
    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
