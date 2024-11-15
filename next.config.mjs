/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', 
  basePath: '',
  publicDir: 'public',
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://gym4fit-e5eggddufngjajb8.eastus-01.azurewebsites.net/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://gym4fit-e5eggddufngjajb8.eastus-01.azurewebsites.net'
      : 'http://localhost:3000',
  }
}

export default nextConfig