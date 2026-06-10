"use client"

import { useEffect, useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { FileWarning, Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { generateResumePDFBytes } from "@/lib/pdf-generators"
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { Button } from "@/components/ui/button"

// Load the PDF.js worker from the local copy in /public (copied from react-pdf's
// own pdfjs-dist by scripts/copy-pdf-worker.cjs, so the version always matches).
// Using a static public URL avoids the Turbopack/HMR "worker module factory is
// not available" error and removes the runtime dependency on a CDN.
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
}

const DEBOUNCE_MS = 450
const MIN_SCALE = 0.6
const MAX_SCALE = 2.5
const SCALE_STEP = 0.15

type ResumePdfPreviewProps = {
  resumeData: ResumeData
  template: ResumeTemplate
}

export function ResumePdfPreview({ resumeData, template }: ResumePdfPreviewProps) {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [docError, setDocError] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1)

  const file = useMemo(() => {
    if (!pdfBytes) return null
    return { data: new Uint8Array(pdfBytes) }
  }, [pdfBytes])

  useEffect(() => {
    let cancelled = false
    setError(null)

    const timer = window.setTimeout(async () => {
      try {
        const bytes = await generateResumePDFBytes({
          resumeData,
          template,
          filename: "preview.pdf",
        })
        if (cancelled) return
        setPdfBytes(bytes)
        setNumPages(0)
        setDocError(null)
        setError(null)
      } catch (e) {
        console.error("[ResumePdfPreview] generateResumePDFBytes failed:", e)
        if (!cancelled) setError("Could not update PDF preview.")
      }
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [resumeData, template])

  if (!pdfBytes && error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center text-gray-500">
        <FileWarning className="h-10 w-10" aria-hidden />
        <p className="text-sm">{error}</p>
        <p className="text-xs text-gray-400 max-w-sm">
          Check the browser console. Run <code className="text-gray-600">npm install</code> so the PDF.js worker is copied to{" "}
          <code className="text-gray-600">public/pdf.worker.min.mjs</code>.
        </p>
      </div>
    )
  }

  if (!pdfBytes || !file) {
    return (
      <div className="flex min-h-[50vh] sm:min-h-[60vh] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/80">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" aria-label="Generating PDF" />
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[595px] mx-auto min-h-[50vh] sm:min-h-[60vh] flex flex-col">
      {docError ? (
        <p className="text-center text-xs text-red-800 bg-red-50 border border-red-200 rounded-md px-2 py-1.5 mb-2">
          {docError}
        </p>
      ) : null}
      {error ? (
        <p className="text-center text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5 mb-2">
          {error}
        </p>
      ) : null}

      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-center gap-2 py-2 px-1 bg-gray-50/95 backdrop-blur-sm border border-gray-200 rounded-t-lg">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setScale((s) => Math.max(MIN_SCALE, Math.round((s - SCALE_STEP) * 100) / 100))}
          disabled={scale <= MIN_SCALE + 0.001}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-700 tabular-nums min-w-[3.25rem] text-center">{Math.round(scale * 100)}%</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setScale((s) => Math.min(MAX_SCALE, Math.round((s + SCALE_STEP) * 100) / 100))}
          disabled={scale >= MAX_SCALE - 0.001}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-auto flex-1 rounded-b-lg border border-t-0 border-gray-200 bg-gray-100 max-h-[calc(100dvh-16rem)] min-h-[40vh] sm:min-h-[50vh]">
        <Document
          file={file}
          loading={
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" aria-label="Loading PDF" />
            </div>
          }
          onLoadSuccess={({ numPages: n }) => {
            setDocError(null)
            setNumPages(n)
          }}
          onLoadError={(err) => {
            console.error("[ResumePdfPreview] Document load failed:", err)
            const msg = err instanceof Error ? err.message : "Failed to load PDF."
            setDocError(msg)
            setNumPages(0)
          }}
          className="flex flex-col items-center py-4 gap-4"
        >
          {numPages > 0
            ? Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={i + 1}
                  pageNumber={i + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md bg-white"
                />
              ))
            : null}
        </Document>
      </div>
    </div>
  )
}
