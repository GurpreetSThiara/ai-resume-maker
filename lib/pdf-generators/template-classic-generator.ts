import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { ResumeData } from '@/types/resume'
import { sanitizeTextForPdf } from '@/lib/utils'

export async function generateClassicResumePDF({ 
  resumeData, 
  filename = "resume.pdf" 
}: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  const { height, width } = page.getSize()
  
  // Font setup
  const regular = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  
  // Layout constants
  const margin = 50
  const lineHeight = 12
  const sectionSpacing = 20
  let y = height - margin
  
  // Colors
  const textColor = rgb(0.1, 0.1, 0.1)
  const secondaryColor = rgb(0.4, 0.4, 0.4)
  const accentColor = rgb(0.2, 0.2, 0.5) // For headers
  
  // Enhanced drawing function with better positioning
  const draw = (
    text: string, 
    x: number, 
    size: number, 
    font = regular, 
    color = textColor,
    maxWidth?: number
  ) => {
    const sanitizedText = sanitizeTextForPdf(text || "")
    if (maxWidth) {
      const textWidth = font.widthOfTextAtSize(sanitizedText, size)
      if (textWidth > maxWidth) {
        // Truncate text if it's too long
        let truncated = sanitizedText
        while (font.widthOfTextAtSize(truncated + "...", size) > maxWidth && truncated.length > 0) {
          truncated = truncated.slice(0, -1)
        }
        page.drawText(truncated + "...", { x, y, size, font, color })
        return
      }
    }
    page.drawText(sanitizedText, { x, y, size, font, color })
  }

  // Width-based text wrapping function
  const wrapTextByWidth = (text: string, maxWidth: number, fontSize: number, font: any): string[] => {
    if (!text || text.trim() === '') return []
    
    const words = text.split(/\s+/)
    const lines: string[] = []
    let currentLine = ""
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = font.widthOfTextAtSize(testLine, fontSize)
      
      if (testWidth > maxWidth && currentLine !== "") {
        lines.push(currentLine.trim())
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine.trim()) {
      lines.push(currentLine.trim())
    }
    
    return lines.length > 0 ? lines : [""]
  }
  
  // Check if we need a new page
  const checkNewPage = (requiredSpace: number = 50) => {
    if (y < requiredSpace) {
      page = pdfDoc.addPage([595.28, 841.89])
      y = height - margin
      return true
    }
    return false
  }
  
  // Header section
  if (resumeData.name) {
    draw(resumeData.name, margin, 24, bold, textColor)
    y -= 28
  }
  
  // Contact information
  const contactInfo = [
    resumeData.email,
    resumeData.phone,
    resumeData.location,
    resumeData.linkedin
  ].filter(Boolean).join(" | ")
  
  if (contactInfo) {
    draw(contactInfo, margin, 10, regular, secondaryColor, width - 2 * margin)
    y -= sectionSpacing
  }
  
  // Custom fields section
  const customFields = Object.values(resumeData.custom).filter(item => !item.hidden)
  if (customFields.length > 0) {
    customFields.forEach((item) => {
      if (item.title && item.content) {
        checkNewPage()
        draw(`${item.title.toUpperCase()}: ${item.content}`, margin, 10, regular, textColor)
        y -= lineHeight
      }
    })
    y -= 8
  }
  
  // Main sections
  for (const section of resumeData.sections) {
    // Validate section has content
    const hasValidContent = Object.entries(section.content).some(([key, bullets]) => {
      return key && 
             bullets && 
             Array.isArray(bullets) && 
             bullets.length > 0 && 
             bullets.some(bullet => bullet && bullet.trim() !== '')
    })
    
    if (!hasValidContent) continue
    
    // Check if we need space for section header
    checkNewPage(80)
    
    // Section header
    draw(section.title.toUpperCase(), margin, 12, bold, accentColor)
    y -= 16
    
    // Section content
    for (const [header, bullets] of Object.entries(section.content)) {
      if (!header || !bullets || !Array.isArray(bullets) || bullets.length === 0) {
        continue
      }
      
      const validBullets = bullets.filter(bullet => bullet && bullet.trim() !== '')
      if (validBullets.length === 0) continue
      
      // Check space for entry header + at least one bullet
      checkNewPage(40)
      
      // Parse header (role | date format)
      const [role, ...dateParts] = header.split(" | ")
      const date = dateParts.join(" | ") // Handle multiple | in header
      
      if (role && role.trim() !== '') {
        // Draw role on left
        draw(role.trim(), margin, 10, bold, textColor, width - 200)
        
        // Draw date on right if exists
        if (date && date.trim() !== '') {
          const dateWidth = regular.widthOfTextAtSize(date.trim(), 9)
          draw(date.trim(), width - margin - dateWidth, 9, regular, secondaryColor)
        }
        y -= 14
      }
      
      // Bullet points
      for (const bullet of validBullets) {
        if (!bullet || bullet.trim() === '') continue
        
        // Calculate available width for bullet text
        const bulletIndent = margin + 10
        const availableWidth = width - bulletIndent - margin
        const wrappedLines = wrapTextByWidth(`• ${bullet.trim()}`, availableWidth, 9, regular)
        
        for (let i = 0; i < wrappedLines.length; i++) {
          checkNewPage()
          const indent = i === 0 ? bulletIndent : margin + 20 // Indent continuation lines more
          draw(wrappedLines[i], indent, 9, regular, textColor)
          y -= lineHeight
        }
      }
      y -= 6 // Space between entries
    }
    y -= 8 // Space between sections
  }
  
  // Generate and download PDF
  try {
    const bytes = await pdfDoc.save()
    const blob = new Blob([bytes], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link) // Ensure link is in DOM
    link.click()
    document.body.removeChild(link) // Clean up
    URL.revokeObjectURL(link.href) // Free up memory
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF resume')
  }
}

// Enhanced text wrapping with better word break handling
function wrapText(text: string, maxChars: number): string[] {
  if (!text || text.trim() === '') return []
  
  const words = text.split(/\s+/) // Handle multiple spaces
  const lines: string[] = []
  let currentLine = ""
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    
    if (testLine.length > maxChars && currentLine !== "") {
      lines.push(currentLine.trim())
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine.trim()) {
    lines.push(currentLine.trim())
  }
  
  return lines.length > 0 ? lines : [""]
}

// Utility function to estimate text height for better spacing
function estimateTextHeight(text: string, maxChars: number, lineHeight: number = 12): number {
  const lines = wrapText(text, maxChars)
  return lines.length * lineHeight
}

// Optional: Add function to validate resume data structure
export function validateResumeData(data: ResumeData): string[] {
  const errors: string[] = []
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Resume name is required')
  }
  
  if (!data.sections || !Array.isArray(data.sections)) {
    errors.push('Resume sections must be an array')
  }
  
  return errors
}