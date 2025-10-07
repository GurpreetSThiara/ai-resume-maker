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
    domains: ["cdn.jsdelivr.net"],
  },
  reactStrictMode: false,
}

export default nextConfig
