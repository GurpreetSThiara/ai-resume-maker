import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { ResumeData } from '@/types/resume'
import { sanitizeTextForPdf } from '@/lib/utils'

export async function generateModernResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  const { height } = page.getSize()

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = height - 50
  const margin = 50
  const lineHeight = 14
  const gray = rgb(0.2, 0.2, 0.2)
  const lightGray = rgb(0.4, 0.4, 0.4)

  const drawText = (text: string, x: number, font: any, size: number, color = gray) => {
    page.drawText(sanitizeTextForPdf(text || ""), { x, y, size, font, color })
  }

  // ==== HEADER ====
  drawText(resumeData.name, margin, fontBold, 22)

  const contactText = [
    resumeData.email,
    resumeData.phone,
    resumeData.location,
    resumeData.linkedin
  ]
    .filter(Boolean)
    .join(" | ")

  const contactWidth = fontRegular.widthOfTextAtSize(contactText, 10)
  page.drawText(contactText, {
    x: page.getWidth() - margin - contactWidth,
    y,
    size: 10,
    font: fontRegular,
    color: gray
  })

  y -= 30

  // ==== CUSTOM FIELDS ====
  Object.keys(resumeData.custom).forEach((key) => {
    const item = resumeData.custom[key]
    if (item.hidden) return
    const label = `${item.title.toUpperCase()}: `
    page.drawText(label, {
      x: margin,
      y,
      size: 9,
      font: fontBold,
      color: lightGray
    })
    page.drawText(item.content || "", {
      x: margin + fontBold.widthOfTextAtSize(label, 9),
      y,
      size: 9,
      font: fontRegular,
      color: gray
    })
    y -= 14
  })

  y -= 10

  // ==== SECTIONS ====
  resumeData.sections.forEach((section) => {
    // Check if section has any content
    const hasContent = Object.entries(section.content).some(([key, bullets]) => {
      return key && bullets && bullets.length > 0 && bullets.some(bullet => bullet.trim() !== '')
    })

    // Skip sections with no content
    if (!hasContent) {
      return
    }

    if (y < 60) {
      page = pdfDoc.addPage([595.28, 841.89])
      y = height - 50
    }

    // Section Title
    drawText(section.title.toUpperCase(), margin, fontBold, 12, lightGray)
    y -= 4
    page.drawLine({
      start: { x: margin, y },
      end: { x: page.getWidth() - margin, y },
      thickness: 0.5,
      color: lightGray
    })
    y -= 14

    // Section Content
    Object.entries(section.content).forEach(([header, bullets]) => {
      // Skip empty keys or empty bullet arrays
      if (!header || !bullets || bullets.length === 0) {
        return
      }

      // Check if bullets have actual content
      const hasBulletContent = bullets.some(bullet => bullet.trim() !== '')
      if (!hasBulletContent) {
        return
      }

      const [role, date] = header.split(" | ")

      if (role && role.trim() !== '') {
        drawText(role, margin, fontBold, 10)
        if (date && date.trim() !== '') {
          const dateWidth = fontRegular.widthOfTextAtSize(date, 9)
          page.drawText(date, {
            x: page.getWidth() - margin - dateWidth,
            y,
            size: 9,
            font: fontRegular,
            color: lightGray
          })
        }
        y -= lineHeight
      }

      bullets.forEach((bullet) => {
        // Skip empty bullets
        if (!bullet || bullet.trim() === '') {
          return
        }

        const bulletText = `• ${bullet}`
        const wrapped = wrapText(bulletText, 80)
        wrapped.forEach((line) => {
          drawText(line, margin + 10, fontRegular, 9)
          y -= lineHeight
        })
      })

      y -= 6
    })

    y -= 8
  })

  // Save & Download PDF
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  words.forEach((word) => {
    if ((current + word).length > maxChars) {
      lines.push(current.trim())
      current = word + " "
    } else {
      current += word + " "
    }
  })
  if (current.trim()) lines.push(current.trim())
  return lines
}
