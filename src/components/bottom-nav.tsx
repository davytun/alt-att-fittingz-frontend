import { Gallery, Home, Profile2User, Setting2 } from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Profile2User,
  },
  {
    title: "Gallery",
    url: "/gallery",
    icon: Gallery,
  },

  {
    title: "Settings",
    url: "/settings",
    icon: Setting2,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-20 w-full border-t bg-white md:hidden px-4.5">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4 font-medium">
        {navItems.map((item) => {
          const isActive =
            pathname === item.url || pathname.startsWith(`${item.url}/`);

          return (
            <Link
              href={item.url}
              key={item.title}
              className={cn(
                "group inline-flex flex-col items-center justify-center px-5 rounded-lg mx-1 my-2",
              )}
            >
              <item.icon
                size={24}
                color={isActive ? "#0F4C75" : "#6B7280"}
                variant={isActive ? "Bold" : "Outline"}
              />
              <span
                className={cn(
                  "text-sm mt-1",
                  isActive
                    ? "text-[#0F4C75] font-bold"
                    : "text-gray-500 group-hover:text-[#0F4C75] font-bold",
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
