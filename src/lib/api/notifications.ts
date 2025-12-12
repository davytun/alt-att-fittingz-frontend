import type {
  NotificationParams,
  NotificationsResponse,
  UnreadCountResponse,
} from "@/types";
import { AuthenticatedClient } from "./auth-client";
import { endpoints } from "./endpoints";

export const notificationsApi = {
  getNotifications: async (
    params?: NotificationParams,
  ): Promise<NotificationsResponse> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.unreadOnly) searchParams.set("unreadOnly", "true");
      if (params?.type) searchParams.set("type", params.type);

      const url = `${endpoints.notifications.list}${searchParams.toString() ? `?${searchParams}` : ""}`;
      return AuthenticatedClient.get(url);
    } catch {
      return {
        success: true,
        data: {
          notifications: [],
          pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
          unreadCount: 0,
        },
      };
    }
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    try {
      return AuthenticatedClient.get(endpoints.notifications.unreadCount);
    } catch {
      return { success: true, data: { unreadCount: 0 } };
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    return AuthenticatedClient.patch(endpoints.notifications.markAsRead(id));
  },

  markAllAsRead: async (): Promise<void> => {
    return AuthenticatedClient.patch(endpoints.notifications.markAllRead);
  },

  deleteNotification: async (id: string): Promise<void> => {
    return AuthenticatedClient.delete(endpoints.notifications.delete(id));
  },
};
