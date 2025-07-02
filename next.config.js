// next.config.js
/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };

    return config;
  },
};

module.exports = nextConfig;