export type NotificationType =
  | "ORDER_STATUS"
  | "PAYMENT_RECEIVED"
  | "CLIENT_ADDED"
  | "PROJECT_UPDATE"
  | "SYSTEM_ALERT"
  | "REMINDER";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}
