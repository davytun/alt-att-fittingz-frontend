import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { showToast } from "@/lib/toast";
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from "@/types/order";

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  clientOrders: (clientId: string) =>
    [...orderKeys.all, "client", clientId] as const,
  adminOrders: () => [...orderKeys.all, "admin"] as const,
  order: (clientId: string, orderId: string) =>
    [...orderKeys.all, clientId, orderId] as const,
};

// Get client orders
export const useClientOrders = (clientId: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [...orderKeys.clientOrders(clientId), page, pageSize],
    queryFn: () => ordersApi.getClientOrders(clientId, page, pageSize),
    enabled: !!clientId,
  });
};

// Get all orders (admin)
export const useAllOrders = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [...orderKeys.adminOrders(), page, pageSize],
    queryFn: () => ordersApi.getAllOrders(page, pageSize),
  });
};

// Get single order
export const useOrder = (clientId: string, orderId: string) => {
  return useQuery({
    queryKey: orderKeys.order(clientId, orderId),
    queryFn: () => ordersApi.getOrder(clientId, orderId),
    enabled: !!(clientId && orderId),
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: CreateOrderRequest;
    }) => ordersApi.createOrder(clientId, data),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.clientOrders(clientId),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrders() });
      showToast.success("Order created successfully");
    },
    onError: () => {
      showToast.error("Failed to create order");
    },
  });
};

// Create order for event
export const useCreateOrderForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      eventId,
      data,
    }: {
      clientId: string;
      eventId: string;
      data: CreateOrderRequest;
    }) => ordersApi.createOrderForEvent(clientId, eventId, data),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.clientOrders(clientId),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrders() });
      showToast.success("Order created successfully");
    },
    onError: () => {
      showToast.error("Failed to create order");
    },
  });
};

// Update order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      orderId,
      data,
    }: {
      clientId: string;
      orderId: string;
      data: UpdateOrderRequest;
    }) => ordersApi.updateOrder(clientId, orderId, data),
    onSuccess: (_, { clientId, orderId }) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.order(clientId, orderId),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.clientOrders(clientId),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrders() });
      showToast.success("Order updated successfully");
    },
    onError: () => {
      showToast.error("Failed to update order");
    },
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      orderId,
      data,
    }: {
      clientId: string;
      orderId: string;
      data: UpdateOrderStatusRequest;
    }) => ordersApi.updateOrderStatus(clientId, orderId, data),
    onSuccess: (_, { clientId, orderId }) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.order(clientId, orderId),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.clientOrders(clientId),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrders() });
      showToast.success("Order status updated");
    },
    onError: () => {
      showToast.error("Failed to update order status");
    },
  });
};

// Delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      orderId,
    }: {
      clientId: string;
      orderId: string;
    }) => ordersApi.deleteOrder(clientId, orderId),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.clientOrders(clientId),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrders() });
      showToast.success("Order deleted successfully");
    },
    onError: () => {
      showToast.error("Failed to delete order");
    },
  });
};
