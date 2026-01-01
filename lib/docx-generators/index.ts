import type { PDFGenerationOptions } from "@/types/resume"
import { generateClassic1ResumeDOCX } from "./generate-classic1-docx"
import { generateClassic2ResumeDOCX } from "./generate-classic2-docx"
import { generateTimelineResumeDOCX } from "./generate-timeline-docx";
import { generateATSCompactLinesDOCX } from './ats-compact-lines-docx';
import { ATS_TIMELINE, atsCompactLinesTemplate } from "../templates";


export async function generateResumeDOCX(options: PDFGenerationOptions) {
  const { template } = options

  let result
  switch (template.id) {
    case "ats_compact_lines":
      result = await generateATSCompactLinesDOCX(options as any)
      break
    default:
      // DOCX download is only supported for ATS Compact Lines template
      throw new Error("DOCX download is only available for the ATS Compact Lines template.")
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



