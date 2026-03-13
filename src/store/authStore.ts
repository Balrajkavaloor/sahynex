import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clear: () => void;
}

const TOKEN_KEY = 'token';

export const useAuthStore = create<AuthState>(set => ({
  token: typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null,
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
    set({ token });
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    set({ token: null });
  }
}));

