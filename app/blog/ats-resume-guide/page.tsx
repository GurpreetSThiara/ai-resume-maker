import React from 'react'
import Detail from '../../../app/how-to-write-a-resume/Detail'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ATS Resume Guide 2026 – How to Create a Resume That Gets Interviews",
  description:
    "Learn how to create an ATS-optimized resume in 2026 with real examples for developers, marketers, students, and freshers. Step-by-step guide to pass Applicant Tracking Systems and impress hiring managers.",

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
    url: "https://www.createfreecv.com/blog/ats-resume-guide",
    siteName: "CreateFreeCV",
    type: "article"
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
