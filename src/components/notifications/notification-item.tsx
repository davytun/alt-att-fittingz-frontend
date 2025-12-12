"use client";

import { formatDistanceToNow } from "date-fns";
import { Dot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDeleteNotification,
  useMarkAsRead,
} from "@/hooks/api/use-notifications";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate(notification.id);
  };

  return (
    <button
      type="button"
      className={cn(
        "flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b text-left w-full",
        !notification.isRead && "bg-blue-50/50",
      )}
      onClick={handleClick}
    >
      {!notification.isRead && (
        <Dot className="h-4 w-4 text-blue-600 mt-1 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={handleDelete}
      >
        <X className="h-3 w-3" />
      </Button>
    </button>
  );
}
