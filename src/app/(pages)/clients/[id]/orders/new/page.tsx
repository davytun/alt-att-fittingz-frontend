"use client";

import { use } from "react";
import { useClient } from "@/hooks/api/use-clients";
import { OrderForm } from "./order-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: client, isLoading } = useClient(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Client Not Found</h1>
          <p className="text-gray-600 mt-2">
            The client you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Link
        href={`/clients/${id}`}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Client Profile
      </Link>
      {/* Header */}
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            Add New Order
          </p>
          <h1 className="text-2xl font-bold md:text-3xl">
            Create a new order for {client.name}
          </h1>
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>
      
      {/* Form */}
      <OrderForm clientId={id} clientName={client.name} />
    </div>
  );
}
