/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    serverActions: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",       // main CDN
      },
      {
        protocol: "https",
        hostname: "i.dummyjson.com",         // alternate CDN
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",           // direct images
      },
    ],
  },

  webpack: (config) => {
    config.devtool = false;
    return config;
  },
};

export default nextConfig;
