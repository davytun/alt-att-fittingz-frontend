"use client";

import { Users, ShoppingBag, Lightbulb, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useClientList } from "@/hooks/api/use-clients";
import { useAllOrders } from "@/hooks/api/use-orders";

export function MetricsGrid() {
  const { data } = useClientList(1, 10);
  const { data: ordersData } = useAllOrders(1, 1);
  const clients = data?.data ?? [];
  const totalClients = data?.pagination.total ?? 0;
  const totalOrders = ordersData?.pagination?.total ?? 0;
  const totalStyles = clients.reduce((a, c) => a + c._count.styleImages, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newThisMonth = clients.filter(
    (c) => c.createdAt && new Date(c.createdAt) >= thirtyDaysAgo
  ).length;

  const metrics = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      bgColor: "bg-[#0F4C75]/10",
      iconColor: "text-[#0F4C75]",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Inspiration Uploaded",
      value: totalStyles,
      icon: Lightbulb,
      bgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
    },
    {
      title: "New Clients (This Month)",
      value: newThisMonth,
      icon: UserPlus,
      bgColor: "bg-teal-500/10",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Card key={m.title} className="shadow-lg">
            <CardContent className="space-y-2 p-5">
              <div className={`w-9 rounded-full p-2 ${m.bgColor}`}>
                <Icon className={`h-5 w-5 ${m.iconColor}`} />
              </div>
              <p className="font-semibold text-[#222831]">{m.title}</p>
              <p className="text-4xl font-bold text-[#222831]">{m.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function MetricsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {["clients", "orders", "inspiration", "new-clients"].map((id) => (
        <div key={id} className="h-36 animate-pulse rounded-xl bg-gray-300" />
      ))}
    </div>
  );
}
