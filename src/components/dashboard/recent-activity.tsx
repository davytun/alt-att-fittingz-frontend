"use client";

import { ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientList } from "@/hooks/api/use-clients";

export function RecentActivity() {
  const router = useRouter();
  const { data } = useClientList(1, 10);
  const clients = data?.data ?? [];

  const recentClients = [...clients]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 4);

  const hasClients = recentClients.length > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base md:text-lg">
          Recent Clients Updates
        </CardTitle>
        <Button
          variant="link"
          className="text-[#0F4C75]"
          onClick={() => router.push("/clients")}
        >
          View All
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {hasClients ? (
          recentClients.map((client) => {
            const formattedDate = client.updatedAt
              ? new Date(client.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "";

            return (
              <button
                key={client.id}
                type="button"
                onClick={() => router.push(`/clients/${client.id}`)}
                className="flex w-full items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 text-left shadow-sm transition hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-[#222831]">
                    {client.name} Measurement
                  </p>
                  <p className="text-xs text-gray-500">
                    Last updated {formattedDate}
                  </p>
                </div>
                <ArrowRight2 size="24" color="#0F4C75" variant="Outline" />
              </button>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
            No recent client updates yet. Add your first client to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return <div className="h-64 animate-pulse rounded-xl bg-gray-300" />;
}
