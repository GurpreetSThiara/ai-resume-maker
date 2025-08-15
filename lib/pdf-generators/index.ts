import type { PDFGenerationOptions } from "@/types/resume"
import { generateResumePDF as generateGooglePDF } from "@/lib/pdf-generators/google-resume-generator"
import { generateModernResumePDF } from "@/lib/pdf-generators/modern-resume-generator"
import { generateClassic2ResumePDF } from "@/lib/pdf-generators/template-classic-generator"
import { generateElegantResumePDF } from "@/lib/pdf-generators/template-elegant-generator"
import { generateCompactResumePDF } from "@/lib/pdf-generators/template-compact-generator"
import { generateCreativeResumePDF } from "@/lib/pdf-generators/template-creative-generator"

export async function generateResumePDF(options: PDFGenerationOptions) {
  const { template } = options

  switch (template.id) {
    case "google":
      return generateGooglePDF(options)
    case "modern":
      return generateModernResumePDF(options)
    case "ats-classic":
      return generateClassic2ResumePDF(options)
    case "ats-elegant":
      return generateElegantResumePDF(options)
    case "ats-compact":
      return generateCompactResumePDF(options)
    case "ats-creative":
      return generateCreativeResumePDF(options)
    default:
      return generateGooglePDF(options)
  }
}



