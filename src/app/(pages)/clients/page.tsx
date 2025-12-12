// app/(app)/clients/page.tsx

import { ClientsListWrapper } from "@/components/clients/clients-list-wrapper";
import { ClientsHeader } from "@/components/clients/header";
import { ClientsSearchBar } from "@/components/clients/search-bar";

export const metadata = {
  title: "Clients - Fittingz",
  description: "Manage your clients and their measurements",
};

export default function ClientsPage() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <ClientsHeader />
      <ClientsSearchBar />
      <ClientsListWrapper />
    </div>
  );
}
