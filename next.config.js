import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('src'), // Adjust based on your structure
    };
    return config;
  },
};

export default nextConfig;
