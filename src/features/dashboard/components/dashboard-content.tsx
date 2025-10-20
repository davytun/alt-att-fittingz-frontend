"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useClients } from "@/features/clients/hooks/use-client-queries";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardWithClients } from "./dashboard-with-clients";

export function DashboardContent() {
  const { admin } = useAuth();
  const { data, isLoading, error } = useClients(1, 1);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">
            {error.message ||
              "Unable to load your dashboard. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  const hasClients = data?.data && data.data.length > 0;

  return (
    <div className="space-y-6">
      {hasClients && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {admin?.businessName || "Admin"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your fashion business
          </p>
        </div>
      )}

      {hasClients ? <DashboardWithClients /> : <DashboardEmptyState />}
    </div>
  );
}
