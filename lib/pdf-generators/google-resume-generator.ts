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

  // Custom Details (Flex-wrap style layout) - Fixed overlapping and gaps
  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden)

  if (customEntries.length > 0) {
    // Calculate item dimensions for flex-wrap layout
    interface CustomItem {
      key: string
      item: any
      width: number
      height: number
      keyWidth: number
      contentWidth: number
      wrappedLines: string[]
    }

    const items: CustomItem[] = customEntries.map(([key, item]) => {
      const keyText = `${item.title}:`
      const keyWidth = boldFont.widthOfTextAtSize(keyText, 10)
      const content = sanitizeTextForPdf(item.content)
      const contentFontWidth = regularFont.widthOfTextAtSize(content, 10)
      
      // Calculate if content needs wrapping
      const maxContentWidth = Math.min(300, pageWidth - keyWidth - 20) // Max content width
      const wrappedLines = contentFontWidth > maxContentWidth 
        ? wrapText(content, maxContentWidth, regularFont, 10)
        : [content]
      
      const actualContentWidth = Math.max(...wrappedLines.map(line => 
        regularFont.widthOfTextAtSize(line, 10)
      ))
      
      return {
        key,
        item,
        width: keyWidth + actualContentWidth + 15, // key + content + gap
        height: wrappedLines.length * 12,
        keyWidth,
        contentWidth: actualContentWidth,
        wrappedLines
      }
    })

    // Flex-wrap layout algorithm
    const rows: CustomItem[][] = []
    let currentRow: CustomItem[] = []
    let currentRowWidth = 0
    const minGap = 30 // Minimum gap between items
    
    for (const item of items) {
      const itemTotalWidth = item.width + minGap
      
      // Check if item fits in current row
      if (currentRowWidth + itemTotalWidth <= pageWidth + minGap) {
        currentRow.push(item)
        currentRowWidth += itemTotalWidth
      } else {
        // Start new row
        if (currentRow.length > 0) {
          rows.push(currentRow)
        }
        currentRow = [item]
        currentRowWidth = itemTotalWidth
      }
    }
    
    // Add the last row
    if (currentRow.length > 0) {
      rows.push(currentRow)
    }

    // Render rows
    for (const row of rows) {
      // Calculate row height (tallest item in row)
      const rowHeight = Math.max(...row.map(item => item.height))
      
      // Ensure space for this row
      ensureSpace(rowHeight + 5)
      
      const rowStartY = yOffset
      
      // Distribute items across the row width
      const totalItemsWidth = row.reduce((sum, item) => sum + item.width, 0)
      const totalGaps = (row.length - 1) * minGap
      const availableSpace = pageWidth - totalItemsWidth - totalGaps
      const extraGapPerItem = row.length > 1 ? availableSpace / (row.length - 1) : 0
      
      let currentX = margin
      
      // Render each item in the row
      for (let i = 0; i < row.length; i++) {
        const item = row[i]
        const keyText = `${item.item.title}:`
        
        // Draw key
        currentPage.drawText(sanitizeTextForPdf(keyText), {
          x: currentX,
          y: rowStartY,
          size: 10,
          font: boldFont,
          color: textColor
        })
        
        // Draw content
        const contentX = currentX + item.keyWidth + 5
        item.wrappedLines.forEach((line, lineIndex) => {
          currentPage.drawText(line, {
            x: contentX,
            y: rowStartY - (lineIndex * 12),
            size: 10,
            font: regularFont,
            color: item.item.link ? linkColor : textColor
          })
        })
        
        // Move to next item position
        currentX += item.width + minGap + (i < row.length - 1 ? extraGapPerItem : 0)
      }
      
      // Move yOffset down by row height
      yOffset -= rowHeight + 8 // Extra padding between rows
    }

    yOffset -= 10 // Additional spacing after custom section
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