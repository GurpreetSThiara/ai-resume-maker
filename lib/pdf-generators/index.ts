import type { PDFGenerationOptions } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { generateResumePDF as generateGooglePDF } from "@/lib/pdf-generators/google-resume-generator"
import { generateModernResumePDF } from "@/lib/pdf-generators/modern-resume-generator"
import { generateClassic2ResumePDF } from "@/lib/pdf-generators/template-classic-generator"
import { generateElegantResumePDF } from "@/lib/pdf-generators/template-elegant-generator"
import { generateCompactResumePDF } from "@/lib/pdf-generators/template-compact-generator"
import { generateCreativeResumePDF } from "@/lib/pdf-generators/template-creative-generator"
import { generateATSGreenResume } from "./ats-green-resume-generator"
import { generateTimelineResumePDF } from "./timeline-resume-generator"
// removed broken import twoside; not used
// removed RESUME_NAMES unused import
import { ATS_GREEN, ATS_YELLOW, ATS_TIMELINE } from "../templates"
import { SHOW_SUCCESS } from "@/utils/toast"

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
    case SECTION_TYPES.CUSTOM:
      return Array.isArray(section.content) && section.content.filter((s: string) => s && s.trim()).length > 0
    default:
      return false
  }
}

export async function generateResumePDF(options: PDFGenerationOptions) {
  const { template } = options

  const filteredOptions: PDFGenerationOptions = {
    ...options,
    resumeData: {
      ...options.resumeData,
      sections: (options.resumeData.sections || []).filter((s: any) => hasSectionContent(s)),
    },
  }

  let result
  switch (template.id) {
    case "google":
      result = await generateGooglePDF(filteredOptions)
      break
    case "modern":
      result = await generateModernResumePDF(filteredOptions)
      break
    case "ats-classic":
      result = await generateClassic2ResumePDF(filteredOptions)
      break
    case "ats-elegant":
      result = await generateElegantResumePDF(filteredOptions)
      break
    case "ats-compact":
      result = await generateCompactResumePDF(filteredOptions)
      break
    case "ats-creative":
      result = await generateCreativeResumePDF(filteredOptions)
      break
    case ATS_GREEN.id:
      result = await generateATSGreenResume(filteredOptions)
      break
    case ATS_YELLOW.id:
      result = await generateATSGreenResume({...filteredOptions , theme: "yellow"})
      break
    case ATS_TIMELINE.id:
      result = await generateTimelineResumePDF(filteredOptions)
      break
    default:
      result = await generateGooglePDF(filteredOptions)
  }

  // Track download for all PDF generators
  try {
    await fetch('/api/track-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format: 'pdf',
        template: template.id,
      }),
    })
  } catch (error) {
    console.error('Failed to track PDF download:', error)
  }

  return result
}



