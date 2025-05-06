/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MASTER_EMAIL: process.env.NEXT_PUBLIC_MASTER_EMAIL,
    NEXT_PUBLIC_MASTER_PASSWORD: process.env.NEXT_PUBLIC_MASTER_PASSWORD,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3333/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 