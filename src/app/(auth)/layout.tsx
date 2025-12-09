"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait until authentication status is resolved

    const isPasswordResetPage =
      pathname.includes("/forgot-password") ||
      pathname.includes("/verify-reset-code") ||
      pathname.includes("/reset-password");

    if (isAuthenticated && !isPasswordResetPage) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  const isPasswordResetPage =
    pathname.includes("/forgot-password") ||
    pathname.includes("/verify-reset-code") ||
    pathname.includes("/reset-password");

  if (isLoading || (isAuthenticated && !isPasswordResetPage)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If not loading and not authenticated (or on a password reset page), render the children.
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
