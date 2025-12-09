"use client";

import { ArrowRight2, Image, Notification, People, ShoppingBag, UserAdd } from "iconsax-react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClientList } from "@/hooks/api/use-clients";
import { useAllOrders } from "@/hooks/api/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { DashboardSkeleton } from "./dashboard-skeleton";

const STATUS_COLORS = {
  PENDING_PAYMENT: "#F59E0B",
  PROCESSING: "#3B82F6",
  READY_FOR_PICKUP: "#8B5CF6",
  SHIPPED: "#06B6D4",
  DELIVERED: "#10B981",
  COMPLETED: "#22C55E",
  CANCELLED: "#EF4444",
};

const STATUS_LABELS = {
  PENDING_PAYMENT: "Pending Payment",
  PROCESSING: "Processing",
  READY_FOR_PICKUP: "Ready for Pickup",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function OrderStatusChart({ orders }: { orders: Array<{ status: string }> }) {
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#64748B",
  }));

  const totalOrders = orders.length;
  const hasOrders = totalOrders > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">
          Order Status Overview
        </CardTitle>
        <CardDescription>
          {hasOrders
            ? `Breakdown of ${totalOrders} order${totalOrders !== 1 ? "s" : ""}`
            : "No orders yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasOrders ? (
          <div className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                    formatter={(value: number) => [`${value} orders`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">
              No orders to display yet. Create your first order to see status
              breakdown.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const { admin } = useAuth();
  const router = useRouter();
  const { data, isLoading, error } = useClientList(1, 10);
  const { data: ordersData } = useAllOrders(1, 100);

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
  const orders = ordersData?.data ?? [];
  const hasClients = clients.length > 0;

  const totalClients = data?.pagination.total ?? clients.length;
  const totalOrders = orders.length;
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const metricCards = [
    {
      title: "Total Clients",
      value: totalClients,
      description: "Total clients in your dashboard",
      icon: People,
      bgColor: "bg-blue-50",
      iconColor: "#3B82F6",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      description: "Total number of orders",
      icon: ShoppingBag,
      bgColor: "bg-green-50",
      iconColor: "#10B981",
    },
    {
      title: "Inspiration Uploaded",
      value: totalStyles,
      description: "Images in your gallery",
      icon: Image,
      bgColor: "bg-purple-50",
      iconColor: "#8B5CF6",
    },
    {
      title: "New Clients (This Month)",
      value: newClientsThisMonth,
      description: "Clients added in last 30 days",
      icon: UserAdd,
      bgColor: "bg-orange-50",
      iconColor: "#F59E0B",
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
              {getGreeting()}
            </p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              {admin?.businessName || "Fittingz Admin"}
            </h1>
            {totalOrders > 0 && (
              <p className="mt-1 text-sm opacity-90">
                You have {totalOrders} order{totalOrders !== 1 ? "s" : ""} in your system
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10"
              onClick={() => router.push("/clients/new")}
            >
              <Plus className="mr-2 h-5 w-5" />
              New Client
            </Button>
            <Button
              className="bg-white text-[#0F4C75] hover:bg-white/90"
              onClick={() =>
                toast.info("Orders will be available soon", {
                  description:
                    "We are working hard to bring order management to Fittingz.",
                })
              }
            >
              <Plus className="mr-2 h-5 w-5" />
              New Order
            </Button>
          </div>
        </div>
        <Notification className="absolute right-6 top-6 h-6 w-6 text-white/80" />
      </section>

      {/* Metric cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="shadow-lg">
              <CardContent className="space-y-2 p-5">
                <div className={`w-10 h-10 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                  <Icon size={20} color={metric.iconColor} variant="Bold" />
                </div>
                <p className="font-semibold text-[#222831]">{metric.title}</p>
                <p className="text-2xl font-bold text-[#222831]">
                  {metric.value}
                </p>
                <p className="text-sm text-gray-500">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent updates and Order Status Chart */}
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

        <OrderStatusChart orders={orders} />
      </section>
    </div>
  );
}
