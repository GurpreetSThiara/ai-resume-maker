import React from 'react'
import Detail from '../../../app/ats-resume-explained/Detail'
import { JsonLd } from '@/components/seo/JsonLd'
import { blogPostSchema } from '@/lib/seo'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ATS Resume Explained: How It Works in 2026',
  description:
    'Understand how Applicant Tracking Systems work in 2026 and learn how to build an ATS-friendly resume that reaches recruiters.',
  alternates: {
    canonical: 'https://createfreecv.com/blog/ats-resume-explained',
  },

  keywords: [
    'ATS resume explained',
    'what is ATS resume',
    'how ATS works 2026',
    'beat ATS resume',
    'ATS friendly resume tips',
    'resume keywords ATS',
    'Applicant Tracking System guide',
    'ATS resume format',
    'CV ATS optimization',
    'job search 2026',
  ],

  openGraph: {
    title: 'ATS Resume Explained: Complete Guide for 2026',
    description:
      'Learn what ATS is, how it scans your resume, and how to create a simple, keyword-optimized resume that passes automated screening in 2026.',
    url: 'https://createfreecv.com/blog/ats-resume-explained',
    siteName: 'CreateFreeCV',
    type: 'article',
    images: [
      {
        url: '/blog/ats-resume-explained.jpg',
        width: 1200,
        height: 630,
        alt: 'ATS Resume Explained: How It Works in 2026',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ATS Resume Explained: Complete Guide for 2026',
    description:
      'Learn what ATS is, how it scans your resume, and how to create a simple, keyword-optimized resume that passes automated screening in 2026.',
    images: ['/blog/ats-resume-explained.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },
}

const page = () => {
  return (
    <div>
      <JsonLd
        data={blogPostSchema({
          title: 'ATS Resume Explained: How It Works in 2026',
          description: 'Understand how Applicant Tracking Systems work in 2026 and learn how to build an ATS-friendly resume that reaches recruiters.',
          slug: 'ats-resume-explained',
          image: '/blog/ats-resume-explained.jpg',
          author: 'CreateFreeCV Team',
          publishedAt: '2026-02-10',
        })}
      />
      <Detail />
    </div>
  )
}

export default page
