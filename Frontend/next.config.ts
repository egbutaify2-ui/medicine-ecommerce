import "./src/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.PUBLIC_BACKEND_URL || "https://medi-store-omega.vercel.app"}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
