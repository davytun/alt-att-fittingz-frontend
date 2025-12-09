"use client";

import { use } from "react";
import { MeasurementsCard } from "@/components/client-profile/measurements-card";
import { OrdersCard } from "@/components/client-profile/orders-card";
import { PersonalInfoCard } from "@/components/client-profile/personal-info-card";
import { StyleInspirationsCard } from "@/components/client-profile/style-inspirations-card";
import { useClient } from "@/hooks/api/use-clients";

// Reusable Skeleton for Client Profile
function ClientProfileSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Title */}
      <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Measurements Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="h-6 bg-gray-200 rounded w-56 mb-4 animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Style Inspirations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="h-6 bg-gray-200 rounded w-52 mb-4 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: client, isLoading, error, isFetching } = useClient(id);

  // Show skeleton while loading or fetching
  if (isLoading || isFetching || !client) {
    return <ClientProfileSkeleton />;
  }

  // Clean error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl font-bold text-red-600 mb-2">
          Client Not Found
        </div>
        <p className="text-gray-600">
          The client you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            Client Profile
          </p>
          <h1 className="text-2xl font-bold md:text-3xl">{client.name}</h1>
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>
      <div className="p-4 md:p-6 space-y-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoCard client={client} />
            <MeasurementsCard clientId={client.id} />
            <OrdersCard clientId={client.id} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <StyleInspirationsCard clientId={client.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
