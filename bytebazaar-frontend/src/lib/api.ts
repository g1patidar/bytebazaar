import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Projects API
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  getByCategory: (category: string, page = 1, limit = 10) => 
    api.get(`/projects/category/${category}`, { params: { page, limit } }),
  create: (data: FormData) => api.post('/projects', data),
  update: (id: string, data: FormData) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  getStats: (timeframe: string) => api.get(`/projects/stats`, { params: { timeframe } }),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data: { name: string; description?: string }) => api.post('/categories', data),
  update: (id: string, data: { name: string; description?: string }) => 
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Users API
export const usersApi = {
  getAll: (page = 1, limit = 10) => api.get('/users', { params: { page, limit } }),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: (timeframe: string) => api.get(`/users/stats`, { params: { timeframe } }),
};

// Orders API
export const ordersApi = {
  getAll: (page = 1, limit = 10) => api.get('/orders', { params: { page, limit } }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: string) => api.delete(`/orders/${id}`),
  getStats: (timeframe: string) => api.get(`/orders/stats`, { params: { timeframe } }),
};

export default api; 