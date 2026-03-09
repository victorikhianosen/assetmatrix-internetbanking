import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assetmatrix.cashmatrixagent.com",
        // pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;