"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/store/auth-store";

interface AuthContextType {
  logout: (options?: { redirect?: string; message?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, clearAuth, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  // Handle route protection
  useEffect(() => {
    // Don't run until loading is complete
    if (isLoading) return;

    const publicRoutes = ["/login", "/register", "/verify-email"];
    const isPublicRoute = publicRoutes.includes(pathname) || pathname === "/";

    // If not authenticated and trying to access protected route, redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
      return;
    }

    // If authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && isPublicRoute && pathname !== "/") {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  const logout = (options?: { redirect?: string; message?: string }) => {
    const {
      redirect = "/login",
      message = "You have been logged out successfully.",
    } = options || {};

    clearAuth();

    if (message) {
      showToast({
        title: "Logged Out",
        description: message,
        type: "info",
      });
    }

    router.push(redirect);
  };

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
