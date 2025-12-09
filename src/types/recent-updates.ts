export type RecentUpdateType =
  | "CLIENT_CREATED"
  | "CLIENT_UPDATED"
  | "CLIENT_DELETED"
  | "ORDER_CREATED"
  | "ORDER_UPDATED"
  | "ORDER_DELETED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_UPDATED"
  | "MEASUREMENT_CREATED"
  | "MEASUREMENT_UPDATED"
  | "MEASUREMENT_DELETED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED";

export type EntityType = "Client" | "Order" | "Payment" | "Measurement" | "Project";

export interface RecentUpdate {
  id: string;
  type: RecentUpdateType;
  title: string;
  description: string;
  entityId: string;
  entityType: EntityType;
  adminId: string;
  createdAt: string;
}

export interface RecentUpdatesResponse {
  success: boolean;
  message: string;
  data: RecentUpdate[];
}

export interface ActivitySummary {
  totalActivities: number;
  totalClients: number;
  totalOrders: number;
  totalGalleryStyles: number;
  byType: Record<string, number>;
  byDay: Record<string, number>;
  mostActiveDay: {
    date: string;
    count: number;
  };
  averagePerDay: number;
}

export interface ActivitySummaryResponse {
  success: boolean;
  message: string;
  data: ActivitySummary;
}

