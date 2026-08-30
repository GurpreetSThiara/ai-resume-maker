/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve images as-is (no /_next/image optimization). This avoids Vercel's
    // image-optimization quota entirely — next/image now behaves like a plain
    // <img> tag, passing the original src straight through.
    unoptimized: true,
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
  const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Content-Security-Policy',
      // 'unsafe-inline' on script-src is required by the GTM/GA bootstrap snippets
      // (components/legal/analytics-scripts.tsx) and Next's own inline hydration data.
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://cdn.jsdelivr.net",
        "font-src 'self' data:",
        "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://us.i.posthog.com https://ozqvvnfvjxrxtntcetvb.supabase.co wss://ozqvvnfvjxrxtntcetvb.supabase.co https://script.google.com https://accounts.google.com",
        "frame-src 'self' https://accounts.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "frame-ancestors 'self'",
      ].join('; '),
    },
  ]

  const headerRules = [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ]

  // Next.js already serves content-hashed build assets under /_next/static with
  // long-lived immutable caching in production. Applying that header ourselves in
  // development pins the browser to stale chunks (breaks HMR/reload), so only add
  // it for production builds.
  if (process.env.NODE_ENV === 'production') {
    headerRules.push({
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    })
  }

  return headerRules
},

}

export default nextConfig
