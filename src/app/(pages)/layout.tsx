"use client";

import { Notification, ProfileCircle } from "iconsax-react";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-is-mobile";

interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      {isMobile ? <BottomNav /> : <AppSidebar />}
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-white px-4">
          <div className="flex items-center gap-2 md:flex hidden">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ProfileCircle
                className="h-6 w-6"
                color="#222831"
                variant="Outline"
              />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Notification
                className="h-6 w-6"
                color="#222831"
                variant="Outline"
              />
            </Button>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
