import { api } from './api';
import type { AuthUser } from '@/store/authStore';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload).then((res) => res.data.data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ success: boolean; data: AuthUser }>('/auth/me').then((res) => res.data.data),
};