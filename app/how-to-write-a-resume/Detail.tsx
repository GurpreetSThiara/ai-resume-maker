

'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, BookOpen, ArrowRightCircle } from 'lucide-react'

export default function Detail() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-6 text-balance">Introduction</h1>
          <div className="space-y-4 text-lg leading-relaxed text-foreground">
            <p>
              In 2026, resumes matters a lot — they must be ATS-optimized and easy readable to human. This Page explains step by step how to create a resume that gets noticed by hiring managers and passes automated screening systems or ATS.
            </p>
            <p>
              Whether you're a fresher, experienced , or switching careers, this page will help you craft a resume that improves your chances to land interviews.
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">1. What Is a Resume and Why It Matters</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              A resume is a one page summary of your skills, experience, education and achievements used to apply for jobs. Recruiters often spend 6–8 seconds on an initial scan, so your resume must be clear and keyword rich.
            </p>
            <p>
              In 99% companies, your resume is first scanned by an Applicant Tracking System (ATS), which filters resumes by keywords and formatting before a human ever sees them.
            </p>
          </div>
        </section>

        {/* Section 2 - Table */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">2. Key Resume Sections Everyone Needs</h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/10 border-b-2 border-primary">
                  <th className="px-4 py-3 text-left font-semibold text-primary">Section</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">What It Shows</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">Why It Matters</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">Contact Info</td>
                  <td className="px-4 py-3">Your name, phone, email</td>
                  <td className="px-4 py-3">Recruiter must contact you easily</td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">Professional Summary</td>
                  <td className="px-4 py-3">Your value in 2–3 lines</td>
                  <td className="px-4 py-3">Quick impression for recruiters</td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">Experience</td>
                  <td className="px-4 py-3">Roles, achievements</td>
                  <td className="px-4 py-3">Shows what you've actually done</td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">Skills</td>
                  <td className="px-4 py-3">Tools, languages, soft skills</td>
                  <td className="px-4 py-3">Matches job requirements</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">Education</td>
                  <td className="px-4 py-3">Degrees, certifications</td>
                  <td className="px-4 py-3">Validates credentials</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-foreground">
            Use simple bullet points under experience as we have in createfreecv to show achievements instead of icons.
          </p>
        </section>

        {/* Section 3 - ATS Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">3. How to Make a Resume Friendly to ATS systems</h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Use simple headings</h3>
                <p className="text-foreground">
                  Avoid fancy and complex looking fonts, icons, images and graphics — ATS can't read them. in createfreecv we are using helvetica which is is a clean and a sans-serif font
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Include job keywords</h3>
                <p className="text-foreground">
                  Carefully Read the job description and use the same terms and technical keywords in your resume. Example: If the job mentions "associate software engineer, backend developer, SEO expert", include those exact words where applicable.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Save as PDF or DOCX</h3>
                <p className="text-foreground">
                  Most ATS systems read these formats best. it should not be a image eg jpg, png etc
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 - Mistakes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">4. Common Resume Mistakes which you should never do</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex gap-4 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-foreground">Using unclear or fuzzy goals ("Looking for a job where I can grow")</p>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border border-primary/30 bg-primary/5">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">Replace with actual outcomes ("Increased sales by 30% within 6 months")</p>
            </div>
          </div>

          {/* Developer Examples */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-foreground mb-6">👨‍💻 Developer Resume Examples</h3>
            <div className="space-y-4">
              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Using unclear or fuzzy goals</p>
                    <p className="text-foreground">"Looking for a challenging developer role to enhance my skills."</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Replace with measurable outcomes</p>
                    <p className="text-foreground">"Built and deployed 3 production-ready web applications using React and Node.js, serving over 10,000 monthly users."</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Worked on frontend and backend development."</p>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Developed REST APIs and responsive UI components, reducing page load time by 35%."</p>
                </div>
              </div>

              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Good knowledge of JavaScript."</p>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Implemented complex business logic using JavaScript and TypeScript across 5+ projects."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Marketer Examples */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-foreground mb-6">📈 Marketer Resume Examples</h3>
            <div className="space-y-4">
              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Using unclear or fuzzy goals</p>
                    <p className="text-foreground">"Seeking a marketing role to grow brand awareness."</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Replace with actual outcomes</p>
                    <p className="text-foreground">"Increased organic website traffic by 42% in 4 months through SEO optimization and content strategy."</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Handled social media marketing."</p>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Managed Instagram and LinkedIn campaigns, generating 1.2M impressions and 18% engagement rate."</p>
                </div>
              </div>

              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Worked on email marketing."</p>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Executed email campaigns with an average open rate of 32% and CTR of 6.4%."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Examples */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-foreground mb-6">🎓 Student / Fresher Resume Examples</h3>
            <div className="space-y-4">
              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Using unclear or fuzzy goals</p>
                    <p className="text-foreground">"Looking for an opportunity to learn and grow in a professional environment."</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Replace with skills + action</p>
                    <p className="text-foreground">"Completed hands-on projects in Python and SQL, including a data analysis project using real-world datasets."</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Participated in college activities."</p>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Led a team of 6 students to organize a technical event attended by 300+ participants."</p>
                </div>
              </div>

              <div>
                <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Basic knowledge of computer applications."</p>
                </div>
                <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">"Proficient in MS Excel, PowerPoint, and Google Docs for academic and project work."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Mistakes */}
          <div className="space-y-3">
            <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-foreground">Lengthy paragraphs</p>
            </div>
            <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">Use bullet points</p>
            </div>
            <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-foreground">Too many templates with graphics</p>
            </div>
            <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">Stick to clean, simple layouts</p>
            </div>
          </div>
        </section>

        {/* Section 5 - Strong Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">5. Examples of Strong Resume Statements</h2>
          <div className="space-y-4">
            <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <span className="font-semibold text-destructive flex-shrink-0">Weak:</span>
              <p className="text-foreground">"Responsible for managing team tasks."</p>
            </div>
            <div className="flex gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
              <span className="font-semibold text-primary flex-shrink-0">Strong:</span>
              <p className="text-foreground">"Supervised cross-functional team of 8 and improved on-time delivery rate from 72% to 89%."</p>
            </div>
          </div>
        </section>

        {/* Section 6 - How CreateFreeCV Helps */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">6. How CreateFreeCV Helps</h2>
          <div className="space-y-3 mb-6">
            {[
              'Choose ATS optimized templates instead of facny and confusing designs',
              'See live preview while editing or creating resume',
              'Download professional resume PDF instantly without any credit cards , payments or login',
              'No sign-up or hidden fees as already mentioned',
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 p-4 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-lg font-semibold text-foreground mb-2">Start building your resume now — it's fast and free!</p>
        </section>

        {/* Conclusion */}
        <section className="p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
          <h2 className="text-3xl font-bold text-primary mb-4">Conclusion</h2>
          <p className="text-foreground leading-relaxed">
            A great resume does not mean 100% guarantee of job — but it helps to increases your chances to get selected.Focus on clarity, keywords, and impact. Use this guide alongside CreateFreeCV's builder to create a resume that stands out to recruiters and ATS.
          </p>
        </section>
        {/* CTA Button - Enhanced UI with Next.js Link */}
        <div className="mt-12 flex justify-center">
          <Link href="/free-ats-resume-templates" passHref legacyBehavior>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:scale-105 hover:from-blue-600 hover:to-primary transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/40 animate-pulse"
              aria-label="Create Your Resume Now"
            >
              <span className="drop-shadow-lg">Create Your Resume Now</span>
              <ArrowRightCircle className="w-7 h-7 text-white group-hover:translate-x-1 transition-transform duration-200" />
              <span className="absolute -top-4 right-0 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-bounce">Free</span>
            </a>
          </Link>
        </div>
      </div>
    </main>
  )
}

