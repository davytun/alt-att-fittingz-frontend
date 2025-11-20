"use client";

import { Call } from "iconsax-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Client } from "@/lib/api/types";

interface ClientsListProps {
  clients: Client[];
  searchTerm: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function ClientsList({ clients, searchTerm }: ClientsListProps) {
  const router = useRouter();

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredClients.map((client) => (
        <Card key={client.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{client.name}</h3>
                <div className="flex items-center text-sm text-[#222831] mt-1">
                  <Call color="#222831" className="h-6  w-6 mr-1" />
                  <span className="text-lg font-medium">{client.phone}</span>
                </div>
              </div>
              <Button
                size="sm"
                className=" text-xs px-3 py-1"
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                View Profile
              </Button>
            </div>
            <div className="text-lg font-medium text-[#222831]">
              {client._count?.measurements || 0} Measurements •{" "}
              {client._count?.styleImages || 0} Style Images
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
