"use client";

import { Calendar, DollarSign, Ruler, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight2 } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRecentUpdates } from "@/hooks/api/use-recent-updates";
import type { RecentUpdate, RecentUpdateType } from "@/types/recent-updates";

const getActivityIcon = (type: RecentUpdateType) => {
  const iconClass = "h-4 w-4";

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
  if (type.includes("CLIENT")) return { bg: "bg-green-50", dot: "bg-green-500" };
  if (type.includes("ORDER")) return { bg: "bg-blue-50", dot: "bg-blue-500" };
  if (type.includes("PAYMENT")) return { bg: "bg-emerald-50", dot: "bg-emerald-500" };
  if (type.includes("MEASUREMENT")) return { bg: "bg-purple-50", dot: "bg-purple-500" };
  if (type.includes("DELETED")) return { bg: "bg-red-50", dot: "bg-red-500" };
  return { bg: "bg-gray-50", dot: "bg-gray-400" };
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

export function ActivityFeed() {
  const router = useRouter();
  const { data: updates, isLoading } = useRecentUpdates(100);

  const handleActivityClick = (update: RecentUpdate) => {
    const link = getEntityLink(update);
    if (link) {
      router.push(link);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4", "skeleton-5"].map((id) => (
          <div
            key={id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 animate-pulse"
          >
            <div className="h-2 w-2 bg-gray-200 rounded-full" />
            <div className="h-9 w-9 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!updates || updates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto w-16 h-16 mb-3 rounded-full bg-blue-100 flex items-center justify-center">
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          All caught up!
        </p>
        <p className="text-xs text-gray-500">
          No activity to display yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {updates.map((update) => {
        const hasLink = getEntityLink(update) !== null;
        const timeAgo = formatDistanceToNow(new Date(update.createdAt), {
          addSuffix: true,
        });
        const colors = getActivityColor(update.type);
        const createdDate = new Date(update.createdAt);
        const formattedDate = createdDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <button
            key={update.id}
            type="button"
            onClick={() => hasLink && handleActivityClick(update)}
            disabled={!hasLink}
            title={formattedDate}
            className={`flex w-full items-center gap-3 rounded-lg border border-[#0F4C75] bg-white px-4 py-3 text-left transition ${
              hasLink ? "hover:bg-gray-50 cursor-pointer" : "opacity-60 cursor-default"
            }`}
          >
            {/* Status dot */}
            <div className={`shrink-0 h-2 w-2 rounded-full ${colors.dot}`} />

            {/* Icon */}
            <div
              className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${colors.bg}`}
            >
              {getActivityIcon(update.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#222831] truncate">
                {update.title}
              </p>
              <p className="text-xs text-gray-500 font-mono">{timeAgo}</p>
            </div>

            {/* Arrow icon - always show */}
            <ArrowRight2
              size="20"
              color={hasLink ? "#0F4C75" : "#9CA3AF"}
              variant="Outline"
              className="shrink-0"
            />
          </button>
        );
      })}
    </div>
  );
}
