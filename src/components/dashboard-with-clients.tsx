"use client";

import { Add, ArrowRight2, User } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientList } from "@/hooks/api/use-clients";
import { formatClientName } from "@/lib/client-utils";

export function DashboardWithClients() {
  const { data: clientsData } = useClientList(1, 5);
  const router = useRouter();

  const totals = useMemo(() => {
    const clients = clientsData?.data ?? [];
    const totalClients = clientsData?.pagination.total ?? 0;
    const totalOrders = 0; // Placeholder until orders feature is implemented
    const totalGallery = clients.reduce(
      (acc, client) => acc + client._count.styleImages,
      0,
    );
    const newClientsThisMonth = clients.filter((client) => {
      if (!client.createdAt) return false;
      const created = new Date(client.createdAt);
      const now = new Date();
      const thirtyDaysAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30,
      );
      return created >= thirtyDaysAgo;
    }).length;

    return {
      clients,
      totalClients,
      totalOrders,
      totalGallery,
      newClientsThisMonth,
    };
  }, [clientsData]);

  const activitySummary = [
    { label: "Total Clients", value: totals.totalClients },
    { label: "Orders", value: totals.totalOrders },
    { label: "Gallery styles", value: totals.totalGallery },
  ];

  const recentClients = totals.clients.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* top greeting & actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F4C75]">
            Welcome Back
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-[#0F4C75] text-[#0F4C75] hover:bg-[#0F4C75] hover:text-white"
            onClick={() => router.push("/clients/new")}
          >
            <Add className="h-4 w-4 mr-2" /> New Client
          </Button>
          <Button
            variant="outline"
            disabled
            className="border-[#0F4C75] text-[#0F4C75]"
          >
            <Add className="h-4 w-4 mr-2" /> New Order
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4">
        {[
          {
            title: "Total Clients",
            value: totals.totalClients,
            description: "Total number of clients in your dashboard",
          },
          {
            title: "Total Orders",
            value: totals.totalOrders,
            description: "Total number of orders in your dashboard",
          },
          {
            title: "Inspiration Uploaded",
            value: totals.totalGallery,
            description: "Total number of Images uploaded in your gallery",
          },
          {
            title: "New Clients (This Month)",
            value: totals.newClientsThisMonth,
            description: "Clients added in the last 30 days",
          },
        ].map((stat) => (
          <Card key={stat.title} className="border border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0F4C75] text-white flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#222831]">{stat.title}</p>
                <p className="text-2xl font-bold text-[#0F4C75] mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent clients */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Recent Clients Updates</CardTitle>
          <Button
            variant="link"
            className="text-[#0F4C75] font-semibold"
            onClick={() => router.push("/clients")}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {recentClients.length > 0 ? (
            recentClients.map((client) => {
              const latestMeasurementDate = client.updatedAt;
              const formattedDate = latestMeasurementDate
                ? new Date(latestMeasurementDate).toLocaleDateString()
                : "";

              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => router.push(`/clients/${client.id}`)}
                  className="w-full rounded-xl border border-slate-200 p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#222831]">
                      {formatClientName(client)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last updated {formattedDate}
                    </p>
                  </div>
                  <ArrowRight2 className="h-4 w-4 text-[#0F4C75]" />
                </button>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No recent updates yet</p>
          )}
        </CardContent>
      </Card>

      {/* Activity summary */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Activity Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activitySummary.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
            >
              <span className="font-semibold text-[#222831]">{item.label}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F4C75] text-sm font-bold text-white">
                {item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
