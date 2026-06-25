"use client"

import { useEffect, useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2 } from "lucide-react"
import { generateResumePDFBytes } from "@/lib/pdf-generators"
import { PT_TO_PX } from "@/lib/render-spec"
import type { ResumeData, ResumeTemplate } from "@/types/resume"

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
}

/** Real PDF rendered at scale = PT_TO_PX (595.28pt → ~793px), client-only. */
export default function PdfPane({ resumeData, template, width }: { resumeData: ResumeData; template: ResumeTemplate; width: number }) {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null)
  const [numPages, setNumPages] = useState(0)
  const file = useMemo(() => (pdfBytes ? { data: new Uint8Array(pdfBytes) } : null), [pdfBytes])

  useEffect(() => {
    let cancelled = false
    setPdfBytes(null)
    generateResumePDFBytes({ resumeData, template, filename: "parity.pdf" })
      .then((b) => { if (!cancelled) { setPdfBytes(b); setNumPages(0) } })
      .catch((e) => console.error("[parity] pdf gen failed", e))
    return () => { cancelled = true }
  }, [template, resumeData])

  return (
    <div className="shrink-0" style={{ width }}>
      {file ? (
        <Document file={file} onLoadSuccess={({ numPages: n }) => setNumPages(n)} loading={<Loader2 className="mx-auto my-10 h-6 w-6 animate-spin text-gray-400" />}>
          {numPages > 0
            ? Array.from({ length: numPages }, (_, i) => (
                <Page key={i} pageNumber={i + 1} scale={PT_TO_PX} renderTextLayer={false} renderAnnotationLayer={false} className="shadow mb-4" />
              ))
            : null}
        </Document>
      ) : (
        <Loader2 className="mx-auto my-10 h-6 w-6 animate-spin text-gray-400" />
      )}
    </div>
  )
}
