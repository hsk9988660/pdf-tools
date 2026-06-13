/** @type {import('next').NextConfig} */
const API_HOST = process.env.API_HOST || 'localhost';

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${API_HOST}:3001/api/:path*`,
      },
      {
        source: '/download/:path*',
        destination: `http://${API_HOST}:3001/download/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
