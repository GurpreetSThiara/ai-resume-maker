import type { PDFGenerationOptions } from "@/types/resume"
import { generateResumePDF as generateGooglePDF } from "@/lib/pdf-generators/google-resume-generator"
import { generateModernResumePDF } from "@/lib/pdf-generators/modern-resume-generator"
import { generateClassic2ResumePDF } from "@/lib/pdf-generators/template-classic-generator"
import { generateElegantResumePDF } from "@/lib/pdf-generators/template-elegant-generator"
import { generateCompactResumePDF } from "@/lib/pdf-generators/template-compact-generator"
import { generateCreativeResumePDF } from "@/lib/pdf-generators/template-creative-generator"
import { generateATSGreenResume } from "./ats-green-resume-generator"
import { generateTimelineResumePDF } from "./timeline-resume-generator"
import { generateModernSidebarResumePDF } from "./twoside"
import { RESUME_NAMES } from "@/config/resumeConfig"
import { ATS_GREEN, ATS_YELLOW, ATS_TIMELINE } from "../templates"
import { SHOW_SUCCESS } from "@/utils/toast"

export async function generateResumePDF(options: PDFGenerationOptions) {
  const { template } = options

  let result
  switch (template.id) {
    case "google":
      result = await generateGooglePDF(options)
      break
    case "modern":
      result = await generateModernResumePDF(options)
      break
    case "ats-classic":
      result = await generateClassic2ResumePDF(options)
      break
    case "ats-elegant":
      result = await generateElegantResumePDF(options)
      break
    case "ats-compact":
      result = await generateCompactResumePDF(options)
      break
    case "ats-creative":
      result = await generateCreativeResumePDF(options)
      break
    case ATS_GREEN.id:
      result = await generateATSGreenResume(options)
      break
    case ATS_YELLOW.id:
      result = await generateATSGreenResume({...options , theme: "yellow"}) // using same generator for now
      break
    case ATS_TIMELINE.id:
      result = await generateTimelineResumePDF(options)
      break
    default:
      result = await generateGooglePDF(options)
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



