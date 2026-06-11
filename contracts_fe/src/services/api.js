/**
 * API Service — Axios instance with JWT interceptors
 */
import axios from 'axios';

const getApiBase = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3005`;
  }
  return 'http://localhost:3005';
};

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clm_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('clm_refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE}/api/v1/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } }
          );
          const { access_token } = response.data;
          localStorage.setItem('clm_access_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch {
          // Refresh failed — redirect to SSO
          localStorage.clear();
          window.location.href = process.env.REACT_APP_SSO_URL || 'https://sso.erldc.in:3000';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Legacy API (for backward-compat endpoints)
export const legacyApi = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});
