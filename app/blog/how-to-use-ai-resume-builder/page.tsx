import React from 'react';
import Detail from '@/app/how-to-use-ai-resume-builder/Detail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How to Use AI to Build a Job-Winning Resume in 2026 | CreateFreeCV',
    description:
        'Stop using generic ChatGPT resumes. Learn the "Hybrid Method" to combine AI speed with human strategy for a CV that actually gets interviews in 2026.',
    keywords: [
        'AI resume builder',
        'how to use AI for resume',
        'ChatGPT resume tips',
        'AI resume writing',
        'resume hybrid method',
        'ATS friendly AI resume',
        'job search 2026',
        'resume optimization',
        'resume templates'
    ],
    openGraph: {
        title: 'How to Use AI to Build a Job-Winning Resume in 2026',
        description:
            'Learn how to use AI tools effectively to build a resume that passes ATS and impresses recruiters, without sounding like a robot.',
        url: 'https://www.createfreecv.com/blog/how-to-use-ai-resume-builder',
        siteName: 'CreateFreeCV',
        type: 'article',
        images: [
            {
                url: '/blog/ai-resume-guide.jpg',
                width: 1200,
                height: 630,
                alt: 'How to Use AI to Build a Job-Winning Resume',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'How to Use AI to Build a Job-Winning Resume in 2026',
        description:
            'Stop using generic ChatGPT resumes. Learn the "Hybrid Method" to combine AI speed with human strategy.',
        images: ['/blog/ai-resume-guide.jpg'],
    },
};

const Page = () => {
    return <Detail />;
};

export default Page;
