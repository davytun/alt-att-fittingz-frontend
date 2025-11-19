"use client";

import { Gallery, Menu, Profile2User, Setting2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Menu,
      variant: "Bold" as const,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Profile2User,
      variant: "Outline" as const,
    },
    {
      title: "Inspiration",
      url: "/inspiration",
      icon: Gallery,
      variant: "Outline" as const,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: Profile2User,
      variant: "Outline" as const,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Setting2,
      variant: "Outline" as const,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <Image
                  src="/logo.png"
                  alt="fittingz logo"
                  width={150}
                  height={150}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
