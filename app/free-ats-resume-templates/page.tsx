import React from 'react'
import {Templates} from './ResumeTemplates'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '50+ Professional Resume Templates - ATS-Optimized Designs | CreateFreeCV',
  description: 'Browse 50+ professional, ATS-optimized resume templates across 20 categories. Search, filter, preview, and customize modern, executive, creative, and developer designs in minutes.',
  keywords: 'resume templates, professional resume templates, ATS resume templates, modern resume templates, executive resume, developer resume, creative resume, resume template gallery, resume marketplace',
  
  openGraph: {
    title: 'Resume Templates Gallery | CreateFreeCV',
    description: 'Browse professional resume templates optimized for ATS. Choose from classic, modern, and industry-specific designs.',
    type: 'website',
    url: 'https://createfreecv.com/free-ats-resume-templates',
    siteName: 'CreateFreeCV',

  },
  
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Resume Templates Gallery | CreateFreeCV',
  //   description: 'Browse professional resume templates. Pick your design and customize instantly.',
  //   images: ['https://createfreecv.com/og-templates-preview.jpg']
  // },
  
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