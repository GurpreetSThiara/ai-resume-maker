import React from 'react'
import Detail from '../../../app/software-engineer-resume/Detail'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume for Software Engineers: How to Create a Technical Resume That Gets Interviews in 2026",
  description:
    "Learn how software engineers can create ATS-optimized technical resumes that get interviews. Complete guide with examples, formatting tips, and what recruiters look for in 2026.",

  keywords: [
    "software engineer resume",
    "technical resume 2026",
    "developer resume",
    "programmer resume",
    "software developer resume",
    "ATS friendly resume for engineers",
    "technical resume format",
    "software engineer resume examples",
    "coding resume",
    "developer resume template",
    "software engineering resume tips",
    "tech resume guide",
    "resume for software engineers",
    "technical skills resume",
    "software engineer resume format 2026"
  ],

  openGraph: {
    title: "Resume for Software Engineers: Technical Resume Guide 2026",
    description:
      "Complete guide for software engineers to create ATS-optimized resumes that get interviews. Includes examples, formatting tips, and recruiter insights.",
    url: "https://www.createfreecv.com/blog/software-engineer-resume",
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
