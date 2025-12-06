import { Suspense } from "react";
import { ClientsList } from "./clients-list";
import { ClientsListSkeleton } from "./clients-list-skeleton";

export function ClientsListWrapper() {
  return (
    <Suspense fallback={<ClientsListSkeleton />}>
      <ClientsList />
    </Suspense>
  );
}
