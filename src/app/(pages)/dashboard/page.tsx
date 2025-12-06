// app/(app)/dashboard/page.tsx
import { Suspense } from "react";
import {
  ActivitySummary,
  ActivitySummarySkeleton,
} from "@/components/dashboard/activity-summary";
import {
  DashboardHeader,
  DashboardHeaderSkeleton,
} from "@/components/dashboard/dashboard-header";
import {
  MetricsGrid,
  MetricsGridSkeleton,
} from "@/components/dashboard/metrics-grid";
import {
  RecentActivity,
  RecentActivitySkeleton,
} from "@/components/dashboard/recent-activity";

export const metadata = {
  title: "Dashboard - Fittingz",
  description: "Manage your clients and measurements",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-16">
      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      <Suspense fallback={<MetricsGridSkeleton />}>
        <MetricsGrid />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<RecentActivitySkeleton />}>
          <RecentActivity />
        </Suspense>

        <Suspense fallback={<ActivitySummarySkeleton />}>
          <ActivitySummary />
        </Suspense>
      </div>
    </div>
  );
}
