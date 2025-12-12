"use client";

import { ProfileCircle } from "iconsax-react";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/auth-store";

export function UserDropdown() {
  const { admin, clearAuth } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ProfileCircle
            className="h-6 w-6"
            color="#222831"
            variant="Outline"
          />
          <span className="sr-only">Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{admin?.businessName}</p>
            <p className="text-xs text-muted-foreground">{admin?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/settings/edit-profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={clearAuth}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
