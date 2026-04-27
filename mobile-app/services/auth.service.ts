import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
}

export const authService = {
  login: (data: LoginPayload) =>
    api.post('/api/auth/login/', data),

  register: (data: RegisterPayload) =>
    api.post('/api/auth/register/', data),

  logout: async () => {
    const refresh = await AsyncStorage.getItem('refreshToken');
    return api.post('/api/auth/logout/', { refresh });
  },

  getMe: () =>
    api.get('/api/auth/me/'),

  updateMe: (data: Record<string, unknown>) =>
    api.patch('/api/auth/me/', data),

  getStats: () =>
    api.get('/api/auth/me/stats/'),

  refreshToken: (refresh: string) =>
    api.post('/api/auth/token/refresh/', { refresh }),

  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post('/api/auth/me/change-password/', data),

  // ─── Token helpers ────────────────────────────
  storeTokens: async (access: string, refresh: string) => {
    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
  },

  storeUser: async (user: Record<string, unknown>) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  },

  getStoredUser: async () => {
    const raw = await AsyncStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  },
};

export default authService;
