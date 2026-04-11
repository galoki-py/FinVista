import { create } from 'zustand';
import axios from 'axios';
import type { User } from '@finvista/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loginWithGoogle: (credential: string) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  setUser: (user: User) => void;
  signup: (data: any) => Promise<void>;
  completeProfile: (data: any) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  setAuth: (user: User, token: string) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  setUser: (user: User) => set({ user }),
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loginWithGoogle: async (credential: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { idToken: credential });
      get().setAuth(response.data.user, response.data.token);
    } catch (err) {
      console.error('Google login failed:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      get().setAuth(response.data.user, response.data.token);
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      get().setAuth(response.data.user, response.data.token);
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  completeProfile: async (data) => {
    const { token } = get();
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user });
    } catch (err) {
      console.error('Profile completion failed:', err);
      throw err;
    } finally {
      set({ isLoading: false });
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
