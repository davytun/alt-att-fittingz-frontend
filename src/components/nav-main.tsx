"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: string | number;
  color?: string;
  variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: ComponentType<IconProps>;
    variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
    isActive?: boolean;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="mt-8">
      <SidebarMenu>
        {items.map((item) => {
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
                    ? "bg-[#0F4C75] text-white"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <Link href={item.url}>
                  <div className="flex items-center gap-3 w-full">
                    <item.icon
                      size={24}
                      color={isActive ? "#ffffff" : "#222831"}
                      variant={isActive ? "Bold" : "Outline"}
                    />
                    <span
                      className={cn(
                        "text-lg transition-all duration-200",
                        isActive ? "text-white font-bold" : "text-[#222831]",
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
