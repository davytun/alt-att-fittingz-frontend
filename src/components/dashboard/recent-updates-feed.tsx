"use client";

import { Calendar, DollarSign, Ruler, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight2 } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecentUpdates } from "@/hooks/api/use-recent-updates";
import type { RecentUpdate, RecentUpdateType } from "@/types/recent-updates";

const getActivityIcon = (type: RecentUpdateType) => {
  const iconClass = "h-5 w-5";

  switch (type) {
    case "CLIENT_CREATED":
    case "CLIENT_UPDATED":
    case "CLIENT_DELETED":
      return <User className={iconClass} />;

    case "ORDER_CREATED":
    case "ORDER_UPDATED":
    case "ORDER_DELETED":
      return <ShoppingBag className={iconClass} />;

    case "PAYMENT_RECEIVED":
    case "PAYMENT_UPDATED":
      return <DollarSign className={iconClass} />;

    case "MEASUREMENT_CREATED":
    case "MEASUREMENT_UPDATED":
    case "MEASUREMENT_DELETED":
      return <Ruler className={iconClass} />;

    default:
      return <Calendar className={iconClass} />;
  }
};

const getActivityColor = (type: RecentUpdateType) => {
  if (type.includes("CREATED")) return "bg-green-50";
  if (type.includes("UPDATED")) return "bg-blue-50";
  if (type.includes("DELETED")) return "bg-red-50";
  if (type.includes("PAYMENT")) return "bg-emerald-50";
  return "bg-gray-50";
};

const getEntityLink = (update: RecentUpdate): string | null => {
  const { entityType, entityId } = update;

  switch (entityType) {
    case "Client":
      return `/clients/${entityId}`;
    default:
      return null;
  }
};

export function RecentUpdatesFeed() {
  const router = useRouter();
  const { data: updates, isLoading } = useRecentUpdates(20);

  const recentUpdates = updates?.slice(0, 5) || [];
  const hasUpdates = recentUpdates.length > 0;

  const handleActivityClick = (update: RecentUpdate) => {
    const link = getEntityLink(update);
    if (link) {
      router.push(link);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base md:text-lg">Recent Updates</CardTitle>
        <Button variant="link" className="text-[#0F4C75]">
          View All
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !hasUpdates ? (
          // Empty state
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
            No recent activity yet. Activity will appear here as you work.
          </div>
        ) : (
          // Activity list
          recentUpdates.map((update) => {
            const hasLink = getEntityLink(update) !== null;
            const timeAgo = formatDistanceToNow(new Date(update.createdAt), {
              addSuffix: true,
            });

            return (
              <button
                key={update.id}
                type="button"
                onClick={() => hasLink && handleActivityClick(update)}
                disabled={!hasLink}
                className={`flex w-full items-center justify-between rounded-xl border border-[#0F4C75] bg-white px-4 py-3 text-left shadow-sm transition ${
                  hasLink ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon */}
                  <div
                    className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getActivityColor(
                      update.type
                    )}`}
                  >
                    {getActivityIcon(update.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#222831] truncate">
                      {update.title}
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                </div>

                {/* Arrow icon */}
                {hasLink && (
                  <ArrowRight2
                    size="24"
                    color="#0F4C75"
                    variant="Outline"
                    className="shrink-0"
                  />
                )}
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
