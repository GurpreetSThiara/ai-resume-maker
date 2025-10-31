import { PDFDocument, StandardFonts, rgb, PDFName, PDFArray } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
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
  draw(resumeData.basics.name, margin, 20, boldFont, accentColor)

  yOffset -= 20

  // Contact Info
  const { email, phone, location, linkedin } = resumeData.basics
  const contactInfo = [email, phone, location , linkedin].filter(Boolean).join(" | ")
  draw(contactInfo, margin, 10, regularFont, secondaryColor)

  yOffset -= 25

  // LinkedIn
  // if (linkedin) {
  //   draw(linkedin, margin, 10, regularFont, linkColor)
  //   yOffset -= 25
  // }

  // Summary
  if (resumeData.basics.summary) {
    const summaryLines = wrapText(resumeData.basics.summary, pageWidth - 20, regularFont, 10)
    for (const line of summaryLines) {
      draw(line, margin, 10, regularFont, textColor)
      yOffset -= 12
    }
    yOffset -= 13
  }

  // Extract custom entries from resume data
  const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]: any) => !item?.hidden);

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
    // Guard: skip hidden or empty sections (defensive, also pre-filtered at caller)
    if ((section as any).hidden) continue
    let hasContent = false
    if ('items' in (section as any) && Array.isArray((section as any).items)) {
      if ([SECTION_TYPES.EDUCATION, SECTION_TYPES.EXPERIENCE].includes(section.type as any)) {
        hasContent = (section as any).items.length > 0
      } else if ([SECTION_TYPES.SKILLS, SECTION_TYPES.LANGUAGES, SECTION_TYPES.CERTIFICATIONS].includes(section.type as any)) {
        hasContent = (section as any).items.filter((s: string) => s && s.trim()).length > 0
      }
    } else if ('content' in (section as any) && Array.isArray((section as any).content)) {
      hasContent = (section as any).content.some((t: string) => t && t.trim() !== '')
    }
    if (!hasContent) continue
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

    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of section.items) {
          ensureSpace(15)

          // Institution name
          draw(edu.institution, margin, 11, boldFont, textColor)
          yOffset -= 12

          // Degree
          draw(edu.degree, margin, 10, regularFont, textColor)
          yOffset -= 12

          // Dates and location
          const eduDates = `${edu.startDate} - ${edu.endDate}${edu.location ? ` • ${edu.location}` : ''}`
          draw(eduDates, margin, 9, regularFont, secondaryColor)
          yOffset -= 12

          // Highlights
          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              ensureSpace(12)
              const lines = wrapText(`• ${highlight}`, pageWidth - 20, regularFont, 10)
              for (const line of lines) {
                draw(line, margin + 12, 10, regularFont, textColor)
                yOffset -= 12
              }
            }
          }
          yOffset -= 5
        }
        break;

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of section.items) {
          ensureSpace(15)

          // Company name
          draw(exp.company, margin, 11, boldFont, textColor)
          yOffset -= 12

          // Role
          draw(exp.role, margin, 10, regularFont, textColor)
          yOffset -= 12

          // Dates and location
          const expDates = `${exp.startDate} - ${exp.endDate}${exp.location ? ` • ${exp.location}` : ''}`
          draw(expDates, margin, 9, regularFont, secondaryColor)
          yOffset -= 12

          // Achievements
          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              ensureSpace(12)
              const lines = wrapText(`• ${achievement}`, pageWidth - 20, regularFont, 10)
              for (const line of lines) {
                draw(line, margin + 12, 10, regularFont, textColor)
                yOffset -= 12
              }
            }
          }
          yOffset -= 5
        }
        break;

      case SECTION_TYPES.SKILLS:
      case SECTION_TYPES.LANGUAGES:
      case SECTION_TYPES.CERTIFICATIONS:
        if (section.items?.length) {
          ensureSpace(12)
          const lines = wrapText(section.items.join(" • "), pageWidth - 20, regularFont, 10)
          for (const line of lines) {
            draw(line, margin, 10, regularFont, textColor)
            yOffset -= 12
          }
        }
        break;

      case SECTION_TYPES.CUSTOM:
        if (section.content?.length) {
          for (const text of section.content) {
            ensureSpace(12)
            const lines = wrapText(`• ${text}`, pageWidth - 20, regularFont, 10)
            for (const line of lines) {
              draw(line, margin + 12, 10, regularFont, textColor)
              yOffset -= 12
            }
          }
          yOffset -= 5
        }
        break;
    }

    yOffset -= 10
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}