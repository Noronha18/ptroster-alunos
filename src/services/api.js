import axios from 'axios';
import { getToken, clearAuth } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redirecionar se for erro 401 na rota de login ou se já estivermos na página de login
    const isLoginRoute = error.config?.url?.includes('/auth/token');
    if (error.response?.status === 401 && !isLoginRoute && window.location.pathname !== '/login') {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
