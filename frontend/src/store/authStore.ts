import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    username: string;
    role: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    loyalty_card_number?: string;
    loyalty_discount?: number;
    is_loyalty_confirmed?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    login: (user: User, token: string, refreshToken: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            login: (user, token, refreshToken) => set({ user, token, refreshToken }),
            logout: () => set({ user: null, token: null, refreshToken: null }),
            isAuthenticated: () => !!get().token,
        }),
        {
            name: 'auth-storage',
        }
    )
);
