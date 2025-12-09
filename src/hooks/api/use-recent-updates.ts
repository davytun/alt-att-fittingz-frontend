import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  ActivitySummaryResponse,
  RecentUpdatesResponse,
} from "@/types/recent-updates";

export function useRecentUpdates(limit = 20) {
  return useQuery({
    queryKey: ["recentUpdates", limit],
    queryFn: () =>
      apiClient<RecentUpdatesResponse>(endpoints.recentUpdates.list(limit)),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    select: (data) => data.data, // Extract just the updates array
  });
}

export function useActivitySummary(days = 7) {
  return useQuery({
    queryKey: ["activitySummary", days],
    queryFn: () =>
      apiClient<ActivitySummaryResponse>(endpoints.recentUpdates.summary(days)),
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    select: (data) => data.data, // Extract just the summary object
  });
}
