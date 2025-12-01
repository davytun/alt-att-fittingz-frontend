export interface OrderDetails {
  fabric: string;
  color: string;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  details: OrderDetails;
  price: string | number; // Backend returns string, frontend uses number
  currency: string;
  dueDate: string;
  status: OrderStatus;
  deposit: string | number; // Backend returns string, frontend uses number
  styleDescription: string | null;
  note: string | null;
  totalPaid: number;
  outstandingBalance: number;
  measurementId?: string;
  createdAt: string;
  updatedAt: string;
  client: {
    name: string;
  };
  project?: {
    name: string;
  } | null;
  event?: {
    name: string;
  } | null;
  measurement?: {
    id: string;
    name: string;
    fields: Record<string, unknown>;
  };
  payments: Payment[];
  styleImages: StyleImageRef[];
}

export interface Payment {
  id: string;
  amount: number;
  notes: string;
}

export interface StyleImageRef {
  styleImage: {
    id: string;
    imageUrl: string;
    description: string;
  };
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PROCESSING"
  | "READY_FOR_PICKUP"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export interface CreateOrderRequest {
  details: OrderDetails;
  price: number;
  currency: string;
  dueDate: string;
  status: OrderStatus;
  projectId?: string;
  eventId?: string;
  deposit: number;
  styleDescription: string;
  styleImageIds?: string[];
  note: string;
  measurementId?: string;
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> { }

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}