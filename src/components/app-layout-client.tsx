"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-is-mobile";

export function AppLayoutClient({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      {isMobile ? <BottomNav /> : <AppSidebar />}
      <SidebarInset>
        <Header>{children}</Header>
      </SidebarInset>
    </SidebarProvider>
  );
}
