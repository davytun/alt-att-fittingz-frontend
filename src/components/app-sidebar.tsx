// components/app-sidebar.tsx
"use client";

import { Home2, People, Gallery, Setting2, LogoutCurve } from "iconsax-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuthContext } from "@/lib/auth-provider";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home2 },
  { title: "Clients", url: "/clients", icon: People },
  { title: "Gallery", url: "/gallery", icon: Gallery },
  { title: "Settings", url: "/settings", icon: Setting2 },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { logout } = useAuthContext();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="mb-5">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image src="/icon.png" alt="Logo" width={30} height={30} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-[40px]">
                    Fitt<span className="text-black">ingz</span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarMenu className="gap-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(`${item.url}/`);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "w-full px-3 py-7 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/95 hover:text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 w-full"
                  >
                    <item.icon
                      size={24}
                      variant={isActive ? "Bold" : "Outline"}
                      color={
                        isActive ? "var(--background)" : "var(--foreground)"
                      }
                      className={cn(
                        "transition-all duration-200",
                        isActive && "text-primary-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-lg transition-all duration-200",
                        isActive ? "text-white font-bold" : "text-[#222831]"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className="h-11 justify-start gap-3 hover:bg-red-500/50 cursor-pointer"
            >
              <div className="flex items-center text-red-600 dark:text-red-400">
                <LogoutCurve
                  size={24}
                  variant="Bold"
                  color="var(--color-red-600)"
                />
                <span className="font-medium text-red-600">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
