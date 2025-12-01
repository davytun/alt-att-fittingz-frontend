import { apiClient } from "./client";
import type { 
  Order, 
  OrdersResponse, 
  CreateOrderRequest, 
  UpdateOrderRequest,
  UpdateOrderStatusRequest 
} from "@/types/order";

export const ordersApi = {
  // Create order for client
  createOrder: (clientId: string, data: CreateOrderRequest): Promise<Order> =>
    apiClient(`/clients/${clientId}/orders`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Create order for event and client
  createOrderForEvent: (clientId: string, eventId: string, data: CreateOrderRequest): Promise<Order> =>
    apiClient(`/clients/${clientId}/orders/event/${eventId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get orders for client
  getClientOrders: (clientId: string, page = 1, pageSize = 10): Promise<OrdersResponse> =>
    apiClient(`/clients/${clientId}/orders?page=${page}&pageSize=${pageSize}`),

  // Get all orders for admin
  getAllOrders: (page = 1, pageSize = 10): Promise<OrdersResponse> =>
    apiClient(`/clients/admin/orders?page=${page}&pageSize=${pageSize}`),

  // Get single order
  getOrder: (clientId: string, orderId: string): Promise<Order> =>
    apiClient(`/clients/${clientId}/orders/${orderId}?include=measurement`),

  // Update order
  updateOrder: (clientId: string, orderId: string, data: UpdateOrderRequest): Promise<Order> =>
    apiClient(`/clients/${clientId}/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Update order status
  updateOrderStatus: (clientId: string, orderId: string, data: UpdateOrderStatusRequest): Promise<Order> =>
    apiClient(`/clients/${clientId}/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Delete order
  deleteOrder: (clientId: string, orderId: string): Promise<void> =>
    apiClient(`/clients/${clientId}/orders/${orderId}`, {
      method: "DELETE",
    }),
};