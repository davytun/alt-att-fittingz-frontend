"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { queryClient } from "@/api";
import { AuthProvider } from "./auth-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-center"
          closeButton
          richColors={false}
          // no theme="dark" ← removed on purpose
          toastOptions={{
            className: "[-webkit-box-shadow:0_4px_20px_rgba(0,0,0,0.12)]", // optional extra shadow
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            } as React.CSSProperties,
            classNames: {
              title: "font-medium",
              description: "text-sm opacity-80 !text-white",
              success: "!bg-[#0F4C75] !text-white !border-gray-200",
              error: "!bg-red-600 !text-white !border-red-700",
              warning: "!bg-yellow-500 !text-black !border-yellow-600",
              info: "!bg-[#0F4C75] !text-white !border-blue-700",
              actionButton:
                "bg-primary text-primary-foreground hover:bg-primary/90",
              cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
