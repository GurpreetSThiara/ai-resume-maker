/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Allow external template preview images from jsdelivr CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
  reactStrictMode: false,
async headers() {
  // Next.js already serves content-hashed build assets under /_next/static with
  // long-lived immutable caching in production. Applying that header ourselves in
  // development pins the browser to stale chunks (breaks HMR/reload), so only add
  // it for production builds.
  if (process.env.NODE_ENV !== 'production') return []
  return [
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
},



}

export default nextConfig
