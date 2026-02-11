"use client"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Detail = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <header className="mb-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-primary hover:text-primary/80 mb-6 font-medium"
                    >
                        ← Back to Blog
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <Badge className="bg-blue-100 text-blue-700">Resume Writing</Badge>
                        <span className="text-sm text-muted-foreground">10 min read</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">February 11, 2026</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                        Resume Rejected Without Interview? 12 Real Reasons Recruiters Don't Call Back (And How to Fix It)
                    </h1>

                    <p className="text-xl text-muted-foreground">
                        Learn the 12 real reasons why your resume gets rejected before interviews and discover actionable strategies to fix each issue and get more callbacks from recruiters.
                    </p>
                </header>

                {/* Main Content */}
                <article className="prose prose-lg max-w-none">
                    <Card className="mb-8 border-l-4 border-l-yellow-500">
                        <CardContent className="pt-6">
                            <p className="text-lg">
                                <strong>If job requires:</strong>
                            </p>
                            <ul className="mt-4 space-y-2">
                                <li>5+ years experience</li>
                                <li>Advanced cloud architecture</li>
                            </ul>
                            <p className="mt-4">
                                <strong>And you're a fresher,</strong>
                            </p>
                            <p className="text-lg font-semibold mt-2">
                                Your resume won't pass.
                            </p>
                            <p className="mt-4 text-muted-foreground">
                                Be strategic.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Introduction to 12 Reasons */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6">
                            Why Resumes Get Rejected Without an Interview
                        </h2>

                        <p className="text-lg mb-4">
                            You've sent out dozens of applications. Maybe even hundreds.
                        </p>
                        <p className="text-lg mb-4">
                            But the phone isn't ringing.
                        </p>
                        <p className="text-lg mb-6">
                            Before you blame the job market or think you're not qualified enough, understand this: <strong>most resume rejections happen before a human even reads your resume.</strong>
                        </p>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <p className="text-lg">
                                    Here are the 12 real reasons recruiters don't call back — and exactly how to fix each one.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 1 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">1️⃣</span> Your Resume Isn't Tailored to the Job Description
                        </h2>

                        <p className="text-lg mb-4">
                            Sending the same resume to every job is the fastest way to get rejected.
                        </p>

                        <Card className="mb-6 border-l-4 border-l-red-500">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-2">❌ Generic Resume:</p>
                                <p className="text-muted-foreground mb-4">
                                    "Responsible for managing projects and working with teams."
                                </p>
                                <p className="font-semibold mb-2">✅ Tailored Resume:</p>
                                <p className="text-muted-foreground">
                                    "Led cross-functional Agile teams to deliver 5 cloud migration projects, aligning with company's AWS infrastructure goals mentioned in JD."
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">How to Fix It:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Read the job description carefully and highlight key requirements</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Mirror the language and keywords used in the posting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Reorder your bullet points to prioritize relevant experience</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Remove or minimize irrelevant skills and experiences</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 2 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">2️⃣</span> Poor ATS Optimization
                        </h2>

                        <p className="text-lg mb-6">
                            75% of resumes never reach human eyes because Applicant Tracking Systems (ATS) filter them out first.
                        </p>

                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">Common ATS Killers:</p>
                                <div className="grid gap-3">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>Headers/footers with contact info (ATS can't read them)</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>Tables, text boxes, and images</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>Fancy fonts and graphics</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>Abbreviations without spelling them out first</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>Using icons instead of words (e.g., ☎ instead of "Phone")</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">How to Fix It:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Use a simple, clean format with standard fonts (Arial, Calibri, Times New Roman)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Put contact info in the main body, not header/footer</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Use standard section headings: "Work Experience," "Education," "Skills"</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Save as .docx or PDF (check job posting for preference)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Include keywords from job description naturally throughout</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 3 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">3️⃣</span> Typos and Grammatical Errors
                        </h2>

                        <p className="text-lg mb-4">
                            Even one typo signals carelessness to recruiters.
                        </p>
                        <p className="text-lg mb-6">
                            If you can't proofread a one-page document about yourself, how will you handle important work tasks?
                        </p>

                        <Card className="mb-6 border-l-4 border-l-red-500">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">Common Mistakes:</p>
                                <ul className="space-y-2">
                                    <li>• "Attention to detial" (yes, this really happens)</li>
                                    <li>• Inconsistent tenses (past job in present tense)</li>
                                    <li>• Wrong company names or dates</li>
                                    <li>• "Their" vs "there" vs "they're"</li>
                                    <li>• Missing punctuation or random capital letters</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">How to Fix It:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Read your resume out loud — you'll catch more errors</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Use Grammarly or similar tools (but don't rely on them 100%)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Have someone else review it — fresh eyes catch what you miss</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Check dates, company names, and job titles for accuracy</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Step away and proofread again the next day</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 4 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">4️⃣</span> Missing or Vague Metrics
                        </h2>

                        <p className="text-lg mb-6">
                            "Responsible for sales" tells recruiters nothing. "Increased sales by 35% in 6 months" proves impact.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">❌ Weak (No Metrics):</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Managed a team</li>
                                        <li>• Improved customer satisfaction</li>
                                        <li>• Handled multiple projects</li>
                                        <li>• Reduced costs</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">✅ Strong (With Metrics):</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Led team of 8 developers</li>
                                        <li>• Boosted NPS from 42 to 78 in 3 months</li>
                                        <li>• Delivered 12 projects on time, 95% success rate</li>
                                        <li>• Cut operational costs by $50K annually</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">How to Find Your Numbers:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>Team size:</strong> How many people did you work with or manage?</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>Time saved:</strong> Did you automate or streamline something?</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>Revenue impact:</strong> Sales, deals closed, budget managed</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>Growth:</strong> Percentage increases in any metric</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>Scale:</strong> Users served, projects delivered, issues resolved</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 5 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">5️⃣</span> Irrelevant Information
                        </h2>

                        <p className="text-lg mb-6">
                            Your high school honor roll from 2010? Your proficiency in Microsoft Word? These waste valuable space.
                        </p>

                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">What to Cut:</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Outdated skills</p>
                                            <p className="text-sm text-muted-foreground">Skills from jobs 10+ years ago that aren't relevant anymore</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Basic software skills</p>
                                            <p className="text-sm text-muted-foreground">Everyone knows Word and email in 2026</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Unrelated hobbies</p>
                                            <p className="text-sm text-muted-foreground">Unless they demonstrate relevant skills</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">High school education</p>
                                            <p className="text-sm text-muted-foreground">If you have a college degree</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Objective statement (usually)</p>
                                            <p className="text-sm text-muted-foreground">Use a professional summary instead</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">How to Fix It:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Ask: "Does this help me get THIS specific job?"</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Focus on the last 10-15 years of experience</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Prioritize technical skills over soft skills</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Remove filler content to make room for impactful achievements</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 6 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">6️⃣</span> Resume Too Long or Too Short
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">❌ Too Long (3+ pages)</p>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Recruiters spend 6-7 seconds per resume. They won't read 3 pages.
                                    </p>
                                    <p className="text-sm">
                                        <strong>Problem:</strong> You're not prioritizing. Everything seems equally important (which means nothing is).
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-orange-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">❌ Too Short (Half page)</p>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Looks like you don't have enough experience or skills.
                                    </p>
                                    <p className="text-sm">
                                        <strong>Problem:</strong> You're underselling yourself or not elaborating on achievements.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">Ideal Length:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>0-5 years experience:</strong> 1 page</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>5-15 years experience:</strong> 1-2 pages</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>15+ years experience:</strong> 2 pages (rarely 3 for academic/research roles)</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-sm text-muted-foreground">
                                    <strong>Pro tip:</strong> If you're on the fence, go shorter. Quality over quantity always wins.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 7 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">7️⃣</span> Poor Formatting and Structure
                        </h2>

                        <p className="text-lg mb-6">
                            A cluttered, hard-to-read resume gets rejected immediately — even if the content is good.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">❌ Poor Formatting:</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Multiple font styles and sizes</li>
                                        <li>• Inconsistent spacing</li>
                                        <li>• Centered text everywhere</li>
                                        <li>• Tiny margins, cramped text</li>
                                        <li>• Colorful backgrounds</li>
                                        <li>• Random bold/italic words</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">✅ Clean Formatting:</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• One professional font (max 2)</li>
                                        <li>• Consistent spacing throughout</li>
                                        <li>• Left-aligned text</li>
                                        <li>• Adequate white space</li>
                                        <li>• Simple black/white design</li>
                                        <li>• Strategic bolding for emphasis</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">Best Practices:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Use 10.5-12pt font size for body text</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>0.5-1 inch margins on all sides</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Clear section headings (larger or bold)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Bullet points for achievements (not paragraphs)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Consistent date formatting (e.g., "Jan 2024 - Present")</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 8 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">8️⃣</span> Overqualified or Underqualified
                        </h2>

                        <p className="text-lg mb-6">
                            Applying to every job you see is a waste of time. Strategic targeting gets results.
                        </p>

                        <Card className="mb-6 border-l-4 border-l-yellow-500">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-2">Remember the example from earlier:</p>
                                <p className="mb-3">If a job requires:</p>
                                <ul className="space-y-1 mb-3">
                                    <li>• 5+ years experience</li>
                                    <li>• Advanced cloud architecture</li>
                                </ul>
                                <p className="font-semibold">And you're a fresher — your resume won't pass.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">How to Fix It:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>If underqualified:</strong> Don't apply if you meet less than 60% of requirements</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>If slightly underqualified:</strong> Emphasize transferable skills and rapid learning ability</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>If overqualified:</strong> Downplay senior titles, focus on relevant skills for this role</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong>Strategic approach:</strong> Apply to roles where you meet 70-90% of requirements</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 9 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">9️⃣</span> Employment Gaps Not Explained
                        </h2>

                        <p className="text-lg mb-6">
                            A 6-month gap with no explanation makes recruiters assume the worst. Address it proactively.
                        </p>

                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">Common Gaps and How to Frame Them:</p>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium">🎓 Education/Upskilling</p>
                                        <p className="text-sm text-muted-foreground">"Completed advanced certification in AWS Solutions Architecture"</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">👶 Family Care</p>
                                        <p className="text-sm text-muted-foreground">"Family Care Leave (2023-2024) - Managed household operations and returned to workforce"</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">🏥 Health</p>
                                        <p className="text-sm text-muted-foreground">"Medical leave - Fully recovered and cleared to return to work"</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">💼 Freelance/Consulting</p>
                                        <p className="text-sm text-muted-foreground">List as a position: "Independent Consultant (2023-2024)"</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">How to Fix It:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Be honest but brief — no need for lengthy explanations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Use a functional or hybrid resume format to de-emphasize gaps</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Highlight any skills developed during the gap period</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Consider using years only (not months) to minimize visible gaps</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 10 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">🔟</span> Generic Objective or Summary
                        </h2>

                        <p className="text-lg mb-6">
                            "Seeking a challenging position to utilize my skills" tells recruiters absolutely nothing.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">❌ Generic Summary:</p>
                                    <p className="text-sm italic">
                                        "Hardworking professional seeking opportunities to grow and contribute to a dynamic team in a challenging environment."
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        (Could apply to any job, any field, any level)
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">✅ Strong Summary:</p>
                                    <p className="text-sm italic">
                                        "Senior DevOps Engineer with 8 years optimizing CI/CD pipelines for SaaS companies. Reduced deployment time by 60% at last role. Seeking to leverage AWS and Kubernetes expertise at a high-growth startup."
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        (Specific role, years, achievements, skills, target)
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">Formula for a Strong Summary:</p>
                                <div className="space-y-2 mb-4">
                                    <p className="flex items-start gap-2">
                                        <span className="font-semibold min-w-fit">1.</span>
                                        <span>Your title/profession + years of experience</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-semibold min-w-fit">2.</span>
                                        <span>Your specialization or key skills</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-semibold min-w-fit">3.</span>
                                        <span>One quantifiable achievement</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-semibold min-w-fit">4.</span>
                                        <span>What you're looking for (optional but recommended)</span>
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Keep it to 2-3 sentences maximum.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 11 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">1️⃣1️⃣</span> No Action Verbs or Weak Language
                        </h2>

                        <p className="text-lg mb-6">
                            Passive, weak language makes your accomplishments disappear. Strong action verbs make them pop.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <Card className="border-l-4 border-l-red-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">❌ Weak Language:</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Responsible for managing projects</li>
                                        <li>• Helped with customer issues</li>
                                        <li>• Was involved in team meetings</li>
                                        <li>• Worked on improving processes</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="pt-6">
                                    <p className="font-semibold mb-3">✅ Strong Action Verbs:</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• <strong>Led</strong> 12 cross-functional projects to completion</li>
                                        <li>• <strong>Resolved</strong> 500+ customer issues, 98% satisfaction rate</li>
                                        <li>• <strong>Facilitated</strong> weekly team standups for 8-person squad</li>
                                        <li>• <strong>Streamlined</strong> processes, cutting review time by 40%</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-3">Power Verbs by Category:</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-medium mb-2">Leadership:</p>
                                        <p className="text-sm">Led, Directed, Managed, Supervised, Coordinated, Mentored</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-2">Achievement:</p>
                                        <p className="text-sm">Achieved, Exceeded, Delivered, Completed, Accomplished</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-2">Improvement:</p>
                                        <p className="text-sm">Optimized, Streamlined, Enhanced, Improved, Reduced, Increased</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-2">Creation:</p>
                                        <p className="text-sm">Developed, Created, Designed, Built, Established, Launched</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-2">Analysis:</p>
                                        <p className="text-sm">Analyzed, Assessed, Evaluated, Identified, Investigated</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-2">Communication:</p>
                                        <p className="text-sm">Presented, Negotiated, Collaborated, Facilitated, Communicated</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Reason 12 - Existing Section */}
                    <section className="mb-12">

                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                            <span className="text-4xl">12️⃣</span> You're Competing With Better-Optimized Resumes
                        </h2>

                        <p className="text-lg mb-4">
                            Sometimes the issue isn't your skills.
                        </p>
                        <p className="text-lg mb-6">
                            It's presentation.
                        </p>

                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <p className="mb-4">Two candidates may have similar skills — but the one with:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                        <span>Better formatting</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                        <span>Clear metrics</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                        <span>Strong keywords</span>
                                    </li>
                                </ul>
                                <p className="mt-4 font-semibold">Will get the call.</p>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6">
                            What Recruiters Actually Look For
                        </h2>

                        <p className="text-lg mb-6">Let's simplify it.</p>

                        <p className="mb-4">Recruiters scan for:</p>

                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Relevant skills</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Skills that match the job description
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Relevant experience</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Experience in similar roles or projects
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Measurable results</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Numbers, percentages, and concrete achievements
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Clear formatting</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Easy to scan and well-organized
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Role alignment</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Clear fit for the position
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="pt-6">
                                <p className="text-lg">
                                    <strong>If they don't find this within 10 seconds, they move on.</strong>
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6">
                            Quick Self-Check Before You Apply
                        </h2>

                        <p className="text-lg mb-6">Ask yourself:</p>

                        <div className="space-y-4">
                            <Card className="hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                Does my resume match this job description?
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Your resume should be tailored to each specific role
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                Did I use keywords from the posting?
                                            </h3>
                                            <p className="text-muted-foreground">
                                                ATS systems scan for specific keywords from job descriptions
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                Did I quantify achievements?
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Numbers make your accomplishments concrete and impressive
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                Is formatting clean and simple?
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Complex designs can confuse ATS and make your resume hard to scan
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                Is everything relevant?
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Remove outdated or unrelated information that doesn't support your application
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="mt-6 bg-yellow-50 border-yellow-200">
                            <CardContent className="pt-6">
                                <p className="text-lg">
                                    <strong>If answer is "no" to even two of these — improve it first.</strong>
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-6">
                            Final Advice
                        </h2>

                        <Card className="border-l-4 border-l-green-500 mb-6">
                            <CardContent className="pt-6">
                                <p className="text-xl mb-4">
                                    Getting rejected does not always mean you are not good enough.
                                </p>
                                <p className="text-lg">Most resume rejections happen because of:</p>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 mb-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg">Poor optimization</h3>
                                            <p className="text-muted-foreground">
                                                Resume not optimized for ATS or the specific role
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg">Generic writing</h3>
                                            <p className="text-muted-foreground">
                                                Using the same resume for every application without customization
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg">Lack of clarity</h3>
                                            <p className="text-muted-foreground">
                                                Vague descriptions without specific achievements or metrics
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-green-50 border-green-200 mb-6">
                            <CardContent className="pt-6">
                                <p className="text-lg mb-2">
                                    <strong className="text-green-800">The good news?</strong>
                                </p>
                                <p className="text-lg">
                                    These are all fixable.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary">
                            <CardContent className="pt-6">
                                <p className="text-xl font-semibold text-primary mb-2">
                                    A strong resume is not about being extraordinary —
                                </p>
                                <p className="text-xl">
                                    it's about being clear, relevant, and specific.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* CTA Section */}
                    <section className="mt-12">
                        <Card className="bg-primary text-primary-foreground">
                            <CardContent className="pt-8 pb-8 text-center">
                                <h2 className="text-2xl font-bold mb-4">
                                    Ready to Fix Your Resume?
                                </h2>
                                <p className="text-lg mb-6 opacity-90">
                                    Create an ATS-optimized resume that gets you interviews
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                                >
                                    Create Your Resume Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </CardContent>
                        </Card>
                    </section>
                </article>

                {/* Related Articles */}
                <section className="mt-12 pt-12 border-t">
                    <h2 className="text-2xl font-bold text-primary mb-6">Related Articles</h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Link href="/blog/ats-resume-guide" className="group">
                            <Card className="h-full hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6">
                                    <Badge className="bg-green-100 text-green-700 mb-3">ATS Tips</Badge>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                        ATS Resume Guide 2026
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Learn how to create an ATS-optimized resume with real examples
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/blog/resume-for-freshers" className="group">
                            <Card className="h-full hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6">
                                    <Badge className="bg-blue-100 text-blue-700 mb-3">Resume Writing</Badge>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                        Resume for Freshers: Complete Guide
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Create your first job-winning resume with step-by-step guidance
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Detail;
