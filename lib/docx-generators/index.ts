import type { PDFGenerationOptions } from "@/types/resume"
import { generateGoogleDOCX } from "./google-resume-docx"
import { generateClassicDOCX } from "./classic-resume-docx"
import { generateATSGreenDOCX } from "./ats-green-docx"
import { generateTimelineDOCX } from "./timeline-resume-docx"
import { generateModernSidebarDOCX } from "./modern-sidebar-docx"
import { generateBoldDOCX } from "./bold-professional-docx"
import { generateDesignDOCX } from "./design-docx-engine"
import { getResumeDesign } from "../resume-designs"

/** Build the DOCX bytes for the given template, without downloading or tracking. */
export async function generateResumeDOCXBytes(options: PDFGenerationOptions) {
  const { template } = options
  switch (template.id) {
    case "classic-blue":
      return generateGoogleDOCX({ ...options, variant: "default" } as any)
    case "ats-compact-lines":
      return generateGoogleDOCX({ ...options, variant: "black_compact" } as any)
    case "ats-classic":
      return generateClassicDOCX({ ...options, variant: "default" } as any)
    case "ats-classic-compact":
      return generateClassicDOCX({ ...options, variant: "compact" } as any)
    case "ats-green":
      return generateATSGreenDOCX({ ...options, theme: "green" } as any)
    case "ats-yellow":
      return generateATSGreenDOCX({ ...options, theme: "yellow" } as any)
    case "ats-timeline":
      return generateTimelineDOCX(options)
    case "modern-sidebar":
      return generateModernSidebarDOCX(options)
    case "bold-professional":
      return generateBoldDOCX(options)
    default: {
      const design = getResumeDesign(template.id)
      if (design) return generateDesignDOCX(options, design)
      // Fallback for unknown templates
      return generateClassicDOCX({ ...options, variant: "default" } as any)
    }
  }
}

export async function generateResumeDOCX(options: PDFGenerationOptions) {
  const { template } = options
  const result = await generateResumeDOCXBytes(options)

  // Track download for DOCX generators
  try {
    await fetch('/api/track-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format: 'docx',
        template: template.id,
      }),
    })
  } catch (error) {
    console.error('Failed to track DOCX download:', error)
  }

  // Trigger file download in browser
  if (typeof window !== 'undefined' && result) {
    const blob = new Blob([result as unknown as ArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = options.filename || 'resume.docx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return result
}
