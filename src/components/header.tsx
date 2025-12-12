import Image from "next/image";
import { NotificationDropdown } from "@/components/notifications";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center border-b bg-white px-4">
        {/* Desktop: Sidebar trigger */}
        <div className="hidden items-center gap-2 md:flex">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
        </div>

        {/* Mobile: Logo */}
        <div className="md:hidden">
          <Image
            src="/logo.png"
            alt="Logo"
            width={192}
            height={192}
            className="h-8 w-auto"
          />
        </div>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-2">
          <UserDropdown />
          <NotificationDropdown />
        </div>
      </header>

      <main className="p-4">{children}</main>
    </>
  );
}
