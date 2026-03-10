import axios from 'axios';

// Cles localStorage centralisees (doivent correspondre a authService.ts)
const TOKEN_KEY = 'mediconsult_token';
const USER_KEY = 'mediconsult_user';

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
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gerer les erreurs de reponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token expire ou non autorise
      if (error.response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
      // Acces interdit
      if (error.response.status === 403) {
        console.error('Acces interdit');
      }
      // Trop de requetes (rate limiting)
      if (error.response.status === 429) {
        console.error('Trop de requetes. Veuillez reessayer plus tard.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
