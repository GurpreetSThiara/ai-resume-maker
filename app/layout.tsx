import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AiProvider } from "@/hooks/use-ai"
import { DevelopmentBanner } from "@/components/global/DevelopmentBanner";
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Providers from "@/contexts/provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Free ATS Resume Builder - No Sign Up | CreateFreeCV.com',
  description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download, no credit card, no hidden fees. Create a free account for optional AI features.',
  keywords: ['free resume builder no sign up', 'ats resume builder', 'free resume download', 'ai resume writer', 'live preview resume builder', 'completely free resume builder', 'free resume builder no hidden fees'],
  authors: [{ name: 'CreateFreeCV Team', url: 'https://createfreecv.com' }],
  creator: 'CreateFreeCV Team',
  publisher: 'CreateFreeCV',
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
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
      <Providers>
        <AiProvider>
         
          <DevelopmentBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
      
        </AiProvider>
      </Providers>
      </body>
    </html>
  )
}
