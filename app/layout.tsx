import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { AiProvider } from "@/hooks/use-ai"
import { DevelopmentBanner } from "@/components/global/DevelopmentBanner";
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/mobile/bottom-nav"
import { Analytics } from "@vercel/analytics/next"
import Providers from "@/contexts/provider"
import { ToastContainer } from "@/components/toast/toast-contaner"
import { JsonLd } from "@/components/seo/JsonLd"
import { organizationSchema, websiteSchema, webApplicationSchema } from "@/lib/seo"
import { AnalyticsScripts } from "@/components/legal/analytics-scripts"
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner"

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Free ATS Resume Builder - No Sign Up | CreateFreeCV.com',
  description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free PDF download, no credit card, no hidden fees.',
  keywords: ['free resume builder no sign up', 'ats resume builder', 'free resume download', 'ai resume writer', 'live preview resume builder', 'completely free resume builder', 'free resume builder no hidden fees'],
  authors: [{ name: 'CreateFreeCV Team', url: 'https://createfreecv.com' }],
  creator: 'CreateFreeCV Team',
  publisher: 'CreateFreeCV',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  metadataBase: new URL('https://createfreecv.com'),
  openGraph: {
    title: 'Free ATS Resume Builder - No Sign Up | CreateFreeCV.com',
    description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download.',
    url: 'https://createfreecv.com',
    siteName: 'CreateFreeCV',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Create a professional resume with CreateFreeCV.com',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Builder - No Sign Up | CreateFreeCV.com',
    description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CreateFreeCV" />
        <meta name="application-name" content="CreateFreeCV" />
        <meta name="theme-color" content="#15803d" />
        <meta name="msapplication-TileColor" content="#15803d" />
        <meta name="clckd" content="00dd4cecdd1f49eb435533f606ecfa5a" />
        {/* Global structured data: brand identity + the free resume builder app. */}
        <JsonLd data={[organizationSchema(), websiteSchema(), webApplicationSchema()]} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* GTM/GA only load after the user accepts the cookie consent banner below. */}
        <AnalyticsScripts />
        <Providers>
          <AiProvider>

            {/* Skip link for keyboard users — visually hidden until focused. */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
            >
              Skip to content
            </a>

            {/* <DevelopmentBanner /> */}
            <Navbar />

            {/* Bottom padding on mobile so content clears the fixed bottom tab bar. */}
            <main id="main-content" className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <ToastContainer />
            {/* <Analytics/> */}

          </AiProvider>
        </Providers>
        <CookieConsentBanner />
      </body>
    </html>
  )
}
