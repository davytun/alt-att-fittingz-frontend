"use client";

import { use } from "react";
import { MeasurementsCard } from "@/components/client-profile/measurements-card";
import { OrdersCard } from "@/components/client-profile/orders-card";
import { PersonalInfoCard } from "@/components/client-profile/personal-info-card";
import { StyleInspirationsCard } from "@/components/client-profile/style-inspirations-card";
import { useClient } from "@/hooks/api/use-clients";

const mockClientData = {
  id: "cmhp09sok0004e50i0mjpi0c8",
  name: "Asarah James",
  email: "asarah.james@gmail.com",
  phone: "+2347035760942",
  gender: "Female",
  adminId: "admin123",
  createdAt: "2025-01-25T10:00:00Z",
  updatedAt: "2025-01-25T10:00:00Z",
  measurements: [],
  styleImages: [
    {
      id: "1",
      imageUrl: "/api/placeholder/150/200",
      publicId: "placeholder1",
      category: "formal",
      description: "Formal wear inspiration",
      createdAt: "2025-01-25T10:00:00Z",
      updatedAt: "2025-01-25T10:00:00Z",
    },
    {
      id: "2",
      imageUrl: "/api/placeholder/150/200",
      publicId: "placeholder2",
      category: "casual",
      description: "Casual wear inspiration",
      createdAt: "2025-01-25T10:00:00Z",
      updatedAt: "2025-01-25T10:00:00Z",
    },
  ],
  _count: {
    measurements: 1,
    styleImages: 2,
  },
  measurementData: {
    title: "Asarah Measurement #001",
    lastUpdated: "2025-01-25",
  },
  orders: [
    { id: "#2025-001", date: "2025-01-10", status: "Completed" },
    { id: "#2025-002", date: "2025-01-15", status: "In Progress" },
    { id: "#2025-003", date: "2025-01-20", status: "Cancelled" },
  ],
};

export default function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: client,
    isLoading,
    error,
  } = useClient(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading client data</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#222831]">
        Client Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-15">
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoCard client={client} />
          <MeasurementsCard clientId={client.id} />
          <OrdersCard orders={mockClientData.orders} />
        </div>

        <div className="space-y-6">
          {/* <StyleInspirationsCard
            styleImages={
              client.styleImages?.length > 0
                ? client.styleImages.map((img) => img.imageUrl)
                : []
            }
          /> */}
        </div>
      </div>
    </div>
  );
}
