import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Automatically attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('glass_qc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('glass_qc_token');
      localStorage.removeItem('glass_qc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
