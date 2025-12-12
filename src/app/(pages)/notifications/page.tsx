"use client";

import { CheckCheck, Filter } from "lucide-react";
import { useState } from "react";
import { NotificationItem } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useMarkAllAsRead,
  useNotifications,
} from "@/hooks/api/use-notifications";
import type { NotificationType } from "@/types";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading } = useNotifications({
    type: filter === "all" ? undefined : filter,
    unreadOnly,
    limit: 50,
  });

  const markAllAsRead = useMarkAllAsRead();
  const notifications = data?.data?.notifications || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={filter}
            onValueChange={(value) =>
              setFilter(value as NotificationType | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ORDER_STATUS">Order Status</SelectItem>
              <SelectItem value="PAYMENT_RECEIVED">Payment</SelectItem>
              <SelectItem value="CLIENT_ADDED">Client Added</SelectItem>
              <SelectItem value="PROJECT_UPDATE">Project Update</SelectItem>
              <SelectItem value="SYSTEM_ALERT">System Alert</SelectItem>
              <SelectItem value="REMINDER">Reminder</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={unreadOnly ? "default" : "outline"}
              onClick={() => setUnreadOnly(!unreadOnly)}
              className="flex-1 sm:flex-none"
            >
              Unread Only
            </Button>

            {hasUnread && (
              <Button
                variant="outline"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="flex-1 sm:flex-none"
              >
                <CheckCheck className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Mark All Read</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No notifications found
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
        </CardContent>
      </Card>
    </div>
  );
}
