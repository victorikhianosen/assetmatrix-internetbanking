import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cba.pakassocredit.com",
        pathname: "/uploads/**",
      },
    ]
  },
};

export default nextConfig;
