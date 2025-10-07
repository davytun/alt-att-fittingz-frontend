import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Raleway } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers/providers";

const raleway = Raleway({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Fittingz - Business Management",
  description: "Manage your fitting business efficiently",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${raleway.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
