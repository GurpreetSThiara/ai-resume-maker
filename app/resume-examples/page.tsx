import React from 'react'
import { ResumeExamples } from './ResumeExamples'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Resume Examples & Samples - Real Industry-Specific Templates | CreateFreeCV',
    description: 'Browse real resume examples from different industries including Software Engineering, Product Management, Marketing, Data Science, Healthcare, and Finance. Use these samples as a starting point for your resume.',
    keywords: 'resume examples, resume samples, professional resume examples, industry-specific resumes, software engineer resume example, product manager resume sample, marketing resume example, data scientist resume, healthcare resume, finance resume',

    openGraph: {
        title: 'Professional Resume Examples | CreateFreeCV',
        description: 'Browse real resume examples from various industries. Use these professional samples to create your perfect resume.',
        type: 'website',
        url: 'https://createfreecv.com/resume-examples',
        siteName: 'CreateFreeCV',
    },

    alternates: {
        canonical: 'https://createfreecv.com/resume-examples'
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

const ResumeExamplesPage = () => {
    return (
        <div>
            <ResumeExamples />
        </div>
    )
}

export default ResumeExamplesPage
