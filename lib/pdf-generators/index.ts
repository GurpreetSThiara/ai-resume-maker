import type { PDFGenerationOptions } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { triggerPdfDownload } from "@/lib/pdf-generators/trigger-pdf-download"
import { generateDesignPDF } from "./design-pdf-engine"
import { getResumeDesign } from "../resume-designs"

function hasSectionContent(section: any): boolean {
  if (!section || section.hidden) return false
  switch (section.type) {
    case SECTION_TYPES.EDUCATION:
    case SECTION_TYPES.EXPERIENCE:
      return Array.isArray(section.items) && section.items.length > 0
    case SECTION_TYPES.SKILLS:
    case SECTION_TYPES.LANGUAGES:
    case SECTION_TYPES.CERTIFICATIONS:
      return Array.isArray(section.items) && section.items.filter((s: string) => s && s.trim()).length > 0
    case SECTION_TYPES.PROJECTS:
      return Array.isArray(section.items) && section.items.length > 0
    case SECTION_TYPES.CUSTOM:
      return Array.isArray(section.content) && section.content.filter((s: string) => s && s.trim()).length > 0
    default:
      return false
  }
}

function getFilteredPdfOptions(options: PDFGenerationOptions): PDFGenerationOptions {
  return {
    ...options,
    resumeData: {
      ...options.resumeData,
      sections: (options.resumeData.sections || []).filter(
        (s: any) => s.id === "custom-fields" || hasSectionContent(s),
      ),
    },
  }
}

/**
 * Build the PDF bytes for the given template.
 *
 * Every template — the config-driven designs AND the legacy templates
 * (classic-blue, ats-classic, ats-green, modern-sidebar, …) — renders through
 * the single, properly-paginated design engine. Legacy ids resolve to their
 * bridged `ResumeDesign` via `getResumeDesign`; an unknown id falls back to the
 * classic-blue design so we never produce an empty document.
 */
export async function generateResumePDFBytes(options: PDFGenerationOptions): Promise<Uint8Array> {
  const { template } = options
  const filteredOptions = getFilteredPdfOptions(options)
  const design = getResumeDesign(template.id) ?? getResumeDesign("classic-blue")!
  return generateDesignPDF(filteredOptions, design)
}

export async function generateResumePDF(options: PDFGenerationOptions) {
  const { template } = options
  const filename = options.filename ?? "resume.pdf"
  const bytes = await generateResumePDFBytes(options)
  triggerPdfDownload(bytes, filename)

  try {
    await fetch("/api/track-download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        format: "pdf",
        template: template.id,
      }),
    })
  } catch (error) {
    console.error("Failed to track PDF download:", error)
  }
}
