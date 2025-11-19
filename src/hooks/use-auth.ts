import { useAuthStore } from "@/lib/store/auth-store";

export const useAuth = () => {
  const {
    admin,
    token,
    isAuthenticated,
    isLoading,
    setAuth,
    clearAuth,
    setLoading,
  } = useAuthStore();

  return {
    admin,
    token,
    isAuthenticated,
    isLoading,
    setAuth,
    clearAuth,
    setLoading,
  };
};
