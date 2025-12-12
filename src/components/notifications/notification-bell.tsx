"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnreadCount } from "@/hooks/api/use-notifications";

interface NotificationBellProps {
  onClick: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.data?.unreadCount || 0;

  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
