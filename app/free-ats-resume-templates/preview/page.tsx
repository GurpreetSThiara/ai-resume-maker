"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ResumePreview from "@/components/resume-preview"
import { availableTemplates, getTemplateById } from "@/lib/templates"
import { RESUME_TEMPLATES } from "@/constants/resumeConstants"
import Image from "next/image"
import DownloadDropDown from "@/components/global/DropDown/DropDown"
import Link from "next/link"
import { devopsResumeData1 } from "@/lib/examples/resume/deveops"
import { CREATE_RESUME } from "@/config/urls"
import Head from "next/head"


function PreviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tplId = (searchParams.get("template") || "classic").toString()

  const template = useMemo(() => {
    const normalized = tplId.replace(/_/g, "-").toLowerCase()
    const byGet = getTemplateById(normalized)
    if (byGet) return byGet
    if (normalized === "classic") return getTemplateById("ats-classic") || availableTemplates[0]
    return availableTemplates.find((t) => t.id === normalized || t.id.includes(normalized)) || availableTemplates[0]
  }, [tplId])

  const sampleData = devopsResumeData1
  const templateMeta = RESUME_TEMPLATES.find((r) => r.id === template.id) || (template as any)

  // SEO-optimized content for ATS Classic template
  const isATSClassic = template.id === "ats-classic"

  return (
    <>
      <Head>
        <title>Free ATS Classic Resume Template 2025 | Download PDF | CreateFreeCV</title>
        <meta name="description" content="Create a professional ATS-friendly resume with our classic template. Single-column layout perfect for engineering, finance, and operations roles. Download free as PDF." />
        <meta name="keywords" content="free ats resume template, ats friendly resume download, classic resume format pdf, engineering resume template free, single column resume builder, professional resume template 2025" />
        
        {/* Open Graph */}
        <meta property="og:title" content="ATS Classic Resume Template - Free Download | CreateFreeCV" />
        <meta property="og:description" content="Professional ATS-optimized resume template with single-column layout. Perfect for engineering, finance, and operations roles. Free PDF download." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://createfreecv.com/free-ats-resume-templates/preview?template=ats-classic" />
        <meta property="og:image" content="https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/classic.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free ATS Classic Resume Template | CreateFreeCV" />
        <meta name="twitter:description" content="Professional ATS-friendly resume template with single-column layout. Free download for engineering, finance, and operations roles." />
        <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/classic.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "ATS Classic Resume Template - Free Download",
            "description": "Professional ATS-friendly resume template with single-column layout perfect for engineering, finance, and operations roles.",
            "url": "https://createfreecv.com/free-ats-resume-templates/preview?template=ats-classic",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "ATS Classic Resume Template",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free ATS-optimized resume template with single-column layout designed for maximum compatibility with applicant tracking systems."
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://createfreecv.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Resume Templates",
                  "item": "https://createfreecv.com/free-ats-resume-templates"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "ATS Classic Template Preview",
                  "item": "https://createfreecv.com/free-ats-resume-templates/preview?template=ats-classic"
                }
              ]
            }
          })}
        </script>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/free-ats-resume-templates" className="hover:text-blue-600">Resume Templates</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">ATS Classic Template Preview</li>
            </ol>
          </div>
        </nav>

        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* SEO-Optimized Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => router.back()} className="px-3 py-2 rounded-md bg-white border hover:bg-gray-50 transition-colors">← Back</button>
                  <h1 className="text-3xl font-bold text-gray-900">ATS Classic Resume Template - Free Download</h1>
                </div>
                <div className="flex items-center gap-3">
                  <DownloadDropDown data={{ resumeData: sampleData, template, filename: `resume-preview-${template.id}` }} />
                  <Link href={`${CREATE_RESUME}`} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">Choose Another Template</Link>
                </div>
              </div>

              {/* SEO Content Section */}
              {isATSClassic && (
                <div className="bg-white border rounded-lg p-6 mb-6">
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Professional ATS-Optimized Resume Template</h2>
                    <p className="text-gray-700 mb-4">
                      Create a professional, <strong>ATS-optimized resume</strong> in minutes with the <strong>ATS Classic template</strong>. This traditional single-column layout is designed to pass Applicant Tracking Systems while showcasing your experience in engineering, finance, and operations roles.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features of This ATS-Friendly Template</h3>
                    <ul className="list-disc pl-6 text-gray-700 mb-4">
                      <li><strong>ATS-Optimized Design:</strong> Simple formatting without complex tables, graphics, or columns that could confuse applicant tracking systems</li>
                      <li><strong>Professional Fonts:</strong> Uses standard, easy-to-read fonts that are universally compatible with all ATS platforms</li>
                      <li><strong>PDF Download:</strong> Save your resume as a PDF to ensure it displays correctly across all devices and maintains formatting integrity</li>
                      <li><strong>Keyword-Friendly Structure:</strong> Strategically organized sections allow you to naturally incorporate relevant keywords from job descriptions</li>
                      <li><strong>Single-Column Layout:</strong> Traditional format that ensures maximum readability by both ATS software and hiring managers</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Suited For</h3>
                    <p className="text-gray-700 mb-4">
                      This <strong>classic resume template</strong> works exceptionally well for candidates in <strong>engineering</strong>, <strong>finance</strong>, and <strong>operations</strong> sectors where traditional formatting is preferred. The straightforward design emphasizes your professional experience and technical skills without distracting visual elements.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Why Choose This Free ATS Resume Template?</h4>
                      <p className="text-blue-800 text-sm">
                        Our <strong>free ATS resume template</strong> is specifically designed to help you create a <strong>professional resume template</strong> that passes through automated screening systems. With its <strong>single column resume template</strong> design, you can be confident that your application will reach hiring managers.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <aside className="lg:col-span-1 p-4 bg-white border rounded-lg shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-20 h-28 bg-gray-100 rounded overflow-hidden">
                    <Image src={templateMeta?.url || '/placeholder.jpg'} alt={`${template.name} resume template preview`} width={160} height={220} className="object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{template.name}</h2>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                    <div className="mt-2 text-xs inline-flex items-center px-2 py-0.5 rounded bg-accent text-accent-foreground">{template.id}</div>
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  <h3 className="font-medium mb-2">Suggested for</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(templateMeta?.suggestedFor || []).map((s: string) => (
                      <span key={s} className="text-xs px-2 py-1 bg-gray-100 rounded">{s}</span>
                    ))}
                  </div>

                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <ul className="ml-3 list-disc mb-4">
                    <li><a className="text-blue-600 hover:underline" href={`mailto:${sampleData.basics.email}`}>{sampleData.basics.email}</a></li>
                    <li><a className="text-blue-600 hover:underline" href={sampleData.basics.linkedin}>{sampleData.basics.linkedin}</a></li>
                  </ul>

                  <h3 className="font-medium mb-2">Resume Sections</h3>
                  <ul className="ml-3 list-disc">
                    {sampleData.sections.slice(0,3).map((s:any) => (
                      <li key={s.id} className="capitalize">{s.title}</li>
                    ))}
                  </ul>
                </div>
              </aside>

              <div className="lg:col-span-2 bg-white border rounded-lg shadow-sm">
                <ResumePreview resumeData={sampleData as any} template={template} onDataUpdate={()=>{}} activeSection="" setResumeData={()=>{}} className="min-h-[800px]" />
              </div>
            </div>

            {/* Additional SEO Content */}
            {isATSClassic && (
              <>
                <div className="mt-8 bg-white border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Use This ATS Classic Resume Template</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Customize Your Information</h3>
                      <p className="text-gray-700 mb-3">Replace the sample content with your personal information, work experience, education, and skills. The template's structure makes it easy to organize your professional background.</p>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Optimize for Keywords</h3>
                      <p className="text-gray-700">Include relevant keywords from job descriptions naturally throughout your resume. The single-column layout ensures all content is easily scannable by ATS systems.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Download as PDF</h3>
                      <p className="text-gray-700 mb-3">Export your completed resume as a PDF to maintain formatting consistency across all devices and platforms.</p>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 4: Review and Submit</h3>
                      <p className="text-gray-700">Double-check all information for accuracy and ensure your resume highlights your most relevant qualifications for the target position.</p>
                    </div>
                  </div>
                </div>

                {/* FAQ Section for SEO */}
                <div className="mt-8 bg-white border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions About ATS Resume Templates</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">What makes a resume template ATS-friendly?</h3>
                      <p className="text-gray-700">An <strong>ATS-friendly resume template</strong> uses simple formatting, standard fonts, clear section headings, and avoids complex layouts, graphics, or tables that can confuse applicant tracking systems.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Is this classic resume template free to download?</h3>
                      <p className="text-gray-700">Yes, our <strong>free ATS resume template</strong> is completely free to download and use. No sign-up required, no hidden fees, and no credit card needed.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Which industries work best with this template?</h3>
                      <p className="text-gray-700">This <strong>professional resume template</strong> is ideal for <strong>engineering</strong>, <strong>finance</strong>, and <strong>operations</strong> roles where traditional formatting is preferred by hiring managers.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I customize this template?</h3>
                      <p className="text-gray-700">Absolutely! You can fully customize this <strong>single column resume template</strong> with your information, adjust formatting, and add or remove sections as needed for your specific role.</p>
                    </div>
                  </div>
                </div>

                {/* Related Templates Section */}
                <div className="mt-8 bg-gray-50 border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Explore More Professional Resume Templates</h2>
                  <p className="text-gray-700 mb-4">
                    Looking for a different style? Check out our other <strong>professional resume templates</strong> designed for various industries and career levels.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/free-ats-resume-templates/preview?template=ats-green" className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">ATS Green Template</h3>
                      <p className="text-sm text-gray-600">Modern ATS-optimized design with green accents</p>
                    </Link>
                    {/* <Link href="/free-ats-resume-templates/preview?template=ats-timeline" className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">Timeline Template</h3>
                      <p className="text-sm text-gray-600">Visual timeline design for career progression</p>
                    </Link> */}
                    <Link href="/free-ats-resume-templates" className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">All Templates</h3>
                      <p className="text-sm text-gray-600">Browse our complete collection of resume templates</p>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function ResumePreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
