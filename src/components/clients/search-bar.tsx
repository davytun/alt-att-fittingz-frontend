"use client";

import { SearchNormal1 } from "iconsax-react";
import { Input } from "@/components/ui/input";
import { useClientsSearch } from "./use-clients-search";

export function ClientsSearchBar() {
  const { searchTerm, setSearchTerm } = useClientsSearch();

  return (
    <div className="flex-1 relative">
      <SearchNormal1
        color="#292D32"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6"
      />
      <Input
        placeholder="Search clients by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 h-12"
      />
    </div>
  );
}
