import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Za slike gradova
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Za slike aerodroma
      },
    ],
  },
};

export default nextConfig;