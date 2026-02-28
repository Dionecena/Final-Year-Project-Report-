import axios from 'axios';

// Configuration de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur pour ajouter le token d'authentification
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

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token expiré ou non autorisé
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // Accès interdit
      if (error.response.status === 403) {
        console.error('Accès interdit');
      }
      // Trop de requêtes (rate limiting)
      if (error.response.status === 429) {
        console.error('Trop de requêtes. Veuillez réessayer plus tard.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
