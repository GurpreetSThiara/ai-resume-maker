'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, BookOpen, ArrowRightCircle } from 'lucide-react'

export default function Detail() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-6 text-balance">
            Resume for Freshers: Complete Guide to Create Your First Job-Winning Resume (2026)
          </h1>
          <div className="space-y-4 text-lg leading-relaxed text-foreground">
            <p>
              Creating a resume as a fresher is often confusing. You may feel stuck because you don't have years of work experience, big job titles, or corporate achievements. But here's the truth:
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span>👉</span>
              <span>Recruiters do not expect freshers to have experience.</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span>👉</span>
              <span>They expect clarity, potential, and relevance.</span>
            </div>
            <p>
              This guide will walk you step-by-step through how freshers should create a resume in 2026, what recruiters actually look for, what to avoid, and how to build an ATS-friendly resume that gets interview calls.
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">1. What Is a Fresher Resume?</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              A fresher resume is a one-page professional document that highlights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your education</li>
              <li>Your skills</li>
              <li>Your projects or internships</li>
              <li>Your potential to perform in a job role</li>
            </ul>
            <p>
              Unlike experienced professionals, freshers focus less on work history and more on skills, learning, and practical exposure.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
              <p className="font-semibold">
                A good fresher resume answers one simple recruiter question:
              </p>
              <p className="text-lg mt-2">
                "Can this candidate learn fast and contribute to the team?"
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">2. What Recruiters Expect From Freshers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">✅ They DO expect:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clear job role intention</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Relevant technical or functional skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Academic or personal projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Good communication and structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Honest and realistic information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clean layout</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Correct keywords</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Easy readability</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">❌ They do NOT expect:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>5 years of experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Fancy design</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Long resumes</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">3. Best Resume Format for Freshers</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              The reverse-chronological format works best for freshers.
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Recommended Resume Order:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact Information</li>
                <li>Professional Summary</li>
                <li>Skills</li>
                <li>Education</li>
                <li>Projects / Internships</li>
                <li>Certifications (optional)</li>
              </ol>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
              <p className="font-semibold">
                📌 Keep your resume one page only.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">4. Contact Information (Simple but Important)</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Include only:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Professional Email</li>
              <li>City, Country</li>
              <li>LinkedIn or GitHub (if relevant)</li>
            </ul>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-700 mb-2">❌ Bad Example</h3>
                <p className="text-red-600">cooldude2002@gmail.com</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-700 mb-2">✅ Good Example</h3>
                <p className="text-green-600">firstname.lastname@gmail.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">5. Professional Summary for Freshers</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              This is the first section recruiters read.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-700 mb-2">❌ Weak Summary</h3>
                <p className="text-red-600">"Looking for an opportunity where I can grow and learn."</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-700 mb-2">✅ Strong Summary</h3>
                <p className="text-green-600">"Recent Computer Science graduate with hands-on experience in React and JavaScript through academic projects. Strong problem-solving skills and interest in frontend development."</p>
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
              <p className="font-semibold mb-2">
                📌 Keep it 2–3 lines, focused on:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Who you are</li>
                <li>What skills you have</li>
                <li>What role you want</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">6. Skills Section: What Freshers Should Include</h2>
          <div className="space-y-6 text-foreground leading-relaxed">
            <p>
              Only include job-relevant skills.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Example – Software Fresher</h3>
                <ul className="space-y-1">
                  <li>• JavaScript</li>
                  <li>• HTML, CSS</li>
                  <li>• React</li>
                  <li>• Git</li>
                  <li>• Basic SQL</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Example – Marketing Fresher</h3>
                <ul className="space-y-1">
                  <li>• SEO fundamentals</li>
                  <li>• Social media marketing</li>
                  <li>• Content writing</li>
                  <li>• Google Analytics (basic)</li>
                </ul>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-700 mb-2">❌ Avoid generic skills like:</h3>
              <ul className="text-red-600 space-y-1">
                <li>• Hardworking</li>
                <li>• Honest</li>
                <li>• Punctual</li>
              </ul>
              <p className="text-sm text-red-600 mt-2">Recruiters assume these by default.</p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">7. Education Section (Do It Right)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-700 mb-2">❌ Weak Education Entry</h3>
              <p className="text-red-600">"Completed B.Tech from XYZ College."</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">✅ Strong Education Entry</h3>
              <p className="text-green-600">"B.Tech in Computer Science, XYZ College (2022–2026), CGPA: 8.4"</p>
            </div>
          </div>
          <p className="mt-4 text-foreground">
            If CGPA is good, include it. If not, you may skip it.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">8. Projects Section (MOST IMPORTANT for Freshers)</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Projects often matter more than internships.
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-4">How to Write a Project Entry</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Project Name</li>
                <li>What you built</li>
                <li>Technologies used</li>
                <li>What problem it solved</li>
              </ul>
            </div>
            <div className="bg-primary/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Example:</h3>
              <div className="space-y-2">
                <p className="font-medium">Resume Builder Web Application</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Built a responsive resume builder using React and Tailwind CSS</li>
                  <li>Implemented PDF download functionality</li>
                  <li>Designed layouts to be ATS-friendly</li>
                </ul>
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
              <p className="font-semibold">
                📌 Always explain what you did, not just the project title.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">9. Internships (If You Have Any)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-700 mb-2">❌ Weak Entry</h3>
              <p className="text-red-600">"Did internship at a company."</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">✅ Strong Entry</h3>
              <p className="text-green-600">"Completed a 3-month internship assisting the frontend team with UI components and bug fixing."</p>
            </div>
          </div>
          <p className="mt-4 text-foreground">
            Even short internships matter if written clearly.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">10. ATS-Friendly Resume Tips for Freshers</h2>
          <div className="space-y-4">
            <p className="text-foreground">
              Many companies use Applicant Tracking Systems (ATS) even for entry-level roles.
            </p>
            <p className="text-foreground">
              To stay ATS-friendly:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use simple fonts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Avoid icons and graphics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use standard headings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Match keywords from job description</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Save resume as PDF</span>
              </li>
            </ul>
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
              <p className="font-semibold">
                Fancy designs often fail ATS screening.
              </p>
            </div>
          </div>
        </section>

        {/* Section 11 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">11. Common Fresher Resume Mistakes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Writing vague objectives</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Using fancy templates</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Including irrelevant hobbies</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Long paragraphs</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Grammar mistakes</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>More than one page</span>
              </div>
            </div>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mt-6">
            <p className="font-semibold">
              A clean resume beats a beautiful one.
            </p>
          </div>
        </section>

        {/* Section 12 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">12. Fresher Resume Examples: ❌ vs ✅ (25+ Examples)</h2>
          <div className="space-y-6">
            {[
              { title: "Objective", bad: "Looking for growth opportunities", good: "Seeking entry-level frontend developer role" },
              { title: "Summary", bad: "Highly motivated individual", good: "Recent graduate with React and JavaScript experience" },
              { title: "Skills", bad: "MS Word, Internet", good: "HTML, CSS, JavaScript" },
              { title: "Projects", bad: "College project on web development", good: "Built resume builder with PDF export" },
              { title: "Impact", bad: "Project was successful", good: "Enabled users to create resumes in under 5 minutes" },
              { title: "Internship", bad: "Worked in company", good: "Assisted team in UI development" },
              { title: "Certifications", bad: "Online courses completed", good: "JavaScript Fundamentals – Coursera" },
              { title: "Languages", bad: "English, Hindi", good: "English (Professional), Hindi (Native)" },
              { title: "Hobbies", bad: "Watching movies", good: "Building side projects" },
              { title: "Tools", bad: "Used many tools", good: "VS Code, Git, GitHub" },
              { title: "Email", bad: "hero123@gmail.com", good: "firstname.lastname@gmail.com" },
              { title: "Length", bad: "2–3 pages", good: "1 page" },
              { title: "Formatting", bad: "Icons & graphics", good: "Text-based layout" },
              { title: "Fonts", bad: "Multiple fonts", good: "One professional font" },
              { title: "Achievements", bad: "Participated in events", good: "2nd position in coding contest" },
              { title: "Portfolio", bad: "GitHub available", good: "GitHub with 5+ projects" },
              { title: "Final Year Project", bad: "Project on AI", good: "AI chatbot using Python & NLP" },
              { title: "Grammar", bad: "I have learn skills", good: "I have learned skills" },
              { title: "Role Clarity", bad: "Open to any role", good: "Applying for frontend role" },
              { title: "File Name", bad: "resume_final_v2.pdf", good: "FirstName_LastName_Resume.pdf" },
              { title: "Keywords", bad: "No job keywords", good: "Matches job description keywords" },
              { title: "Action Verbs", bad: "Worked on project", good: "Developed and tested application" },
              { title: "Confidence", bad: "Basic knowledge", good: "Strong foundation" },
              { title: "Soft Skills", bad: "Good personality", good: "Teamwork through group projects" },
              { title: "Honesty", bad: "Exaggerated skills", good: "Real, verifiable skills" }
            ].map((example, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-3">{index + 1}. {example.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <span className="text-red-600 font-medium">❌</span> {example.bad}
                  </div>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <span className="text-green-600 font-medium">✅</span> {example.good}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 13 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">13. Should Freshers Add Hobbies?</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Only if:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>They are relevant</li>
              <li>They show skills (sports, leadership, coding)</li>
            </ul>
            <p>
              Otherwise, skip them.
            </p>
          </div>
        </section>

        {/* Section 14 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">14. How CreateFreeCV Helps Freshers</h2>
          <div className="space-y-4">
            <p className="text-foreground">
              With CreateFreeCV, freshers can:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Choose ATS-optimized templates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Edit resume easily</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Preview changes live</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Download professional PDF</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>No signup required</span>
              </li>
            </ul>
            <div className="bg-primary/10 p-6 rounded-lg text-center">
              <p className="font-semibold text-lg mb-4">
                👉 Start building your fresher resume today with confidence.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Your Free Resume Now
                <ArrowRightCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Conclusion</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Freshers don't get rejected because they lack experience.
            </p>
            <p>
              They get rejected because their resumes are unclear, generic, or poorly structured.
            </p>
            <div className="bg-primary/10 p-6 rounded-lg">
              <p className="font-semibold mb-4">Focus on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clarity</li>
                <li>Skills</li>
                <li>Projects</li>
                <li>ATS compatibility</li>
              </ul>
            </div>
            <p className="text-lg font-medium">
              A well-written fresher resume can open doors to interviews — even for your first job.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
