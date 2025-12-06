"use client";
import { Add } from "iconsax-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ClientsHeader() {
  const router = useRouter();

  return (
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
        <Add color="#ffffff" className="h-5 w-5 mr-2" />
        Add Client
      </Button>
    </div>
  );
}
