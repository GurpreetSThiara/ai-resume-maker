import React from 'react'
import Detail from '../../../app/resume-rejected-without-interview/Detail'
import { JsonLd } from '@/components/seo/JsonLd'
import { blogPostSchema } from '@/lib/seo'

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "12 Reasons Your Resume Gets Rejected | CreateFreeCV",
    description:
        "Learn the 12 real reasons your resume gets rejected before interviews, and actionable fixes to get more callbacks from recruiters.",
    alternates: {
        canonical: "https://createfreecv.com/blog/resume-rejected-without-interview",
    },

    keywords: [
        "resume rejected",
        "resume not getting interviews",
        "why resume rejected",
        "recruiters not calling back",
        "resume optimization",
        "ATS resume tips",
        "resume formatting",
        "job application tips",
        "resume mistakes",
        "how to fix resume",
        "resume keywords",
        "resume metrics",
        "professional resume 2026"
    ],

    openGraph: {
        title: "Resume Rejected Without Interview? 12 Real Reasons Recruiters Don't Call Back",
        description:
            "Discover why your resume gets rejected and learn actionable strategies to fix each issue and get more callbacks from recruiters.",
        url: "https://createfreecv.com/blog/resume-rejected-without-interview",
        siteName: "CreateFreeCV",
        type: "article",
        images: [
            {
                url: "/blog/resume-rejection-reasons.jpg",
                width: 1200,
                height: 630,
                alt: "12 Reasons Your Resume Gets Rejected",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Resume Rejected Without Interview? 12 Real Reasons Recruiters Don't Call Back",
        description:
            "Discover why your resume gets rejected and learn actionable strategies to fix each issue and get more callbacks from recruiters.",
        images: ["/blog/resume-rejection-reasons.jpg"],
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
                data={blogPostSchema({
                    title: "12 Reasons Your Resume Gets Rejected | CreateFreeCV",
                    description: "Learn the 12 real reasons your resume gets rejected before interviews, and actionable fixes to get more callbacks from recruiters.",
                    slug: "resume-rejected-without-interview",
                    image: "/blog/resume-rejection-reasons.jpg",
                    author: "CreateFreeCV Team",
                    publishedAt: "2026-02-11",
                })}
            />
            <Detail />
        </div>
    )
}

export default page
