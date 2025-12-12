"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAllOrders } from "@/hooks/api/use-orders";

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

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export function OrderStatusChart() {
  const { data: ordersData, isLoading } = useAllOrders(1, 100);
  const orders = ordersData?.data ?? [];

  // Get last 30 days
  const days = [];
  const dateMap = new Map<string, Date>();

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const key = getDateKey(date);
    days.push({ date, key });
    dateMap.set(key, date);
  }

  // Use all orders for now (remove date filter)
  const recentOrders = orders;

  // Get unique statuses present in data
  const statusesInData = Array.from(
    new Set(recentOrders.map((order) => order.status)),
  );

  // Group orders by date key
  const ordersByDate = new Map<string, typeof orders>();
  recentOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const key = getDateKey(orderDate);
    if (!ordersByDate.has(key)) {
      ordersByDate.set(key, []);
    }
    ordersByDate.get(key)?.push(order);
  });

  // Count orders per day
  const chartData = days.map(({ date, key }) => {
    const dayOrders = ordersByDate.get(key) || [];

    const statusCounts = dayOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const dataPoint: Record<string, string | number> = {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      dateKey: key,
      total: dayOrders.length,
    };

    // Add all possible statuses with 0 as default
    statusesInData.forEach((status) => {
      dataPoint[status] = statusCounts[status] || 0;
    });

    return dataPoint;
  });

  const totalOrders = recentOrders.length;
  const hasOrders = totalOrders > 0;

  // Calculate total for all statuses
  const statusTotals = statusesInData.map((status) => ({
    status,
    count: recentOrders.filter((o) => o.status === status).length,
    label: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#64748B",
  }));

  if (isLoading) {
    return <OrderStatusChartSkeleton />;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">Order Activity</CardTitle>
        <CardDescription>
          Showing order activity for the last 30 days ({totalOrders} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasOrders ? (
          <div className="space-y-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    {statusesInData.map((status) => (
                      <linearGradient
                        key={status}
                        id={`color${status}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={
                            STATUS_COLORS[
                              status as keyof typeof STATUS_COLORS
                            ] || "#64748B"
                          }
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor={
                            STATUS_COLORS[
                              status as keyof typeof STATUS_COLORS
                            ] || "#64748B"
                          }
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={30}
                    angle={0}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                    allowDecimals={false}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                    labelStyle={{
                      color: "#111827",
                      marginBottom: "4px",
                      fontWeight: 600,
                    }}
                    formatter={(value: number, name: string) => [
                      value,
                      STATUS_LABELS[name as keyof typeof STATUS_LABELS] || name,
                    ]}
                  />
                  {statusesInData.length > 0 ? (
                    statusesInData.map((status) => (
                      <Area
                        key={status}
                        type="monotone"
                        dataKey={status}
                        stackId="1"
                        stroke={
                          STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
                          "#64748B"
                        }
                        fill={`url(#color${status})`}
                        strokeWidth={2}
                      />
                    ))
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {statusTotals.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[280px] rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  No Recent Orders
                </p>
                <p className="text-xs text-gray-500">
                  Orders created in the last 30 days will appear here
                </p>
              </div>
            </div>

            {orders.length > 0 && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You have {orders.length} total order
                  {orders.length !== 1 ? "s" : ""}, but{" "}
                  {orders.length !== 1 ? "they were" : "it was"} created more
                  than 30 days ago.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OrderStatusChartSkeleton() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-4 w-56 animate-pulse rounded bg-gray-200" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[280px] animate-pulse rounded-lg bg-gray-200" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
