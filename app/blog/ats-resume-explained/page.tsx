import React from 'react'
import Detail from '../../../app/ats-resume-explained/Detail'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ATS Resume Explained: What It Is, How It Works, and How to Beat It in 2026',
  description:
    'Understand how Applicant Tracking Systems (ATS) work in 2026 and learn exactly how to create an ATS-friendly resume that reaches recruiters and gets interviews.',

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
    url: 'https://www.createfreecv.com/blog/ats-resume-explained',
    siteName: 'CreateFreeCV',
    type: 'article',
  },

  robots: {
    index: true,
    follow: true,
  },
}

const page = () => {
  return (
    <div>
      <Detail />
    </div>
  )
}

export default page
