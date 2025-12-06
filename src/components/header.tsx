import { Notification, ProfileCircle } from "iconsax-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
          <Button variant="ghost" size="icon" className="rounded-full">
            <ProfileCircle
              className="h-6 w-6"
              color="#222831"
              variant="Outline"
            />
            <span className="sr-only">Profile</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Notification
              className="h-6 w-6"
              color="#222831"
              variant="Outline"
            />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </header>

      <main className="p-4">{children}</main>
    </>
  );
}
