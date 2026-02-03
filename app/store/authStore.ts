import { create } from "zustand";

interface Business {
  id: string;
  name: string;
  businessLogo: string;
}

interface User {
  name: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  profileImageUrl: string;
  id: string;
}

interface AuthState {
  user: User | null;
  businesses: Business[];

  setUser: (user: User | null) => void;
  setBusinesses: (businesses: Business[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  businesses: [],

  setUser: (user) => set({ user }),

  setBusinesses: (businesses) => set({ businesses }),

  logout: () =>
    set({
      user: null,
      businesses: [],
    }),
}));
