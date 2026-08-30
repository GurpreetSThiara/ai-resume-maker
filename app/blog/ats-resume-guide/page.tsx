import React from 'react'
import Detail from '../../../app/how-to-write-a-resume/Detail'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ATS Resume Guide 2026 | CreateFreeCV",
  description:
    "Learn how to write an ATS-optimized resume in 2026 with real examples for developers, marketers, students, and freshers.",
  alternates: {
    canonical: "https://createfreecv.com/how-to-write-a-resume",
  },

  keywords: [
    "ATS resume",
    "ATS optimized resume 2026",
    "resume keywords",
    "resume writing guide",
    "how to make resume",
    "resume examples",
    "resume for freshers",
    "developer resume examples",
    "marketer resume examples",
    "ATS friendly CV",
    "resume format",
    "professional resume",
    "resume builder online",
    "job resume tips",
    "Applicant Tracking System resume"
  ],

  openGraph: {
    title: "ATS-Optimized Resume Guide 2026",
    description:
      "Step-by-step guide to writing a resume that passes ATS screening and gets noticed by recruiters. Includes real resume examples and formatting tips.",
    url: "https://createfreecv.com/blog/ats-resume-guide",
    siteName: "CreateFreeCV",
    type: "article",
    images: [
      {
        url: "/blog/ats-resume-guide.jpg",
        width: 1200,
        height: 630,
        alt: "ATS Resume Guide 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ATS-Optimized Resume Guide 2026",
    description:
      "Step-by-step guide to writing a resume that passes ATS screening and gets noticed by recruiters. Includes real resume examples and formatting tips.",
    images: ["/blog/ats-resume-guide.jpg"],
  },

  robots: {
    index: true,
    follow: true
  },
};

const page = () => {
  return (
    <div>
        <Detail/>
    </div>
  )
}

export default page
