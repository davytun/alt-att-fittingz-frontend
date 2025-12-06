"use client";

import {
  ArrowRight,
  Mail,
  Phone,
  Ruler,
  ShoppingBag,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Client = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  _count?: {
    measurements: number;
    orders: number;
  };
};

export function ClientCard({ client }: { client: Client }) {
  const router = useRouter();
  const measurements = client._count?.measurements ?? 0;
  const orders = client._count?.orders ?? 0;

  return (
    <Card
      className="group relative overflow-hidden border border-gray-200 bg-white p-6 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0F4C75]/20 cursor-pointer rounded-2xl"
      onClick={() => router.push(`/clients/${client.id}`)}
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#0F4C75]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-4 ring-white shadow-md">
            <AvatarFallback className="bg-linear-to-br from-[#0F4C75] to-[#1e90ff] text-white text-xl font-bold">
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-xl font-bold text-[#222831] tracking-tight">
              {client.name}
            </h3>

            <div className="mt-2 space-y-2">
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-[#0F4C75]" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4 text-[#0F4C75]" />
                  <span>{client.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Ruler className="h-4 w-4 text-[#0F4C75]" />
                  <span>
                    {measurements} Measurement{measurements !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShoppingBag className="h-4 w-4 text-[#0F4C75]" />
                  <span>
                    {orders} Order{orders !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="mt-4 w-full bg-[#0F4C75] font-bold text-white shadow-md transition-all hover:bg-[#0F4C75]/90 hover:shadow-lg cursor-pointer md:mt-0 md:w-auto group-hover:translate-x-1"
          onClick={() => router.push(`/clients/${client.id}`)}
        >
          View Profile
          <ArrowRight className="ml-2 h-5 w-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
}
