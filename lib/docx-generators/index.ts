import type { PDFGenerationOptions } from "@/types/resume"
import { generateClassic1ResumeDOCX } from "./generate-classic1-docx"
import { generateClassic2ResumeDOCX } from "./generate-classic2-docx"


export async function generateResumeDOCX(options: PDFGenerationOptions) {
  const { template } = options

  switch (template.id) {
    case "google":
      return generateClassic1ResumeDOCX(options)
    case "ats-classic":
      return generateClassic2ResumeDOCX(options)
  }
}



