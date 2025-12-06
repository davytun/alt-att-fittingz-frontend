"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useClientList } from "@/hooks/api/use-clients";
import { ClientCard } from "./client-card";
import { useClientsSearch } from "./use-clients-search";

export function ClientsList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { searchTerm } = useClientsSearch();
  const { data, isLoading } = useClientList(page, pageSize);

  const clients = data?.data ?? [];
  const totalCount = data?.pagination?.total ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const filteredClients = searchTerm
    ? clients.filter((client) =>
        [client.name, client.email, client.phone].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    : clients;

  if (isLoading) return null;

  if (filteredClients.length === 0 && searchTerm) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-gray-500">
          No clients found for "
          <span className="font-bold text-[#0F4C75]">{searchTerm}</span>"
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Try searching by name, email, or phone number
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {filteredClients.map((client) => (
          <div key={client.id} className="min-w-0">
            <ClientCard client={client} />
          </div>
        ))}
      </div>

      {!searchTerm && totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-gray-100"
                  }
                />
              </PaginationItem>

              {/* Smart page numbers: show current ±3 */}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pageNum =
                  totalPages <= 7 ? i + 1 : Math.max(1, page - 3) + i;
                if (pageNum > totalPages) return null;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNum);
                      }}
                      isActive={pageNum === page}
                      className="w-10"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }).filter(Boolean)}

              {totalPages > 7 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-gray-100"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
