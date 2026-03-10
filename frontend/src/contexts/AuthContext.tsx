import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const profile = await authService.getProfile();
        setUser(profile as User);
      }
    } catch {
      setUser(null);
      await authService.logout();
    }
  }, []);

  useEffect(() => {
    // Initialiser le header Authorization au demarrage
    authService.initAuth();

    // Charger l'utilisateur depuis le localStorage
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser as User);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response.user as User);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user as User);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider');
  }
  return context;
};
