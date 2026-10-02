import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Employee } from '../types';
import { api } from '../lib/api';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateCurrentEmployee: (updated: Employee) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser<User>());
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    const token = storage.getToken();
    if (!token) {
      setUser(null);
      setEmployee(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.getMe();
      setUser(response.user);
      if (response.employee) {
        setEmployee(response.employee);
      }
      storage.setUser(response.user);
    } catch (err) {
      console.warn('Session expired or invalid', err);
      storage.clear();
      setUser(null);
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      storage.setToken(res.token);
      storage.setUser(res.user);
      setUser(res.user);
      setEmployee(res.employee || null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.clear();
    setUser(null);
    setEmployee(null);
  };

  const refreshUser = async () => {
    await initAuth();
  };

  const updateCurrentEmployee = (updated: Employee) => {
    setEmployee(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        logout,
        refreshUser,
        updateCurrentEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
