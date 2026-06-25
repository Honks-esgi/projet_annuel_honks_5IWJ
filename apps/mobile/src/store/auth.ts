import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = { id: string; name: string; username: string; email: string };

type AuthState = {
  user: AuthUser | null;
  login:  (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:   null,
      login:  (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'honks-auth', storage: createJSONStorage(() => AsyncStorage) }
  )
);
