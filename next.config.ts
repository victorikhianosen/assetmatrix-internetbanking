import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cba.pakassocredit.com",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3005", "jxmzkwg8-3005.uks1.devtunnels.ms"],
    },
  },
};

export default nextConfig;
