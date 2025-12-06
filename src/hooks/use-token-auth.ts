import { useCallback } from "react";
import { tokenManager } from "@/lib/token-manager";
import { useAuth } from "./use-auth";

export const useTokenAuth = () => {
  const { setAuth, clearAuth, isAuthenticated, admin, token } = useAuth();

  const login = useCallback(
    async (email: string, password: string) => {
      // Login implementation would go here
      // This is just the structure for handling the response
    },
    [setAuth],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const refreshToken = useCallback(async () => {
    return tokenManager.refreshToken();
  }, []);

  return {
    login,
    logout,
    refreshToken,
    isAuthenticated,
    admin,
    token,
    setAuth,
    clearAuth,
  };
};
