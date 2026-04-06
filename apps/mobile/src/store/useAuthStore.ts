import { create } from 'zustand';
import { User, RegistrationData } from '@finvista/types';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const API_URL = 'http://192.168.1.6:5000/api'; // Reachable by emulators and devices on same Wi-Fi

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
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
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data, token, isAuthenticated: true });
    } catch (err) {
      console.error('Auth check failed:', err);
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  }
}));
