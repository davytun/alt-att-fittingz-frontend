"use client";

import { type ReactNode, Suspense } from "react";
import { Providers } from "@/lib/providers";

interface ClientWrapperProps {
  children: ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C75]" />
        </div>
      }
    >
      <Providers>{children}</Providers>
    </Suspense>
  );
}
