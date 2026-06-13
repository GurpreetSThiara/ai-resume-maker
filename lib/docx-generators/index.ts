import type { PDFGenerationOptions } from "@/types/resume"
import { generateDesignDOCX } from "./design-docx-engine"
import { getResumeDesign } from "../resume-designs"

/**
 * Build the DOCX bytes for the given template.
 *
 * Mirrors the PDF pipeline: every template (config-driven designs and the
 * bridged legacy templates) renders through the single design DOCX engine.
 * Legacy ids resolve via `getResumeDesign`; an unknown id falls back to the
 * classic-blue design.
 */
export async function generateResumeDOCXBytes(options: PDFGenerationOptions) {
  const { template } = options
  const design = getResumeDesign(template.id) ?? getResumeDesign("classic-blue")!
  return generateDesignDOCX(options, design)
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
