import React from 'react'
import Detail from '../../../app/resume-for-freshers/Detail'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume for Freshers: Complete Guide to Create Your First Job-Winning Resume (2026)",
  description:
    "Learn how to create a professional fresher resume in 2026. Step-by-step guide with 25+ examples, ATS-friendly tips, and real resume samples for students and recent graduates.",

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
    url: "https://www.createfreecv.com/blog/resume-for-freshers",
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
