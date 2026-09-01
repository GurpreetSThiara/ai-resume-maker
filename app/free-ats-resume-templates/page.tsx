import React from 'react'
import {Templates} from './ResumeTemplates'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '90 ATS-Optimized Resume Templates | CreateFreeCV',
  description: 'Browse 90 professional, ATS-optimized resume templates across 20 categories. Search, filter, and customize instantly.',
  keywords: 'resume templates, professional resume templates, ATS resume templates, modern resume templates, executive resume, developer resume, creative resume, resume template gallery, resume marketplace',

  openGraph: {
    title: 'Resume Templates Gallery | CreateFreeCV',
    description: 'Browse professional resume templates optimized for ATS. Choose from classic, modern, and industry-specific designs.',
    type: 'website',
    url: 'https://createfreecv.com/free-ats-resume-templates',
    siteName: 'CreateFreeCV',
    images: [
      {
        url: '/og-templates.png',
        width: 1200,
        height: 630,
        alt: 'Browse ATS-optimized resume templates on CreateFreeCV.com',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Resume Templates Gallery | CreateFreeCV',
    description: 'Browse professional resume templates. Pick your design and customize instantly.',
    images: ['/og-templates.png'],
  },

  alternates: {
    canonical: 'https://createfreecv.com/free-ats-resume-templates'
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
    }
  }
}

const FreeAtsResumeTemplatesPage = () => {
  return (
    <div>
      <Templates />
    </div>
  )
}

export default FreeAtsResumeTemplatesPage