"use client"

import Link from "next/link"
import Image from "next/image"
import { RESUME_TEMPLATES } from "../../constants/resumeConstants"
import { CREATE_RESUME } from "@/config/urls"
import { ResumeFileUpload } from "@/components/appUI/Buttons/ResumeFileUpload"
import { PdfUploadModal } from "@/components/appUI/modals/resumeUplaodModal"
import { useState } from "react"
import { parseResume } from "@/services/aiService"
import { validateResumeData } from "@/utils/validateResume"
import { setLocalStorageJSON, LS_KEYS } from "@/utils/localstorage"
import { useRouter } from "next/navigation"
import { SHOW_ERROR } from "@/utils/toast"
import AdComponent from "@/conf/ban/AdComponent"

export  function Templates() {
  const [extractedText, setExtractedText] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const router = useRouter()

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError("")
    setFileName(file.name)
    setStatus("Preparing your resume...")

    try {
      const { extractText, getDocumentProxy } = await import("unpdf")

      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const pdf = await getDocumentProxy(uint8Array)

      const { text } = await extractText(pdf, { mergePages: true })
      setExtractedText(text)

      // Retry AI parse up to 3 attempts (initial + 2 retries)
      const maxAttempts = 3
      let attempt = 0
      let lastValidationErrors: string[] = []
      while (attempt < maxAttempts) {
        setStatus("Parsing your resume...")
        const parsed = await parseResume(text)
        if (!parsed) {
          attempt++
          continue
        }
        setStatus("Validating data...")
        const validation = validateResumeData(parsed)
        if (validation.ok) {
          setStatus("Finalizing...")
          setLocalStorageJSON(LS_KEYS.resumeData, parsed)
          // Force start at first step (Personal Info)
          try {
            const { setLocalStorageItem } = await import("@/utils/localstorage")
            setLocalStorageItem(LS_KEYS.currentStep, "0")
            setLocalStorageJSON(LS_KEYS.completedSteps, [])
          } catch {}
          setStatus("Opening editor...")
          router.push(`${CREATE_RESUME}/create?source=ai`)
          return
        } else {
          lastValidationErrors = validation.errors
          attempt++
          continue
        }
      }

      // If we reach here, validation failed after retries
      const msg = "We couldn't parse your resume reliably. Please try again later."
      setError(msg)
      SHOW_ERROR({ title: "Parsing failed", description: msg })

    } catch (err) {
      console.error("[v0] PDF extraction error:", err)
      setError(err instanceof Error ? err.message : "Failed to extract text from PDF")
      setExtractedText("")
    } finally {
      setIsLoading(false)
      setStatus("")
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {isLoading && (
        <div className="fixed inset-0 z-[100] cursor-wait" style={{ pointerEvents: 'auto' }} aria-busy="true" aria-live="polite" />
      )}
      <header className="mb-8 flex justify-between">
       <div className="">
         <h1 className="text-3xl font-bold">Choose a resume template</h1>
        <p className="mt-2 text-muted-foreground">Pick a template or upload your resume to start building your resume. You can preview, customize, and export to PDF.</p>
       </div>
       <PdfUploadModal isLoading={isLoading} status={status} onFileUpload={handleFileUpload} />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESUME_TEMPLATES.map((t) => (
          <article key={t.id} className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-[50vh] w-full bg-gray-50">
              <Image
                src={t.url}
                alt={`${t.name} preview`}
                fill
                className="object-cover object-top overflow-auto"
              />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t.category} • {t.suggestedFor?.slice(0,2).join(', ')}</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">{t.id}</span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>

              <div className="mt-4 flex items-center justify-between gap-2">
                <Link className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:opacity-95" href={`${CREATE_RESUME}/create?template=${t.id}`}>
                  Use this template
                </Link>
                <Link className="text-sm text-primary hover:underline" href={`${CREATE_RESUME}/preview?template=${t.id}`}>Preview</Link>
              </div>
            </div>
          </article>
        ))}
      </section>
       <AdComponent/>

      <section className="mt-12 py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Your Modern Solution for Professional Resumes</h2>
          <p className="mt-4 text-muted-foreground">
            In today's competitive job market, a standout resume is crucial. Our <strong>automatic resume builder</strong> is here to help. Whether you need a <strong>quick cv maker</strong> or a comprehensive <strong>resume editor service</strong>, our platform is the <strong>top resume builder</strong> for the job. You can even <strong>create a cv on my phone</strong>, making it easy to update your resume on the go. Think of us as your personal <strong>my cv builder</strong> and <strong>cv constructor</strong>, all in one. With our <strong>resumemaker online</strong>, you can start to <strong>build cv online free</strong> and land your dream job.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Features That Make Your Resume Shine</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-card border rounded-lg">
              <h3 className="text-lg font-semibold">Professional Resume Templates</h3>
              <p className="mt-2 text-sm text-muted-foreground">Choose from a wide variety of <strong>professional resume templates</strong>, including <strong>modern resume templates</strong> and <strong>creative resume templates</strong>, to find the perfect look.</p>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <h3 className="text-lg font-semibold">Free Resume Builder</h3>
              <p className="mt-2 text-sm text-muted-foreground">Our <strong>free resume builder</strong> is a powerful <strong>online resume maker</strong> that guides you through every step of the process. See our <strong>resume examples</strong> for inspiration.</p>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <h3 className="text-lg font-semibold">ATS-Friendly and Optimized</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create an <strong>ATS-friendly resume</strong> that gets past applicant tracking systems. Use our built-in <strong>resume checker</strong> to ensure it's optimized for success.</p>
            </div>
          </div>
        </div>
      </section>
           <AdComponent/>

      <footer className="mt-10 text-sm text-muted-foreground">
   
        {/* Can't find the style you're after? Try creating a custom layout in the editor or contact support. */}
      </footer>
    </main>
  )
}

