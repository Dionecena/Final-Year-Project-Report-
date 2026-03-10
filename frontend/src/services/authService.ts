import api from './api';

const TOKEN_KEY = 'mediconsult_token';
const USER_KEY = 'mediconsult_user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  email_verified_at?: string;
  created_at: string;
}

const authService = {
  /**
   * Connexion
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', credentials);
    const { user, token } = response.data.data || response.data;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return { user, token };
  },

  /**
   * Inscription
   */
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data.data || response.data;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return { user, token };
  },

  /**
   * Deconnexion
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      delete api.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Profil utilisateur connecte
   */
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    const user = response.data.data || response.data;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Modifier le profil
   */
  async updateProfile(data: Partial<User> & { password?: string; password_confirmation?: string }): Promise<User> {
    const response = await api.put('/auth/profile', data);
    const user = response.data.data || response.data;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Mot de passe oublie
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset mot de passe
   */
  async resetPassword(data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Verifier si l'utilisateur est authentifie
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Recuperer l'utilisateur courant depuis le localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Recuperer le token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Initialiser le header Authorization si un token existe
   * A appeler au demarrage de l'app
   */
  initAuth(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};

export default authService;
