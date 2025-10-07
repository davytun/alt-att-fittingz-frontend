"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If auth is required but the user is not authenticated, don't render
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If auth is not required but the user is authenticated, don't render
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
