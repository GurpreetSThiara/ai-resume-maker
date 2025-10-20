import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free ATS Classic Resume Template 2025 | Download PDF | CreateFreeCV',
  description: 'Create a professional ATS-friendly resume with our classic template. Single-column layout perfect for engineering, finance, and operations roles. Download free as PDF.',
  keywords: 'free ats resume template, ats friendly resume download, classic resume format pdf, engineering resume template free, single column resume builder, professional resume template 2025',
  
  openGraph: {
    title: 'ATS Classic Resume Template - Free Download | CreateFreeCV',
    description: 'Professional ATS-optimized resume template with single-column layout. Perfect for engineering, finance, and operations roles. Free PDF download.',
    type: 'website',
    url: 'https://createfreecv.com/free-ats-resume-templates/preview?template=ats-classic',
    images: [
      {
        url: 'https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/classic.png',
        width: 1200,
        height: 630,
        alt: 'ATS Classic Resume Template Preview',
      },
    ],
    siteName: 'CreateFreeCV',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Classic Resume Template | CreateFreeCV',
    description: 'Professional ATS-friendly resume template with single-column layout. Free download for engineering, finance, and operations roles.',
    images: ['https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/classic.png'],
  },
  
  alternates: {
    canonical: 'https://createfreecv.com/free-ats-resume-templates/preview?template=ats-classic'
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
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
