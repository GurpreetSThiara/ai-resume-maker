import type { PDFGenerationOptions } from "@/types/resume"
import { generateResumePDF as generateGooglePDF } from "@/lib/pdf-generators/google-resume-generator"
import { generateModernResumePDF } from "@/lib/pdf-generators/modern-resume-generator"
import { generateClassic2ResumePDF } from "@/lib/pdf-generators/template-classic-generator"
import { generateElegantResumePDF } from "@/lib/pdf-generators/template-elegant-generator"
import { generateCompactResumePDF } from "@/lib/pdf-generators/template-compact-generator"
import { generateCreativeResumePDF } from "@/lib/pdf-generators/template-creative-generator"
import { generateATSGreenResume } from "./ats-green-resume-generator"
import { generateModernSidebarResumePDF } from "./twoside"
import { RESUME_NAMES } from "@/config/resumeConfig"
import { ATS_GREEN, ATS_YELLOW } from "../templates"

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
    case ATS_GREEN.id:
      return generateATSGreenResume(options)
    case ATS_YELLOW.id:
      generateATSGreenResume({...options , theme: "yellow"}) // using same generator for now  
    default:
      return generateGooglePDF(options)
  }
}



