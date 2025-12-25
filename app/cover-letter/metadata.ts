import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Cover Letter Builder – ATS‑Friendly Templates, No Sign Up | CreateFreeCV.com',
  description: 'Create a professional cover letter online in minutes with our free AI‑assisted, ATS‑optimized cover letter builder. Job‑specific templates, instant DOCX download, no login required.',
  keywords: [
    'free cover letter builder',
    'free cover letter maker online',
    'AI cover letter generator free',
    'ATS friendly cover letter builder',
    'professional cover letter templates',
    'cover letter builder no sign up',
    'create cover letter online free',
    'free cover letter templates download DOCX',
    'ATS optimized cover letter templates',
    'job‑specific cover letter generator',
    'AI powered cover letter writer',
    'mobile friendly cover letter builder',
    'cover letter with ATS keywords',
    'instant cover letter download DOCX',
    'cover letter builder for freshers',
    'free cover letter builder no sign up',
    'cover letter generator without login',
    'no email required cover letter maker',
    'privacy‑first cover letter creator'
  ],
  authors: [{ name: 'CreateFreeCV Team', url: 'https://createfreecv.com' }],
  creator: 'CreateFreeCV Team',
  publisher: 'CreateFreeCV',
  metadataBase: new URL('https://createfreecv.com'),
  openGraph: {
    title: 'Free Cover Letter Builder – ATS‑Friendly Templates, No Sign Up | CreateFreeCV.com',
    description: 'Create a professional cover letter online in minutes with our free AI‑assisted, ATS‑optimized cover letter builder. Job‑specific templates, instant DOCX download, no login required.',
    url: 'https://createfreecv.com/cover-letter',
    siteName: 'CreateFreeCV',
    images: [
      {
        url: '/og-cover-letter.png',
        width: 1200,
        height: 630,
        alt: 'Create professional cover letters with CreateFreeCV.com',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Cover Letter Builder – ATS‑Friendly Templates, No Sign Up | CreateFreeCV.com',
    description: 'Create a professional cover letter online in minutes with our free AI‑assisted, ATS‑optimized cover letter builder. Job‑specific templates, instant DOCX download, no login required.',
    images: ['/twitter-cover-letter.png'], 
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
};
