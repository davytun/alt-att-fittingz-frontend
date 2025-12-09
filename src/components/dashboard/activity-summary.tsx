"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActivitySummary } from "@/hooks/api/use-recent-updates";

export function ActivitySummary() {
  const { data: summary, isLoading } = useActivitySummary(7);

  const summaryItems = [
    { label: "Total Clients", value: summary?.totalClients ?? 0 },
    { label: "Orders", value: summary?.totalOrders ?? 0 },
    { label: "Gallery styles", value: summary?.totalGalleryStyles ?? 0 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">Activity Summary</CardTitle>
        <CardDescription>
          Snapshot of your client and gallery stats
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 shadow-sm animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          summaryItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 shadow-sm"
            >
              <span className="font-semibold text-[#222831]">{item.label}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C75]/10 text-sm font-bold text-[#0F4C75]">
                {item.value}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function ActivitySummarySkeleton() {
  return <div className="h-64 animate-pulse rounded-xl bg-gray-300" />;
}
