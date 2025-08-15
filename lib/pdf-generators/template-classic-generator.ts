import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { sanitizeTextForPdf } from "@/lib/utils"

export async function generateClassic2ResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([595.276, 841.89]) // A4

  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let yOffset = 800
  const margin = 40 // Reduced margin from 50 to 40 for more compact layout
  const pageWidth = 595.276 - 2 * margin

  const textColor = rgb(0.2, 0.2, 0.2) // Darker gray for better readability
  const secondaryColor = rgb(0.5, 0.5, 0.5) // Medium gray
  const borderColor = rgb(0.7, 0.7, 0.7) // Light gray for borders

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
      const width = font.widthOfTextAtSize(sanitizeTextForPdf(currentLine + " " + word), size)
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

  draw(resumeData.name, margin, 20, boldFont, textColor)
  yOffset -= 24 // Reduced spacing from 30 to 24

  // Contact Info on single line with separators
  const contactInfo = `${resumeData.email} | ${resumeData.phone} | ${resumeData.location} | ${resumeData.linkedin}`
  draw(contactInfo, margin, 11, regularFont, secondaryColor)
  yOffset -= 16 // Reduced spacing from 20 to 16

  yOffset -= 8 // Reduced spacing from 25 to 8

  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden)

  if (customEntries.length > 0) {
    const leftColumnEntries = customEntries.filter((_, index) => index % 2 === 0)
    const rightColumnEntries = customEntries.filter((_, index) => index % 2 === 1)
    const maxRows = Math.max(leftColumnEntries.length, rightColumnEntries.length)

    for (let i = 0; i < maxRows; i++) {
      ensureSpace(12)

      // Left column
      if (leftColumnEntries[i]) {
        const [key, item] = leftColumnEntries[i]
        const titleText = `${item.title.toUpperCase()}:`
        const titleWidth = boldFont.widthOfTextAtSize(titleText, 10)

        draw(titleText, margin, 10, boldFont, textColor)
        draw(item.content, margin + titleWidth + 8, 10, regularFont, textColor)
      }

      // Right column
      if (rightColumnEntries[i]) {
        const [key, item] = rightColumnEntries[i]
        const titleText = `${item.title.toUpperCase()}:`
        const titleWidth = boldFont.widthOfTextAtSize(titleText, 10)
        const rightColumnX = margin + pageWidth / 2

        draw(titleText, rightColumnX, 10, boldFont, textColor)
        draw(item.content, rightColumnX + titleWidth + 8, 10, regularFont, textColor)
      }

      yOffset -= 12 // Reduced spacing from 14 to 12
    }
    yOffset -= 8 // Reduced spacing from 10 to 8
  }

  // Sections with classic styling
  for (const section of resumeData.sections) {
    const hasContent = Object.entries(section.content).some(([key, bullets]) => {
      return key && bullets && bullets.length > 0 && bullets.some((bullet) => bullet.trim() !== "")
    })

    if (!hasContent) continue

    ensureSpace(25) // Reduced from 30 to 25

    draw(section.title.toUpperCase(), margin, 14, boldFont, textColor)

    yOffset -= 16 // Reduced spacing from 20 to 16

    for (const [key, bullets] of Object.entries(section.content)) {
      if (!key || !bullets || bullets.length === 0) continue

      const hasBulletContent = bullets.some((bullet) => bullet.trim() !== "")
      if (!hasBulletContent) continue

      ensureSpace(12) // Reduced from 15 to 12

      const [title, subtitle] = key.split(" | ")

      if (title && title.trim() !== "") {
        draw(title, margin, 12, boldFont, textColor)

        // Right-align the date/subtitle
        if (subtitle && subtitle.trim() !== "") {
          const subtitleWidth = regularFont.widthOfTextAtSize(subtitle, 10)
          draw(subtitle, margin + pageWidth - subtitleWidth, 10, regularFont, secondaryColor)
        }
        yOffset -= 12 // Reduced spacing from 15 to 12
      }

      for (const bullet of bullets) {
        if (!bullet || bullet.trim() === "") continue

        ensureSpace(10) // Reduced from 12 to 10
        const lines = wrapText(`• ${bullet}`, pageWidth - 30, regularFont, 10)
        for (const line of lines) {
          draw(line, margin + 20, 10, regularFont, textColor)
          yOffset -= 10 // Reduced spacing from 12 to 10
        }
      }
      yOffset -= 6 // Reduced spacing from 8 to 6
    }

    yOffset -= 10 // Reduced spacing from 15 to 10
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
