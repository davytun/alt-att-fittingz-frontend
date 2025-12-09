import { Suspense } from "react";
import {
  DashboardHeader,
  DashboardHeaderSkeleton,
} from "@/components/dashboard/dashboard-header";
import {
  MetricsGrid,
  MetricsGridSkeleton,
} from "@/components/dashboard/metrics-grid";
import { RecentUpdatesFeed } from "@/components/dashboard/recent-updates-feed";
import {
  OrderStatusChart,
  OrderStatusChartSkeleton,
} from "@/components/dashboard/order-status-chart";

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
        <RecentUpdatesFeed />
        <Suspense fallback={<OrderStatusChartSkeleton />}>
          <OrderStatusChart />
        </Suspense>
      </div>
    </div>
  );
}
