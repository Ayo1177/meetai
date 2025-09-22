import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable experimental features that might cause issues
  experimental: {
    // Use traditional CSS chunking instead of lightningcss
    cssChunking: 'strict',
  },
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
    
    // Exclude problematic native modules
    config.externals = config.externals || [];
    config.externals.push({
      'lightningcss': 'lightningcss',
    });
    
    // Add alias to prevent lightningcss from being loaded
    config.resolve.alias = {
      ...config.resolve.alias,
      'lightningcss': false,
    };
    
    return config;
  },
};
