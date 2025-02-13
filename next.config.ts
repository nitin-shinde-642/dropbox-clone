import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.vectorlogo.zone'
      }
    ]
  }
};

export default nextConfig;
