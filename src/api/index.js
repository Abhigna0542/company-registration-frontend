import axios from 'axios';

// Use environment variable for API URL - FIXED FALLBACK
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://company-registration-backend.onrender.com/api';

console.log('API Configuration:', {
  baseURL: API_BASE_URL,
  environment: import.meta.env.MODE
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API - CORRECTED ROUTES (match your backend)
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Company API - CORRECTED ROUTES (match your backend routes)
export const companyAPI = {
  // Your backend has GET /company and POST /company
  getCompanies: () => api.get('/company'),
  createCompany: (companyData) => api.post('/company', companyData),
  updateCompany: (id, companyData) => api.put(`/company/${id}`, companyData),
  deleteCompany: (id) => api.delete(`/company/${id}`),
  
  // File upload endpoints (you need to create these in backend)
  uploadLogo: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/company/upload', formData, config); // Single upload endpoint
  },
};

export default api;
