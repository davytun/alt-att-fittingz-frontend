"use client";

import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersApi } from "@/lib/api/orders";

interface OrdersCardProps {
  clientId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "SHIPPED":
      return "bg-blue-100 text-blue-800";
    case "READY_FOR_PICKUP":
      return "bg-blue-100 text-blue-800";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800";
    case "PENDING_PAYMENT":
      return "bg-orange-100 text-orange-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export function OrdersCard({ clientId }: OrdersCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", clientId],
    queryFn: () => ordersApi.getClientOrders(clientId, 1, 5),
  });

  const orders = data?.data || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Order Details</CardTitle>
        <Button variant="default" size="sm" asChild>
          <Link href={`/clients/${clientId}/orders/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <div className="text-center py-8 text-gray-500">
            <p>No orders yet</p>
            <p className="text-sm mt-1">
              Click "Add Order" to create the first order
            </p>
          </div>
        ) : (
          // Orders list
          orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className="font-medium">{order.orderNumber}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-[#0F4C75]">
                  Due: {format(new Date(order.dueDate), "MMM dd, yyyy")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href={`/clients/${clientId}/orders/${order.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </Link>
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
