import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ─── Base URL ────────────────────────────────────────
// Expo env var → Android emulator proxy → iOS localhost
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

// ─── Axios Client ────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor – attach JWT ────────────────
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor – auto-refresh on 401 ─────
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const refresh = await AsyncStorage.getItem('refreshToken');
        if (!refresh) throw new Error('No refresh token');

        const res = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, { refresh });
        const newAccess: string = res.data.access;
        const newRefresh: string = res.data.refresh || refresh;

        await AsyncStorage.setItem('accessToken', newAccess);
        await AsyncStorage.setItem('refreshToken', newRefresh);

        if (original.headers) {
          original.headers.Authorization = `Bearer ${newAccess}`;
        }
        return api(original);
      } catch {
        // Refresh failed — clear tokens (auth context will redirect to login)
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
