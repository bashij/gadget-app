/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.gadgetlink-app.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
