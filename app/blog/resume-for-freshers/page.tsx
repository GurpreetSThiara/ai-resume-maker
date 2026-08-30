import React from 'react'
import Detail from '../../../app/resume-for-freshers/Detail'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume for Freshers: Complete 2026 Guide | CreateFreeCV",
  description:
    "Learn how to create a professional fresher resume in 2026 with 25+ examples, ATS-friendly tips, and real samples for graduates.",
  alternates: {
    canonical: "https://createfreecv.com/resume-for-freshers",
  },

  keywords: [
    "resume for freshers",
    "fresher resume 2026",
    "how to write fresher resume",
    "resume for students",
    "recent graduate resume",
    "entry level resume",
    "first job resume",
    "ATS friendly resume for freshers",
    "resume examples for freshers",
    "fresher resume format",
    "resume builder for freshers",
    "student resume template",
    "college graduate resume",
    "no experience resume",
    "professional resume for freshers"
  ],

  openGraph: {
    title: "Resume for Freshers: Complete Guide (2026)",
    description:
      "Step-by-step guide to creating a job-winning fresher resume with 25+ examples, ATS tips, and professional templates.",
    url: "https://createfreecv.com/blog/resume-for-freshers",
    siteName: "CreateFreeCV",
    type: "article",
    images: [
      {
        url: "/blog/fresher-resume-guide.jpg",
        width: 1200,
        height: 630,
        alt: "Resume for Freshers: Complete 2026 Guide",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Resume for Freshers: Complete Guide (2026)",
    description:
      "Step-by-step guide to creating a job-winning fresher resume with 25+ examples, ATS tips, and professional templates.",
    images: ["/blog/fresher-resume-guide.jpg"],
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
