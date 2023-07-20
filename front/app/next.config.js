/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
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
