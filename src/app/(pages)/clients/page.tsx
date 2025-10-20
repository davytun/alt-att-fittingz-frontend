import type { Metadata } from "next";
import { ClientsContent } from "@/features/clients/components/clients-content";

export const metadata: Metadata = {
  title: "Clients - Fittingz",
  description: "Manage your clients and their measurements",
};

export default function ClientsPage() {
  return <ClientsContent />;
}
