import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";
import { showToast } from "@/lib/toast";
import type { NotificationParams } from "@/types";

export const useNotifications = (params?: NotificationParams) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsApi.getNotifications(params),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      showToast.error("Failed to mark notification as read");
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showToast.success("All notifications marked as read");
    },
    onError: () => {
      showToast.error("Failed to mark all notifications as read");
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showToast.success("Notification deleted");
    },
    onError: () => {
      showToast.error("Failed to delete notification");
    },
  });
};
