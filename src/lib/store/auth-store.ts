import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Admin, AuthState } from "@/types/auth";
import { tokenManager } from "@/lib/token-manager";

interface AuthStore extends AuthState {
  setAuth: (admin: Admin, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateAdmin: (admin: Partial<Admin>) => void;
  hydrate: () => void;
}

// Simple storage that handles SSR
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch (_error) {
      console.warn("localStorage not available");
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch (_error) {
      console.warn("localStorage not available");
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch (_error) {
      console.warn("localStorage not available");
    }
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true

      setAuth: (admin: Admin, token: string) => {
        console.log("Setting auth:", { admin: !!admin, token: !!token });
        set({
          admin,
          token,
          isAuthenticated: !!(admin && token),
          isLoading: false,
        });
        
        // Start auto-refresh when authenticated
        if (admin && token) {
          tokenManager.startAutoRefresh();
        }
      },

      clearAuth: () => {
        tokenManager.stopAutoRefresh();
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      updateAdmin: (admin: Partial<Admin>) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...admin } : null,
        })),

      hydrate: () => set({ isLoading: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Validate auth state on rehydration
        if (state) {
          const hasValidAuth = !!(state.admin && state.token);
          console.log("Rehydrating auth:", { hasValidAuth, admin: !!state.admin, token: !!state.token });
          
          if (!hasValidAuth) {
            state.clearAuth();
          } else {
            state.isAuthenticated = true;
            // Start auto-refresh on rehydration if authenticated
            tokenManager.startAutoRefresh();
          }
          
          state.hydrate();
        }
      },
    },
  ),
);
