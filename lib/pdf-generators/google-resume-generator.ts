import { PDFDocument, StandardFonts, rgb, PDFName, PDFArray } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { sanitizeTextForPdf } from '@/lib/utils'

export async function generateResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([595.276, 841.89]) // A4

  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let yOffset = 800
  const margin = 50
  const pageWidth = 595.276 - 2 * margin

  const accentColor = rgb(0.15, 0.4, 0.65) // Blue accent
  const textColor = rgb(0.1, 0.1, 0.1)
  const secondaryColor = rgb(0.4, 0.4, 0.4)
  const linkColor = rgb(0, 0, 1)

  const ensureSpace = (spaceNeeded: number) => {
    if (yOffset - spaceNeeded < margin) {
      currentPage = pdfDoc.addPage([595.276, 841.89])
      yOffset = 800
    }
  }

  const wrapText = (text: string, maxWidth: number, font = regularFont, size = 10): string[] => {
    const words = sanitizeTextForPdf(text).split(" ")
    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      const width = font.widthOfTextAtSize(
        sanitizeTextForPdf(currentLine + " " + word),
        size
      )
      if (width < maxWidth) {
        currentLine += (currentLine ? " " : "") + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    })
    if (currentLine) lines.push(currentLine)
    return lines
  }

  const draw = (t: string, x: number, size: number, font = regularFont, color = textColor) => {
    currentPage.drawText(sanitizeTextForPdf(t || ""), { x, y: yOffset, size, font, color })
  }

  // Name
  draw(resumeData.name, margin, 20, boldFont, accentColor)

  yOffset -= 20

  // Contact Info
  const contactInfo = `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`
  draw(contactInfo, margin, 10, regularFont, secondaryColor)

  yOffset -= 25

  // Custom Details (2 columns) - Fixed overlapping issue
  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden)
  
  if (customEntries.length > 0) {
    const colWidth = pageWidth / 2 - 15 // Reduced gap between columns
    const rowHeight = 16 // Increased row height for better spacing
    const leftX = margin
    const rightX = margin + pageWidth / 2 + 10 // Adjusted right column position

    // Calculate how many rows we need
    const totalRows = Math.ceil(customEntries.length / 2)
    
    // Ensure we have enough space for all custom entries
    ensureSpace(totalRows * rowHeight + 10)

    customEntries.forEach(([_, item], index) => {
      const isLeft = index % 2 === 0
      const xPos = isLeft ? leftX : rightX
      const rowIndex = Math.floor(index / 2)
      const yPos = yOffset - rowIndex * rowHeight

      // Key
      draw(`${item.title}:`, xPos, 10, boldFont, textColor)

      // Calculate content position to avoid overlap
      const keyText = `${item.title}:`
      const keyWidth = regularFont.widthOfTextAtSize(keyText, 10)
      const contentX = xPos + keyWidth + 5 // Add small gap between key and content

      // Value (Link or Text) - ensure it doesn't exceed column width
      const maxContentWidth = colWidth - keyWidth - 5
      const content = sanitizeTextForPdf(item.content)
      
      if (regularFont.widthOfTextAtSize(content, 10) <= maxContentWidth) {
        // Content fits in one line
        draw(content, contentX, 10, regularFont, item.link ? linkColor : textColor)
      } else {
        // Content needs to wrap
        const wrappedLines = wrapText(content, maxContentWidth, regularFont, 10)
        wrappedLines.forEach((line, lineIndex) => {
          draw(line, contentX, 10, regularFont, item.link ? linkColor : textColor)
          yOffset -= 12
        })
        // Reset yOffset for next item
        yOffset += wrappedLines.length * 12
      }
    })

    yOffset -= totalRows * rowHeight + 15
  }

  // Sections - Only render sections with actual content
  for (const section of resumeData.sections) {
    // Check if section has any content
    const hasContent = Object.entries(section.content).some(([key, bullets]) => {
      return key && bullets && bullets.length > 0 && bullets.some(bullet => bullet.trim() !== '')
    })

    // Skip sections with no content
    if (!hasContent) {
      continue
    }

    ensureSpace(30)

    // Section Title
    draw(section.title, margin, 14, boldFont, accentColor)

    // Divider line
    currentPage.drawLine({
      start: { x: margin, y: yOffset - 2 },
      end: { x: margin + pageWidth, y: yOffset - 2 },
      thickness: 1,
      color: accentColor,
    })

    yOffset -= 18

    for (const [key, bullets] of Object.entries(section.content)) {
      // Skip empty keys or empty bullet arrays
      if (!key || !bullets || bullets.length === 0) {
        continue
      }

      // Check if bullets have actual content
      const hasBulletContent = bullets.some(bullet => bullet.trim() !== '')
      if (!hasBulletContent) {
        continue
      }

      ensureSpace(15)

      const [title, subtitle] = key.split(" | ")

      if (title && title.trim() !== '') {
        draw(title, margin, 11, boldFont, textColor)
        yOffset -= 12
      }

      if (subtitle && subtitle.trim() !== '') {
        draw(subtitle, margin, 9, regularFont, secondaryColor)
        yOffset -= 12
      }

      for (const bullet of bullets) {
        // Skip empty bullets
        if (!bullet || bullet.trim() === '') {
          continue
        }

        ensureSpace(12)
        const lines = wrapText(`• ${bullet}`, pageWidth - 20, regularFont, 10)
        for (const line of lines) {
          draw(line, margin + 12, 10, regularFont, textColor)
          yOffset -= 12
        }
      }
      yOffset -= 5
    }

    yOffset -= 10
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
