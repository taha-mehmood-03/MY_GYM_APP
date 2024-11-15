// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      // Development config (local machine)
      basePath: '',
      publicDir: 'public',
      env: {
        MONGO_URI: 'mongodb://localhost:27017/TAHAKHAN',
        NODE_ENV: 'development',
        API_URL: 'http://localhost:3000'
      }
    }
  }

  return {
    // Production config (Azure)
    basePath: '',
    publicDir: 'public',
    output: 'standalone',
    env: {
      MONGO_URI: process.env.MONGO_URI, // This will be set in Azure
      NODE_ENV: 'production',
      API_URL: 'https://gym4fit-e5eggddufngjajb8.eastus-01.azurewebsites.net'
    }
  }
}