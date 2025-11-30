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

      <section className="relative mt-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-linear-to-r from-blue-100 to-indigo-100 blur-3xl animate-pulse" />
          <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-linear-to-r from-green-100 to-emerald-100 blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-6 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-700">ATS Optimization Guide</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 bg-linear-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
            Beat the ATS with
            <br />
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Resume Design
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            <strong>75% of resumes are rejected by ATS before they reach human eyes.</strong> Our templates are engineered to pass through automated screening systems and get you noticed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50 backdrop-blur-sm"
                 style={{ backgroundImage: `linear-gradient(to bottom right, #f0f9ff, #e0f2fe)` }}>
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Keyword Optimization</h3>
                <p className="text-slate-600">Strategically placed industry keywords that ATS systems scan for</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50 backdrop-blur-sm"
                 style={{ backgroundImage: `linear-gradient(to bottom right, #f0fdf4, #dcfce7)` }}>
              <div className="absolute inset-0 bg-linear-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Clean Formatting</h3>
                <p className="text-slate-600">ATS-friendly layouts that parse correctly without formatting errors</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50 backdrop-blur-sm"
                 style={{ backgroundImage: `linear-gradient(to bottom right, #faf5ff, #f3e8ff)` }}>
              <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-r from-purple-500 to-pink-600 shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Structure</h3>
                <p className="text-slate-600">Logical section ordering that ATS systems expect and prefer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-slate-900 via-green-800 to-slate-900 bg-clip-text text-transparent">
              Essential ATS Features Built-In
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our templates include everything you need to pass ATS screening and impress recruiters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-14 h-14 bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Standard Sections</h3>
              <p className="text-slate-600 leading-relaxed">Contact, Experience, Education, Skills - the sections ATS systems look for first</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-14 h-14 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Simple Fonts</h3>
              <p className="text-slate-600 leading-relaxed">ATS-readable fonts like Arial, Calibri, and Georgia that parse correctly</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-14 h-14 bg-linear-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">No Graphics</h3>
              <p className="text-slate-600 leading-relaxed">Clean text-only designs that ATS systems can read without errors</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-14 h-14 bg-linear-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v8a2 2 0 01-2 2H10a2 2 0 01-2-2V8m0 0V7m4 4h.01M11 13h.01M8 12h.01M12 12h.01M16 12h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Bullet Points</h3>
              <p className="text-slate-600 leading-relaxed">Achievement-focused bullet points that ATS systems parse as accomplishments</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-14 h-14 bg-linear-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">1-Page Format</h3>
              <p className="text-slate-600 leading-relaxed">Optimized length that keeps ATS attention while showcasing your value</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="w-14 h-14 bg-linear-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Proven Results</h3>
              <p className="text-slate-600 leading-relaxed">Templates tested with real ATS systems to ensure 95%+ success rate</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium">All templates are ATS-optimized and tested</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10 text-sm text-muted-foreground">
        {/* Can't find the style you're after? Try creating a custom layout in the editor or contact support. */}
      </footer>
    </main>
  )
}

