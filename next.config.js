// next.config.js
/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    MONGO_URI: process.env.MONGO_URI
  },

  // Webpack configuration for aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };
    return config;
  },

  // API routes rewriting
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      }
    ];
  },

  // Additional configurations
 

  // Enable strict mode for better development
  reactStrictMode: true,

  // Optional: Configure headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;