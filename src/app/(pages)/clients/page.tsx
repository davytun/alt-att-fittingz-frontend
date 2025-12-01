import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientsContent } from "@/components/clients-content";
import { ClientsSkeleton } from "@/components/clients-skeleton";

export const metadata: Metadata = {
  title: "Clients - Fittingz",
  description: "Manage your clients and their measurements",
};

export default function ClientsPage() {
  return (
    <Suspense fallback={<ClientsSkeleton />}>
      <ClientsContent />
    </Suspense>
  );
}
