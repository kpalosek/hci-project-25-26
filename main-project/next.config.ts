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
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Ovo je Contentful domena
        port: '',
      },
    ],
  },
};

export default nextConfig;