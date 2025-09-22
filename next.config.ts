import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper CSS handling
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Webpack configuration to handle CSS processing
  webpack: (config, { isServer, dev }) => {
    // Ensure proper CSS handling for Vercel deployment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
};
