import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  saveUser,
  getUser,
  clearStorage,
  StoredUser,
} from '../utils/authStorage';
import { Alert } from 'react-native';
import { API_ENDPOINTS } from '../config/api';

type AuthContextType = {
  user: StoredUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  setRole: (role: string) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setRole = (_role: string) => {};

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        Alert.alert('Register failed', data?.message ?? 'Something went wrong');
        return false;
      }

      const data = await res.json();
      const token = data.token;
      const userData: StoredUser = {
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: data.role.toLowerCase(),
      };

      setUser(userData);
      await saveUser(userData, token);
      return true;
    } catch {
      Alert.alert('Register failed', 'Something went wrong');
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const token = data.token;
      const userData: StoredUser = {
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: data.role.toLowerCase(),
      };

      setUser(userData);
      await saveUser(userData, token);
      return true;
    } catch {
      Alert.alert('Login failed', 'Something went wrong. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await clearStorage();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, setRole, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used inside AuthProvider');
  return ctx;
};
