"use client";

import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useClientList } from "@/hooks/api/use-clients";

export function MetricsGrid() {
  const { data } = useClientList(1, 10);
  const clients = data?.data ?? [];
  const totalClients = data?.pagination.total ?? 0;
  const totalStyles = clients.reduce((a, c) => a + c._count.styleImages, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newThisMonth = clients.filter(
    (c) => c.createdAt && new Date(c.createdAt) >= thirtyDaysAgo,
  ).length;

  const metrics = [
    { title: "Total Clients", value: totalClients },
    { title: "Total Orders", value: 0 },
    { title: "Inspiration Uploaded", value: totalStyles },
    { title: "New Clients (This Month)", value: newThisMonth },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.title} className="shadow-lg">
          <CardContent className="space-y-2 p-5">
            <div className="w-9 rounded-full bg-[#0F4C75]/10 p-2">
              <User className="h-5 w-5 text-[#0F4C75]" />
            </div>
            <p className="font-semibold text-[#222831]">{m.title}</p>
            <p className="text-2xl font-bold text-[#222831]">{m.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MetricsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-300" />
      ))}
    </div>
  );
}
