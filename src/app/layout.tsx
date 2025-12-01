import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Raleway } from "next/font/google";
import { ClientWrapper } from "@/components/client-wrapper";

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
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
