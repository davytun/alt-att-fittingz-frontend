"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { tokenManager } from "@/lib/token-manager";

interface AuthContextType {
  logout: (options?: { redirect?: string; message?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, clearAuth, isLoading, hydrate } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Ensure store is hydrated on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Handle route protection
  useEffect(() => {
    // Add small delay to prevent redirect loops
    const timer = setTimeout(() => {
      // Don't run until loading is complete
      if (isLoading) {
        // console.log("Auth still loading, waiting...");
        return;
      }

      // console.log("Auth state:", { isAuthenticated, pathname, isLoading });
      // console.log(
      //   "LocalStorage auth-storage:",
      //   localStorage.getItem("auth-storage"),
      // );

      // Define public routes (accessible without authentication)
      const publicRoutes = [
        "/login",
        "/register",
        "/verify-email",
        "/forgot-password",
        "/verify-reset-code",
        "/reset-password",
      ];

      const isPublicRoute = publicRoutes.includes(pathname) || pathname === "/";

      // Password reset pages should be accessible even when authenticated
      const isPasswordResetPage =
        pathname.includes("/forgot-password") ||
        pathname.includes("/verify-reset-code") ||
        pathname.includes("/reset-password");

      // If not authenticated and trying to access protected route, redirect to login
      if (!isAuthenticated && !isPublicRoute && !isPasswordResetPage) {
        // console.log("Not authenticated, redirecting to login");
        router.push("/login");
        return;
      }

      // If authenticated and trying to access auth pages (except password reset), redirect to dashboard
      if (
        isAuthenticated &&
        isPublicRoute &&
        !isPasswordResetPage &&
        pathname !== "/"
      ) {
        // console.log("Authenticated, redirecting to dashboard");
        router.push("/dashboard");
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname, router, isLoading]);

  const logout = (options?: { redirect?: string; message?: string }) => {
    const { redirect = "/login" } = options || {};

    tokenManager.stopAutoRefresh();
    clearAuth();
    router.push(redirect);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tokenManager.stopAutoRefresh();
    };
  }, []);

  const value: AuthContextType = {
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
