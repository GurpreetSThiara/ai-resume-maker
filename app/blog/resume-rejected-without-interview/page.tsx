import React from 'react'
import Detail from '../../../app/resume-rejected-without-interview/Detail'

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume Rejected Without Interview? 12 Real Reasons Recruiters Don't Call Back (And How to Fix It)",
    description:
        "Learn the 12 real reasons why your resume gets rejected before interviews and discover actionable strategies to fix each issue and get more callbacks from recruiters.",

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
        url: "https://www.createfreecv.com/blog/resume-rejected-without-interview",
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
            <Detail />
        </div>
    )
}

export default page
