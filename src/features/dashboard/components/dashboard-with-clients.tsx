"use client";

import { Add, Image, Ruler, User } from "iconsax-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClients } from "@/features/clients/hooks/use-client-queries";
import { formatClientName } from "@/features/clients/utils/client-utils";

export function DashboardWithClients() {
  const { data: clientsData } = useClients(1, 5);
  const router = useRouter();

  const totalClients = clientsData?.pagination.total || 0;
  const recentClients = clientsData?.data || [];

  const stats = [
    {
      title: "Total Clients",
      value: totalClients.toString(),
      icon: User,
      description: "Active clients",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Measurements",
      value: recentClients
        .reduce((acc, client) => acc + client._count.measurements, 0)
        .toString(),
      icon: Ruler,
      description: "Total measurements",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Style Images",
      value: recentClients
        .reduce((acc, client) => acc + client._count.styleImages, 0)
        .toString(),
      icon: Image,
      description: "Saved styles",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">Recent Clients</CardTitle>
              <CardDescription className="text-sm">
                Your most recently added clients
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/clients")}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {recentClients.length > 0 ? (
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full text-left"
                    onClick={() => router.push(`/clients/${client.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {formatClientName(client)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {client.eventType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900">
                        {client._count.measurements} measurements
                      </p>
                      <p className="text-xs text-gray-500">
                        {client._count.styleImages} styles
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No clients yet</p>
                <Button
                  onClick={() => router.push("/clients/new")}
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs"
                >
                  <Add className="h-3 w-3 mr-1" />
                  Add Client
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-sm">
              Common tasks and quick access
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/clients/new")}
                className="w-full justify-start text-sm"
                variant="outline"
                size="sm"
              >
                <Add className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
              <Button
                onClick={() => router.push("/clients")}
                className="w-full justify-start text-sm"
                variant="outline"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Manage All Clients
              </Button>
              <Button
                onClick={() => router.push("/inspiration")}
                className="w-full justify-start text-sm"
                variant="outline"
                size="sm"
              >
                <Image className="h-4 w-4 mr-2" />
                Browse Inspiration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
