"use client";

import { type ReactNode, Suspense } from "react";
import { Providers } from "@/lib/providers";

interface ClientWrapperProps {
  children: ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Providers>{children}</Providers>
    </Suspense>
  );
}
