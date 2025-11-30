import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { AiProvider } from "@/hooks/use-ai"
import { DevelopmentBanner } from "@/components/global/DevelopmentBanner";
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Analytics } from "@vercel/analytics/next"
import Providers from "@/contexts/provider"
import { ToastContainer } from "@/components/toast/toast-contaner"
import Script from "next/script"
 
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Free ATS Resume Builder - No Sign Up | CreateFreeCV.com',
  description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download, no credit card, no hidden fees. Create a free account for optional AI features.',
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
    description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download. Optional AI assistant with a free account.',
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
    description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download. Optional AI assistant with a free account.',
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
  verification: {
    google: 'your-google-verification-code',
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
        <meta name="clckd" content="00dd4cecdd1f49eb435533f606ecfa5a" />
        <Script id="aclib" src="//acscdn.com/script/aclib.js" strategy="beforeInteractive" />
        {/* Google Tag Manager and Google Analytics scripts (render unconditionally) */}
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W6W84N5N');
            `}
          </Script>

          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-YYGPPFLBZW"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', 'G-YYGPPFLBZW');
            `}
          </Script>
        </>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
      {/* GTM noscript iframe (render unconditionally) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-W6W84N5N"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <Providers>
        <AiProvider>
         
          {/* <DevelopmentBanner /> */}
          <Navbar />
          
          <main className="flex-1">{children}</main>
          <Footer />
           <ToastContainer />
          {/* <Analytics/> */}
      
        </AiProvider>
      </Providers>
      </body>
    </html>
  )
}
