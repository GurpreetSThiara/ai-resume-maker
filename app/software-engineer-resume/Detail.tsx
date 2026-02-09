import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, ArrowRight, CheckCircle, XCircle, Lightbulb, Target, Zap } from 'lucide-react'
import Link from 'next/link'

const Detail = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700">Resume Writing</Badge>
          <h1 className="text-4xl font-bold text-primary mb-6 text-balance">
            Resume for Software Engineers: How to Create a Technical Resume That Gets Interviews in 2026
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>CreateFreeCV Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>February 9, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>12 min read</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Software engineers often believe that strong coding skills alone are enough to get hired. In reality, many good engineers get rejected simply because their resume fails to communicate their skills clearly.
          </p>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                In 2026, most companies receive hundreds of applications for a single software engineering role. Recruiters rely heavily on Applicant Tracking Systems (ATS) and quick resume scans to shortlist candidates. If your resume is unclear, generic, or poorly structured, it may never reach a technical interviewer — no matter how skilled you are.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This guide explains how software engineers should write their resume, what recruiters actually look for, how to present projects and experience correctly, and how to create an ATS-friendly resume that leads to interviews.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What Recruiters Look For */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">1. What Recruiters Look for in a Software Engineer Resume</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Recruiters hiring software engineers focus on evidence, not claims. They want to quickly understand:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">What technologies you have actually used</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">What kind of problems you have solved</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">What impact your work created</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Whether your skills match the job description</span>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-800 mb-2">They do not want:</p>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Long paragraphs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Buzzwords without proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Fancy designs that hide content</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  A good software engineer resume answers this question clearly: "Can this candidate build, maintain, or improve software systems in our team?"
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Best Resume Format */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">2. Best Resume Format for Software Engineers</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                The reverse-chronological format is the safest and most effective choice.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-primary mb-4">Recommended Resume Structure:</h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Contact Information</li>
                  <li>2. Professional Summary</li>
                  <li>3. Technical Skills</li>
                  <li>4. Work Experience</li>
                  <li>5. Projects</li>
                  <li>6. Education</li>
                  <li>7. Certifications (optional)</li>
                </ol>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Keep your resume one page if you have less than 5 years of experience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Two pages are acceptable only for senior engineers.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Professional Summary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">3. Writing a Strong Professional Summary (With Examples)</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Your summary should be short, technical, and specific.
              </p>
              <div className="space-y-6">
                <div className="border border-red-200 rounded-lg p-4">
                  <Badge className="mb-2 bg-red-100 text-red-700">❌ Weak Summary</Badge>
                  <p className="text-muted-foreground italic">"Passionate software engineer looking for a challenging role."</p>
                </div>
                <div className="border border-green-200 rounded-lg p-4">
                  <Badge className="mb-2 bg-green-100 text-green-700">✅ Strong Summary</Badge>
                  <p className="text-muted-foreground">"Software engineer with 3 years of experience in building scalable web applications using React, Node.js, and PostgreSQL. Experienced in REST APIs, performance optimization, and production deployments."</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Avoid words like passionate, hardworking, dynamic.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Focus on experience + skills + domain.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Technical Skills Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">4. Technical Skills Section: How to Do It Right</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Recruiters scan this section very quickly.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-primary mb-4">Best Way to Organize Skills:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                  <div><strong>Languages:</strong> JavaScript, TypeScript, Python</div>
                  <div><strong>Frameworks:</strong> React, Next.js, Express</div>
                  <div><strong>Databases:</strong> PostgreSQL, MongoDB</div>
                  <div><strong>Tools:</strong> Git, Docker, AWS</div>
                  <div><strong>Concepts:</strong> REST APIs, Authentication, Caching</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Avoid rating skills (e.g., "JavaScript – 9/10").</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Avoid listing technologies you've never used in real projects.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Work Experience */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">5. Work Experience: What Matters Most</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                This is the most important section for experienced engineers.
              </p>
              <div className="space-y-6">
                <div>
                  <div className="border border-red-200 rounded-lg p-4 mb-4">
                    <Badge className="mb-2 bg-red-100 text-red-700">❌ Weak Experience Bullet</Badge>
                    <p className="text-muted-foreground italic">"Worked on backend development."</p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <Badge className="mb-2 bg-green-100 text-green-700">✅ Strong Experience Bullet</Badge>
                    <p className="text-muted-foreground">"Developed REST APIs using Node.js and Express, handling over 50,000 monthly requests with optimized query performance."</p>
                  </div>
                </div>
                <div>
                  <div className="border border-red-200 rounded-lg p-4 mb-4">
                    <Badge className="mb-2 bg-red-100 text-red-700">❌ Another Weak Example</Badge>
                    <p className="text-muted-foreground italic">"Responsible for frontend development."</p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <Badge className="mb-2 bg-green-100 text-green-700">✅ Improved Version</Badge>
                    <p className="text-muted-foreground">"Built reusable React components and reduced page load time by 30% through performance optimizations."</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="font-semibold text-primary mb-3">📌 Use action verbs like:</p>
                <div className="flex flex-wrap gap-2">
                  {['Developed', 'Implemented', 'Optimized', 'Designed', 'Automated'].map((verb) => (
                    <Badge key={verb} variant="secondary">{verb}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">6. Projects Section (Very Important for Engineers)</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Projects show real-world problem solving, especially for:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="font-medium text-blue-800">Freshers</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="font-medium text-blue-800">Career switchers</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="font-medium text-blue-800">Developers with limited work experience</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-primary mb-4">How to Write a Project Entry</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Project Name</li>
                  <li>• What the project does</li>
                  <li>• Technologies used</li>
                  <li>• Your contribution</li>
                  <li>• Outcome or result</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-primary mb-2">Example:</p>
                <p className="text-muted-foreground">
                  <strong>Resume Builder Web Application</strong><br />
                  Built a resume builder using React and Tailwind CSS<br />
                  Implemented PDF generation and live preview<br />
                  Designed layouts optimized for ATS readability
                </p>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  📌 Avoid just listing GitHub links without explanation.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ATS Optimization */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">7. ATS Optimization for Software Engineer Resumes</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Many tech companies still use ATS to filter resumes.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-primary mb-4">To pass ATS screening:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use simple fonts (Arial, Helvetica, Calibri)</li>
                  <li>• Avoid icons, images, and charts</li>
                  <li>• Use standard section headings</li>
                  <li>• Include keywords from the job description</li>
                  <li>• Save resume as PDF or DOCX</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800">
                  ATS systems may reject resumes that look beautiful but are unreadable.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">8. Common Software Engineer Resume Mistakes</h2>
          <Card>
            <CardContent className="p-8">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Writing vague experience descriptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Listing too many technologies</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Using generic summaries</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Ignoring ATS compatibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Including outdated or irrelevant skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Making the resume longer than necessary</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  A focused resume performs better than an overloaded one.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Resume Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">9. ❌ vs ✅ Software Engineer Resume Examples</h2>
          <div className="grid gap-6">
            {[
              {
                title: "Experience",
                bad: '"Worked on APIs"',
                good: '"Developed REST APIs with authentication and role-based access control"'
              },
              {
                title: "Skills",
                bad: '"JavaScript, Python, many frameworks"',
                good: '"JavaScript (ES6+), Python, React, Node.js"'
              },
              {
                title: "Projects",
                bad: '"College project on web app"',
                good: '"Built task management app with React and Firebase"'
              },
              {
                title: "Impact",
                bad: '"Improved performance"',
                good: '"Reduced API response time by 40%"'
              },
              {
                title: "Summary",
                bad: '"Looking for a challenging role"',
                good: '"Backend engineer with experience in scalable APIs"'
              }
            ].map((example, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-4">{index + 1}. {example.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-red-200 rounded-lg p-4">
                      <Badge className="mb-2 bg-red-100 text-red-700">❌</Badge>
                      <p className="text-muted-foreground italic">{example.bad}</p>
                    </div>
                    <div className="border border-green-200 rounded-lg p-4">
                      <Badge className="mb-2 bg-green-100 text-green-700">✅</Badge>
                      <p className="text-muted-foreground">{example.good}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* More Examples */}
        <section className="mb-12">
          <div className="grid gap-6">
            {[
              {
                title: "Tools",
                bad: '"Used many tools"',
                good: '"Git, Docker, AWS EC2"'
              },
              {
                title: "Keywords",
                bad: 'Missing job keywords',
                good: 'Matches skills listed in job description'
              },
              {
                title: "Formatting",
                bad: 'Icons and graphics',
                good: 'Clean, text-based layout'
              },
              {
                title: "Clarity",
                bad: '"Handled tasks"',
                good: '"Implemented authentication and authorization flow"'
              },
              {
                title: "Confidence",
                bad: '"Basic knowledge of Node.js"',
                good: '"Hands-on experience building Node.js APIs"'
              }
            ].map((example, index) => (
              <Card key={index + 5}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-4">{index + 6}. {example.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-red-200 rounded-lg p-4">
                      <Badge className="mb-2 bg-red-100 text-red-700">❌</Badge>
                      <p className="text-muted-foreground italic">{example.bad}</p>
                    </div>
                    <div className="border border-green-200 rounded-lg p-4">
                      <Badge className="mb-2 bg-green-100 text-green-700">✅</Badge>
                      <p className="text-muted-foreground">{example.good}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">10. Education Section for Software Engineers</h2>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="border border-red-200 rounded-lg p-4">
                  <Badge className="mb-2 bg-red-100 text-red-700">❌ Weak Entry</Badge>
                  <p className="text-muted-foreground italic">"Completed B.Tech from XYZ College."</p>
                </div>
                <div className="border border-green-200 rounded-lg p-4">
                  <Badge className="mb-2 bg-green-100 text-green-700">✅ Strong Entry</Badge>
                  <p className="text-muted-foreground">"B.Tech in Computer Science, XYZ College (2019–2023)"</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  If you are experienced, keep education short and move it lower.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">11. Should Software Engineers Add Certifications?</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Certifications are helpful only if relevant.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="font-semibold text-green-800 mb-3">Good examples:</p>
                <ul className="space-y-2 text-green-700">
                  <li>• AWS Certified Cloud Practitioner</li>
                  <li>• Google Data Analytics</li>
                  <li>• Meta Frontend Certification</li>
                </ul>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Avoid adding unrelated certificates.</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final Checks */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">12. File Name and Final Checks</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Before submitting your resume:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Name it clearly: FirstName_LastName_Software_Engineer_Resume.pdf</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Check spelling and grammar</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Ensure consistency in formatting</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Match keywords with job description</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  Small details matter.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CreateFreeCV Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">13. How CreateFreeCV Helps Software Engineers</h2>
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                With CreateFreeCV, software engineers can:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Choose ATS-optimized resume templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Edit and preview resumes live</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Highlight technical skills clearly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Download professional PDF instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Build resumes without signup</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  This saves time while ensuring your resume meets recruiter expectations.
                </p>
              </div>
              <div className="mt-6 text-center">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Create Your Software Engineer Resume
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Conclusion</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                A strong software engineer resume is not about listing every technology you know. It's about showing what you've built, how you built it, and why it mattered.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="font-semibold text-primary mb-4">Focus on:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Clear structure</li>
                  <li>• Relevant skills</li>
                  <li>• Measurable impact</li>
                  <li>• ATS compatibility</li>
                </ul>
              </div>
              <p className="text-muted-foreground mt-6 font-medium">
                With the right resume, your skills will finally get the attention they deserve.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Related Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                <Badge className="mb-3 bg-blue-100 text-blue-700">Resume Writing</Badge>
                <h3 className="text-lg font-bold text-primary mb-3">
                  Resume for Freshers: Complete Guide to Create Your First Job-Winning Resume (2026)
                </h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to create a professional fresher resume with our step-by-step guide. Includes 25+ examples, ATS-friendly tips, and real resume samples.
                </p>
                <Link 
                  href="/blog/resume-for-freshers"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                <Badge className="mb-3 bg-green-100 text-green-700">ATS Tips</Badge>
                <h3 className="text-lg font-bold text-primary mb-3">
                  ATS Resume Guide 2026 – How to Create a Resume That Gets Interviews
                </h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to create an ATS-optimized resume in 2026 with real examples for developers, marketers, students, and freshers.
                </p>
                <Link 
                  href="/blog/ats-resume-guide"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Detail
