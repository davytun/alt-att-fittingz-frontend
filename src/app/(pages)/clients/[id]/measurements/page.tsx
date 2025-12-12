"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useClient } from "@/hooks/api/use-clients";
import { measurementsApi } from "@/lib/api/measurements";

export default function MeasurementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = use(params);
  const router = useRouter();

  const { data: client, isLoading: isLoadingClient } = useClient(clientId);
  const { data: measurements = [], isLoading: isLoadingMeasurements } =
    useQuery({
      queryKey: ["measurements", clientId],
      queryFn: () => measurementsApi.getMeasurements(clientId),
    });

  const isLoading = isLoadingClient || isLoadingMeasurements;

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            Measurements
          </p>
          <h1 className="text-2xl font-bold md:text-3xl">
            {client?.name || "Client"}'s Measurements
          </h1>
          {!isLoading && (
            <p className="text-sm text-white/80">
              <span className="font-semibold mr-2">{measurements.length}</span>
              {measurements.length === 1 ? "Measurement" : "Measurements"}
            </p>
          )}
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, () => (
              <Card key={crypto.randomUUID()} className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : measurements.length === 0 ? (
          /* Empty State */
          <Card className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 p-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Measurements Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by adding your first measurement for this client.
                </p>
                <Button
                  onClick={() =>
                    router.push(`/clients/${clientId}/measurements/new`)
                  }
                  className="bg-[#0F4C75] hover:bg-[#0F4C75]/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Measurement
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          /* Measurements Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {measurements.map((measurement) => (
                <Card
                  key={measurement.id}
                  onClick={() =>
                    router.push(
                      `/clients/${clientId}/measurements/${measurement.id}`,
                    )
                  }
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-[#0F4C75]/50 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0F4C75] transition-colors">
                      {measurement.name || "Untitled Measurement"}
                    </h3>
                    {measurement.isDefault && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        Default
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated{" "}
                        {new Date(measurement.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {measurement.order && (
                      <div className="flex items-center gap-2 text-[#0F4C75]">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">
                          Order: {measurement.order.orderNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Created{" "}
                      {new Date(measurement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Floating Add Button */}
            <Button
              onClick={() =>
                router.push(`/clients/${clientId}/measurements/new`)
              }
              className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-[#0F4C75] to-[#1a5a8f] shadow-2xl hover:shadow-[0_20px_50px_rgba(15,76,117,0.4)] hover:scale-110 transition-all duration-300 group"
            >
              <Plus className="h-7 w-7 text-white transition-transform group-hover:rotate-90 duration-300" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
