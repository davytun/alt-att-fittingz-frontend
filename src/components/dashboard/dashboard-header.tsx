"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function DashboardHeader() {
  const { admin } = useAuth();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0F4C75] px-6 py-8 text-white shadow-sm">
      <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-white/10" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] opacity-80">
            {getGreeting()}
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            {admin?.businessName || "Fittingz Admin"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={"secondary"}
            className=""
            onClick={() => router.push("/clients/new")}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Client
          </Button>
          <Button
            variant={"secondary"}
            className=""
            onClick={() =>
              toast.info("Coming soon", {
                description: "Order management is under development.",
              })
            }
          >
            <Plus className="mr-2 h-5 w-5" />
            New Order
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DashboardHeaderSkeleton() {
  return <div className="h-44 animate-pulse rounded-3xl bg-gray-300" />;
}
