"use client";

import { Add, ArrowRight2, Notification, User } from "iconsax-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useClientList } from "@/hooks/api/use-clients";
import { DashboardSkeleton } from "./dashboard-skeleton";

export function DashboardContent() {
  const { admin } = useAuth();
  const router = useRouter();
  const { data, isLoading, error } = useClientList(1, 10);

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

  const clients = data?.data ?? [];
  const hasClients = clients.length > 0;

  const totalClients = data?.pagination.total ?? clients.length;
  const _totalMeasurements = clients.reduce(
    (acc, client) => acc + client._count.measurements,
    0
  );
  const totalStyles = clients.reduce(
    (acc, client) => acc + client._count.styleImages,
    0
  );

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newClientsThisMonth = clients.filter((client) => {
    const createdDate = client.createdAt ? new Date(client.createdAt) : null;
    return createdDate ? createdDate >= thirtyDaysAgo : false;
  }).length;

  const recentClients = [...clients]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 4);

  const activitySummary = [
    { label: "Total Clients", value: totalClients },
    { label: "Orders", value: 0 },
    { label: "Gallery styles", value: totalStyles },
  ];

  const metricCards = [
    {
      title: "Total Clients",
      value: totalClients,
      description: "Total clients in your dashboard",
    },
    {
      title: "Total Orders",
      value: 0,
      description: "Total number of orders in your dashboard",
    },
    {
      title: "Inspiration Uploaded",
      value: totalStyles,
      description: "Total number of images uploaded in your gallery",
    },
    {
      title: "New Clients (This Month)",
      value: newClientsThisMonth,
      description: "Clients added in the last 30 days",
    },
  ];

  return (
    <div className="space-y-6 mb-16">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0F4C75] px-6 py-8 text-white shadow-sm">
        <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] opacity-80">
              Welcome Back
            </p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              {admin?.businessName || "Fittingz Admin"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="bg-white text-[#0F4C75] hover:bg-white/90"
              onClick={() => router.push("/clients/new")}
            >
              <Add color="#0F4C75" className="mr-2 h-5 w-5" />
              New Client
            </Button>
            <Button
              variant="outline"
              className=" bg-transparent/50 border-white text-white hover:bg-white/10"
              onClick={() =>
                toast.info("Orders will be available soon", {
                  description:
                    "We are working hard to bring order management to Fittingz.",
                })
              }
            >
              <Add color="#0F4C75" className="mr-2 h-5 w-5" />
              New Order
            </Button>
          </div>
        </div>
        <Notification className="absolute right-6 top-6 h-6 w-6 text-white/80" />
      </section>

      {/* Metric cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.title} className="shadow-lg">
            <CardContent className="space-y-2 p-5">
              <div className="w-9 rounded-full bg-[#0F4C75]/10 p-2">
                <User color="#0F4C75" className="h-5 w-5 text-[#0F4C75]" />
              </div>
              <p className="font-semibold text-[#222831]">{metric.title}</p>
              <p className="text-2xl font-bold text-[#222831]">
                {metric.value}
              </p>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent updates and activity summary */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base md:text-lg">
                Recent Clients Updates
              </CardTitle>
            </div>
            <Button
              variant="link"
              className="text-[#0F4C75]"
              onClick={() => router.push("/clients")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {hasClients ? (
              recentClients.map((client) => {
                const updatedAt = client.updatedAt
                  ? new Date(client.updatedAt)
                  : null;
                const formattedDate = updatedAt
                  ? updatedAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "";

                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => router.push(`/clients/${client.id}`)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 text-left shadow-sm transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-[#222831]">
                        {client.name} Measurement
                      </p>
                      <p className="text-xs text-gray-500">
                        Last updated {formattedDate}
                      </p>
                    </div>
                    <span className="text-lg text-gray-400">
                      <ArrowRight2
                        size="24"
                        color="#0F4C75"
                        variant="Outline"
                      />
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
                No recent client updates yet. Add your first client to get
                started.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">
              Activity Summary
            </CardTitle>
            <CardDescription>
              Snapshot of your client and gallery stats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activitySummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 shadow-sm"
              >
                <span className="font-semibold text-[#222831]">
                  {item.label}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C75]/10 text-sm font-bold text-[#0F4C75]">
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
