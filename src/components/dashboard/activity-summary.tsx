"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClientList } from "@/hooks/api/use-clients";

export function ActivitySummary() {
  const { data } = useClientList(1, 10);
  const clients = data?.data ?? [];
  const totalClients = data?.pagination.total ?? clients.length;
  const totalStyles = clients.reduce((acc, c) => acc + c._count.styleImages, 0);

  const summary = [
    { label: "Total Clients", value: totalClients },
    { label: "Orders", value: 0 },
    { label: "Gallery styles", value: totalStyles },
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
        {summary.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 shadow-sm"
          >
            <span className="font-semibold text-[#222831]">{item.label}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C75]/10 text-sm font-bold text-[#0F4C75]">
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ActivitySummarySkeleton() {
  return <div className="h-64 animate-pulse rounded-xl bg-gray-300" />;
}
