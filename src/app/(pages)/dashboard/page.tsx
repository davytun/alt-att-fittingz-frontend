import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardContent } from "@/components/dashboard-content";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Dashboard - Fittingz",
  description: "Manage your clients and measurements",
};

// Static shell that can be pre-rendered
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
