import React from 'react'
import Detail from './Detail'

import type { Metadata } from "next";
import { JsonLd } from '@/components/seo/JsonLd';
import { howToSchema } from '@/lib/seo';

const HOW_TO_STEPS = [
  { name: 'Choose an ATS-friendly template', text: 'Start with a clean, single-column, ATS-compatible template so your resume parses correctly in applicant tracking systems.' },
  { name: 'Add your contact information', text: 'Put your name, phone, email, and LinkedIn/portfolio at the top of the page (never in the header/footer), so recruiters and ATS can find them.' },
  { name: 'Write a targeted professional summary', text: 'Summarize your value in 2-3 lines, tailored to the role, highlighting your most relevant skills and measurable achievements.' },
  { name: 'List work experience with quantified results', text: 'For each role, use action verbs and include metrics (numbers, percentages, outcomes) that prove your impact.' },
  { name: 'Add skills, education, and certifications', text: 'Include a categorized skills section with keywords from the job description, plus your education and any relevant certifications.' },
  { name: 'Proofread and download', text: 'Review for typos and consistency, then download your resume as a PDF or DOCX to send to employers.' },
];

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
    url: "https://createfreecv.com/ats-resume-guide",
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
        <JsonLd
          data={howToSchema({
            name: 'How to Write a Resume That Gets Interviews',
            description:
              'Step-by-step guide to writing an ATS-optimized resume that passes applicant tracking systems and impresses recruiters.',
            steps: HOW_TO_STEPS,
          })}
        />
        <Detail/>
    </div>
  )
}

export default page