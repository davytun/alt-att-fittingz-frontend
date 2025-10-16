"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect from password reset pages even if authenticated
    const isPasswordResetPage =
      pathname.includes("/forgot-password") ||
      pathname.includes("/verify-reset-code") ||
      pathname.includes("/reset-password");

    // Only redirect from login/register pages if authenticated
    if (!isLoading && isAuthenticated && !isPasswordResetPage) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render auth pages if authenticated (except password reset pages)
  const isPasswordResetPage =
    pathname.includes("/forgot-password") ||
    pathname.includes("/verify-reset-code") ||
    pathname.includes("/reset-password");

  if (isAuthenticated && !isPasswordResetPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
