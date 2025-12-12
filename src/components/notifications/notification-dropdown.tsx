"use client";

import { CheckCheck, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useMarkAllAsRead,
  useNotifications,
} from "@/hooks/api/use-notifications";
import { NotificationBell } from "./notification-bell";
import { NotificationItem } from "./notification-item";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { data: notificationsData, isLoading } = useNotifications({
    limit: 10,
  });
  const markAllAsRead = useMarkAllAsRead();

  const notifications = notificationsData?.data?.notifications || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <NotificationBell onClick={() => setOpen(!open)} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-1">
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <a href="/notifications">
                <Settings className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="group">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" className="w-full text-sm" asChild>
              <a href="/notifications">View all notifications</a>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
