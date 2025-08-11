import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AiProvider } from "@/hooks/use-ai"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Resume Builder - Create Professional Resumes | Free ATS-Friendly Templates",
  description:
    "Build professional, ATS-friendly resumes with our free resume builder. Get hired faster with our easy-to-use tools, expert templates, and gamified experience. Create your perfect resume in minutes!",
  keywords: [
    "resume builder",
    "free resume builder",
    "ATS friendly resume",
    "professional resume templates",
    "resume maker",
    "CV builder",
    "job application",
    "career tools",
    "resume templates",
    "professional resume",
    "resume writing",
    "job search",
    "career development",
    "resume format",
    "resume examples"
  ],
  authors: [{ name: "Resume Builder Team" }],
  creator: "Resume Builder",
  publisher: "Resume Builder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://resume-builder.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Resume Builder - Create Professional Resumes | Free ATS-Friendly Templates",
    description: "Build professional, ATS-friendly resumes with our free resume builder. Get hired faster with our easy-to-use tools, expert templates, and gamified experience.",
    url: 'https://resume-builder.com',
    siteName: 'Resume Builder',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Resume Builder - Professional Resume Creation Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Resume Builder - Create Professional Resumes",
    description: "Build professional, ATS-friendly resumes with our free resume builder. Get hired faster!",
    images: ['/og-image.jpg'],
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
        <AiProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AiProvider>
      </body>
    </html>
  )
}
