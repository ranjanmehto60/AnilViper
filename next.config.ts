import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are already small (roughly 40–80 KB). Serving them as
    // static assets avoids spending Cloudflare Image Transformation quota.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
