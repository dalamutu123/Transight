import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppRole } from '@/config/permissions';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AppRole;
  mustChangePassword: boolean;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearMustChangePassword: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearMustChangePassword: () =>
        set((state) => ({
          user: state.user ? { ...state.user, mustChangePassword: false } : null,
        })),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'transight-auth' }
  )
);