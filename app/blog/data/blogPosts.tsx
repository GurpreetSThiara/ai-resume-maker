import { ArrowLeft, CheckCircle, XCircle, FileText, Layout, Type, Calendar, Clock, User, Lightbulb, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import React from 'react';

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: React.ReactNode;
    author: string;
    publishedAt: string;
    readingTime: string;
    category: string;
    featured: boolean;
    image: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 'how-to-use-ai-resume-builder',
        title: 'How to Use AI to Build a Job-Winning Resume in 2026',
        excerpt: 'Stop using generic ChatGPT resumes. Learn the "Hybrid Method" to combine AI speed with human strategy, avoid ATS rejection, and impress recruiters.',
        content: 'Creating a resume as a fresher is often confusing...',
        author: 'CreateFreeCV Team',
        publishedAt: '2026-02-12',
        readingTime: '8 min read',
        category: 'AI Tips',
        featured: false,
        image: '/blog/ai-resume-guide.jpg'
    },
    {
        id: 'resume-for-freshers',
        title: 'Resume for Freshers: Complete Guide to Create Your First Job-Winning Resume (2026)',
        excerpt: 'Learn how to create a professional fresher resume with our step-by-step guide. Includes 25+ examples, ATS-friendly tips, and real resume samples for students and recent graduates.',
        content: 'Creating a resume as a fresher is often confusing. You may feel stuck because you don\'t have years of work experience...',
        author: 'CreateFreeCV Team',
        publishedAt: '2026-02-09',
        readingTime: '8 min read',
        category: 'Resume Writing',
        featured: false,
        image: '/blog/fresher-resume-guide.jpg'
    },
    {
        id: 'ats-resume-guide',
        title: 'ATS Resume Guide 2026 – How to Create a Resume That Gets Interviews',
        excerpt: 'Learn how to create an ATS-optimized resume in 2026 with real examples for developers, marketers, students, and freshers. Step-by-step guide to pass Applicant Tracking Systems.',
        content: 'Detailed guide content here...',
        author: 'CreateFreeCV Team',
        publishedAt: '2026-02-08',
        readingTime: '6 min read',
        category: 'ATS Tips',
        featured: false,
        image: '/blog/ats-resume-guide.jpg'
    },
    {
        id: 'software-engineer-resume',
        title: 'Resume for Software Engineers: How to Create a Technical Resume That Gets Interviews in 2026',
        excerpt: 'Learn how software engineers can create ATS-optimized technical resumes that get interviews. Complete guide with examples, formatting tips, and what recruiters look for in 2026.',
        content: 'Detailed guide content here...',
        author: 'CreateFreeCV Team',
        publishedAt: '2026-02-09',
        readingTime: '12 min read',
        category: 'Resume Writing',
        featured: false,
        image: '/blog/software-engineer-resume.jpg'
    },
    {
        id: 'ats-resume-explained',
        title: 'ATS Resume Explained: What It Is, How It Works, and How to Beat It in 2026',
        excerpt:
            'Understand what Applicant Tracking Systems (ATS) are, how they read your resume, and how to create an ATS-friendly resume that reaches human recruiters in 2026.',
        content: null,
        author: 'CreateFreeCV Team',
        publishedAt: '2026-02-10',
        readingTime: '10 min read',
        category: 'ATS Tips',
        featured: false,
        image: '/blog/ats-resume-explained.jpg',
    },
    {
        id: 'resume-rejected-without-interview',
        title: 'Resume Rejected Without Interview? 12 Real Reasons Recruiters Don\'t Call Back (And How to Fix It)',
        excerpt:
            'Learn the 12 real reasons why your resume gets rejected before interviews and discover actionable strategies to fix each issue and get more callbacks from recruiters.',
        content: 'Detailed content...',
        author: 'CreateFreeCV Team',
        publishedAt: '2026-02-11',
        readingTime: '10 min read',
        category: 'Resume Writing',
        featured: false,
        image: '/blog/resume-rejection-reasons.jpg',
    },
    {
        id: 'why-modern-resumes-fail-ats',
        title: 'Why Modern Resumes Fail ATS: The Hidden Dangers of "Creative" Templates',
        excerpt: 'Discover why stylish, multi-column resumes get rejected by Applicant Tracking Systems (ATS) and how to choose a safe, professional format.',
        author: 'CreateFreeCV Team',
        publishedAt: '2026-02-18',
        readingTime: '6 min read',
        category: 'ATS Tips',
        featured: true,
        image: '/blog/ats-resume-explained.jpg',
        content: (
            <div className="space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    You’ve spent hours designing the perfect resume. It has a sleek sidebar for your skills, a modern font, and maybe even a photo. It looks professional and eye-catching.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                    But after applying to dozens of jobs, you hear nothing. Silence.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg my-8">
                    <h3 className="text-yellow-800 font-bold text-lg mb-2">The Harsh Reality</h3>
                    <p className="text-yellow-700">
                        75% of resumes are never seen by a human recruiter. They are filtered out by Applicant Tracking Systems (ATS) that simply cannot read complex layouts.
                    </p>
                </div>

                <h2 className="text-3xl font-bold text-primary mt-12 mb-6">How ATS "Reads" Your Resume</h2>
                <p className="text-muted-foreground leading-relaxed">
                    An Applicant Tracking System parses your resume file (PDF or Word) into plain text. It strips away all your fancy formatting, colors, and layout structure to extract data: Name, Phone, Skills, Experience.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                    If your layout is complex, the parser gets confused. It might read your resume straight across the page, mixing your sidebar skills with your main work experience.
                </p>

                <h2 className="text-3xl font-bold text-primary mt-12 mb-6">3 Common Triggers for Rejection</h2>

                <div className="space-y-6">
                    <Card className="border hover:border-red-200 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                                    <Layout className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">1. Multi-Column Layouts & Sidebars</h3>
                                    <p className="text-muted-foreground">
                                        <strong>The Problem:</strong> Older ATS parsers read left-to-right, ignoring columns.
                                    </p>
                                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded border text-sm font-mono text-slate-600">
                                        <span className="text-red-500 block mb-1"># How ATS might read a sidebar layout:</span>
                                        "2018 - Present  SKILLS: Python, Java  Senior Engineer  New York, NY"
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">
                                        It just mixed your start date, skills, job title, and location into one meaningless sentence.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border hover:border-red-200 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">2. Headers & Footers</h3>
                                    <p className="text-muted-foreground">
                                        <strong>The Problem:</strong> Many ATS parsers ignore information in the document header or footer entirely.
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        If your contact details (Email, Phone) are in the header, the recruiter might love your resume but have <strong>no way to contact you</strong> because that data wasn't parsed.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border hover:border-red-200 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                                    <Type className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">3. Icons & Graphics</h3>
                                    <p className="text-muted-foreground">
                                        <strong>The Problem:</strong> Images are invisible to text parsers.
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Using a phone icon instead of writing "Phone:"? The ATS won't know the number following that icon is a phone number. It's just random digits to the system.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-3xl font-bold text-primary mt-12 mb-6">The Solution: Go Boring to Get Hired</h2>
                <p className="text-muted-foreground leading-relaxed">
                    It sounds counter-intuitive, but a "boring" resume effectively gets you hired. You need a standard, single-column layout that puts readability first.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
                        <h4 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-4">
                            <XCircle className="w-5 h-5" /> Avoid
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>• Two-column structures</li>
                            <li>• Progress bars for skills</li>
                            <li>• Photos or headshots</li>
                            <li>• Tables and text boxes</li>
                            <li>• "Creative" fonts</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
                        <h4 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-4">
                            <CheckCircle className="w-5 h-5" /> Use Instead
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>• Single-column layout</li>
                            <li>• Simple bullet points</li>
                            <li>• Standard fonts (Arial, Calibri)</li>
                            <li>• Explicit headings (Experience, Skills)</li>
                            <li>• <strong>ATS Classic Compact</strong> Template</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">Ready to fix your resume?</h3>
                    <p className="text-slate-300 mb-6">
                        Switch to our <strong>ATS Classic Compact</strong> template. It's designed to pass every ATS check while keeping your content readable and professional.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard/resume/create?template=ats-classic-compact"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold transition-all"
                        >
                            Use ATS Classic Template
                        </Link>
                        <Link
                            href="/free-ats-resume-templates"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 font-medium transition-all"
                        >
                            View All Templates
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
];
