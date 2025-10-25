import type { PDFGenerationOptions } from "@/types/resume"
import { generateClassic1ResumeDOCX } from "./generate-classic1-docx"
import { generateClassic2ResumeDOCX } from "./generate-classic2-docx"
import { generateTimelineResumeDOCX } from "./generate-timeline-docx"
import { ATS_TIMELINE } from "../templates"


export async function generateResumeDOCX(options: PDFGenerationOptions) {
  const { template } = options

  let result
  switch (template.id) {
    case "google":
      result = await generateClassic1ResumeDOCX(options)
      break
    case "ats-classic":
      result = await generateClassic2ResumeDOCX(options)
      break
    case ATS_TIMELINE.id:
      result = await generateTimelineResumeDOCX(options)
      break
    default:
      result = await generateClassic2ResumeDOCX(options)
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

  return result
}



