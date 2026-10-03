import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import {
  authenticateUser,
  clearSession,
  getCurrentSession,
  initializeDatabase,
  registerNewUser,
  updateUserProfile,
} from '../db/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    birthDate: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      await initializeDatabase();
      const current = getCurrentSession();
      setUser(current);
      setLoading(false);
    }
    init();
  }, []);

  const login = async (emailOrPhone: string, pass: string) => {
    try {
      const loggedUser = await authenticateUser(emailOrPhone, pass);
      if (loggedUser) {
        setUser(loggedUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials or account does not exist.' };
    } catch {
      return { success: false, error: 'Authentication failed. Please check your network or input.' };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    birthDate: string;
  }) => {
    try {
      const res = await registerNewUser(data);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to register account.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration error.';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = await updateUserProfile({ id: user.id, ...data });
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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
