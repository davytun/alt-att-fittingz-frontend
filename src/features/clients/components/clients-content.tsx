"use client";

import { Add, Filter, SearchNormal } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients } from "../hooks/use-client-queries";
import { ClientsList } from "./clients-list";
import { ClientsSkeleton } from "./clients-skeleton";

export function ClientsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useClients(page, pageSize);
  const router = useRouter();

  if (isLoading) {
    return <ClientsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Clients
          </h2>
          <p className="text-gray-600">
            {error.message || "Unable to load clients. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  const clients = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Clients
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your clients and their measurements
          </p>
        </div>
        <Button
          onClick={() => router.push("/clients/new")}
          className="mt-4 sm:mt-0"
        >
          <Add className="h-5 w-5 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchNormal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Clients List */}
      <ClientsList
        clients={clients}
        searchTerm={searchTerm}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
