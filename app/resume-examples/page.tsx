import React from 'react'
import { ResumeExamples } from './ResumeExamples'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Resume Examples & Samples by Industry | CreateFreeCV',
    description: 'Browse real resume examples from Software Engineering, Product Management, Marketing, Data Science, Healthcare, and Finance.',
    keywords: 'resume examples, resume samples, professional resume examples, industry-specific resumes, software engineer resume example, product manager resume sample, marketing resume example, data scientist resume, healthcare resume, finance resume',

    openGraph: {
        title: 'Professional Resume Examples | CreateFreeCV',
        description: 'Browse real resume examples from various industries. Use these professional samples to create your perfect resume.',
        type: 'website',
        url: 'https://createfreecv.com/resume-examples',
        siteName: 'CreateFreeCV',
        images: [
            {
                url: '/og-resume-examples.png',
                width: 1200,
                height: 630,
                alt: 'Resume examples by industry on CreateFreeCV.com',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Professional Resume Examples | CreateFreeCV',
        description: 'Browse real resume examples from various industries. Use these professional samples to create your perfect resume.',
        images: ['/og-resume-examples.png'],
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
