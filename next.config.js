const path = require('path');

const nextConfig = {
  webpack: (config) => {
    config.resolve.modules.push(path.resolve('./src'));
    return config;
  },
};

module.exports = nextConfig;
