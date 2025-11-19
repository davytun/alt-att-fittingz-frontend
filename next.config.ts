import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Cache Components (Partial Pre-Rendering) - Next.js 16
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["@radix-ui/react-select", "iconsax-react"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
