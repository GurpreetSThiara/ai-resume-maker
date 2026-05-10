import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { PDFGenerationOptions } from "@/types/resume"
import { sanitizeTextForPdf, wrapText } from '@/lib/utils'


export async function generateCompactResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89])
  const { height, width } = page.getSize()

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const margin = 50
  let y = height - margin
  const text = rgb(0.1, 0.1, 0.1)
  const secondary = rgb(0.4, 0.4, 0.4)
  const accent = rgb(0.2, 0.4, 0.8)

  const draw = (t: string, x: number, size: number, font = regular, color = text) => {
    page.drawText(sanitizeTextForPdf(t || ""), { x, y, size, font, color })
  }

  // Name
  draw(resumeData.name, margin, 20, bold, accent)
  y -= 18

  // Contact Info
  const contactParts = [resumeData.email, resumeData.phone, resumeData.location, resumeData.linkedin].filter(Boolean).map(s => String(s))
  if (contactParts.length > 0) {
    const contactInfo = contactParts.join(" | ")
    const contactLines = wrapTextLocal(contactInfo, width - 2 * margin, regular, 9)
    for (const line of contactLines) {
      draw(line, margin, 9, regular, secondary)
      y -= 11
    }
  }
  y -= 9


  // Additional Links or Data
  Object.values(resumeData.custom).forEach((item) => {
    if (item.hidden) return
    draw(`${item.title}: ${item.content}`, margin, 9, regular, text)
    y -= 12
  })

  y -= 8

  // Sections
  for (const section of resumeData.sections) {
    // Check if section has any content
    const hasContent = Object.entries(section?.content ?? {}).some(([key, bullets]) => {
      return key && bullets && bullets.length > 0 && bullets.some(bullet => bullet.trim() !== '')
    })

    // Skip sections with no content
    if (!hasContent) {
      continue
    }

    if (y < 70) {
      page = pdfDoc.addPage([595.28, 841.89])
      y = height - margin
    }

    // Section Title
    draw(section.title.toUpperCase(), margin, 11, bold, accent)
    y -= 12

    for (const [header, bullets] of Object.entries(section?.content ?? {})) {
      // Skip empty keys or empty bullet arrays
      if (!header || !bullets || bullets.length === 0) {
        continue
      }

      // Check if bullets have actual content
      const hasBulletContent = bullets.some(bullet => bullet.trim() !== '')
      if (!hasBulletContent) {
        continue
      }

      const [role, date] = header.split(" | ")
      if (role && role.trim() !== '') {
        draw(role, margin, 10, bold)
        if (date && date.trim() !== '') {
          const w = regular.widthOfTextAtSize(date, 9)
          page.drawText(date, { x: width - margin - w, y, size: 9, font: regular, color: secondary })
        }
        y -= 12
      }

      for (const b of bullets) {
        // Skip empty bullets
        if (!b || b.trim() === '') {
          continue
        }

        const lines = wrapTextLocal(`• ${b}`, width - 2 * margin - 10, regular, 9)

        for (const line of lines) {
          draw(line, margin + 10, 9, regular)
          y -= 12
        }
      }
      y -= 4
    }
    y -= 6
  }

  const bytes = await pdfDoc.save()
  return bytes
}

function wrapTextLocal(text: string, maxWidth: number, font: any, fontSize: number) {
  return wrapText(text, maxWidth, font, fontSize)
}

