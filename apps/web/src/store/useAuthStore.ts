import { create } from 'zustand';
import axios from 'axios';
import type { User, RegistrationData } from '@finvista/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  register: (data: RegistrationData) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  register: async (data) => {
    const { token } = get();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user });
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  },

  checkAuth: async () => {
    const { token } = get();
    if (!token) return;
    
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data, isAuthenticated: true });
    } catch (err) {
      console.error('Auth check failed:', err);
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  }
}));
