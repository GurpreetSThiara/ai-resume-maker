import React from 'react'
import Detail from '../../../app/software-engineer-resume/Detail'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Engineer Resume Guide 2026 | CreateFreeCV",
  description:
    "Learn how software engineers can create ATS-optimized technical resumes that get interviews, with examples and formatting tips.",
  alternates: {
    canonical: "https://createfreecv.com/blog/software-engineer-resume",
  },

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
    url: "https://createfreecv.com/blog/software-engineer-resume",
    siteName: "CreateFreeCV",
    type: "article",
    images: [
      {
        url: "/blog/software-engineer-resume.jpg",
        width: 1200,
        height: 630,
        alt: "Software Engineer Resume Guide 2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Resume for Software Engineers: Technical Resume Guide 2026",
    description:
      "Complete guide for software engineers to create ATS-optimized resumes that get interviews. Includes examples, formatting tips, and recruiter insights.",
    images: ["/blog/software-engineer-resume.jpg"],
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
