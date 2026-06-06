import type { PDFGenerationOptions } from "@/types/resume"
import { generateGoogleDOCX } from "./google-resume-docx"
import { generateClassicDOCX } from "./classic-resume-docx"
import { generateATSGreenDOCX } from "./ats-green-docx"
import { generateTimelineDOCX } from "./timeline-resume-docx"
import { generateModernSidebarDOCX } from "./modern-sidebar-docx"
import { generateBoldDOCX } from "./bold-professional-docx"
import { generateDesignDOCX } from "./design-docx-engine"
import { getResumeDesign } from "../resume-designs"

export async function generateResumeDOCX(options: PDFGenerationOptions) {
  const { template } = options

  let result
  switch (template.id) {
    case "classic-blue":
      result = await generateGoogleDOCX({ ...options, variant: "default" })
      break
    case "ats-compact-lines":
      result = await generateGoogleDOCX({ ...options, variant: "black_compact" })
      break
    case "ats-classic":
      result = await generateClassicDOCX({ ...options, variant: "default" })
      break
    case "ats-classic-compact":
      result = await generateClassicDOCX({ ...options, variant: "compact" })
      break
    case "ats-green":
      result = await generateATSGreenDOCX({ ...options, theme: "green" })
      break
    case "ats-yellow":
      result = await generateATSGreenDOCX({ ...options, theme: "yellow" })
      break
    case "ats-timeline":
      result = await generateTimelineDOCX(options)
      break
    case "modern-sidebar":
      result = await generateModernSidebarDOCX(options)
      break
    case "bold-professional":
      result = await generateBoldDOCX(options)
      break
    default: {
      const design = getResumeDesign(template.id)
      if (design) {
        result = await generateDesignDOCX(options, design)
      } else {
        // Fallback for unknown templates
        result = await generateClassicDOCX({ ...options, variant: "default" })
      }
    }
  }

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
