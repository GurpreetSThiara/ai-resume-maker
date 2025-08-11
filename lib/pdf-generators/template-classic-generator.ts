import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { ResumeData } from '@/types/resume'
import { sanitizeTextForPdf } from '@/lib/utils'

export async function generateClassicResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89])
  const { height, width } = page.getSize()

  const regular = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  const margin = 50
  let y = height - margin
  const text = rgb(0.1, 0.1, 0.1)
  const secondary = rgb(0.4, 0.4, 0.4)

  const draw = (t: string, x: number, size: number, font = regular, color = text) => {
    page.drawText(sanitizeTextForPdf(t || ""), { x, y, size, font, color })
  }

  draw(resumeData.name, margin, 22, bold)
  y -= 18
  draw([resumeData.email, resumeData.phone, resumeData.location, resumeData.linkedin].filter(Boolean).join(" | "), margin, 10, regular, secondary)
  y -= 20

  Object.values(resumeData.custom).forEach((item) => {
    if (item.hidden) return
    draw(`${item.title.toUpperCase()}: ${item.content}`, margin, 10, regular, text)
    y -= 12
  })

  y -= 8

  for (const section of resumeData.sections) {
    // Check if section has any content
    const hasContent = Object.entries(section.content).some(([key, bullets]) => {
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
    draw(section.title.toUpperCase(), margin, 12, bold, secondary)
    y -= 14

    for (const [header, bullets] of Object.entries(section.content)) {
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

        const lines = wrapText(`• ${b}`, 80)
        for (const line of lines) {
          draw(line, margin + 10, 9, regular)
          y -= 12
        }
      }
      y -= 6
    }
    y -= 8
  }

  const bytes = await pdfDoc.save()
  const blob = new Blob([bytes], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const w of words) {
    if ((current + w).length > maxChars) {
      lines.push(current.trim())
      current = w + " "
    } else {
      current += w + " "
    }
  }
  if (current.trim()) lines.push(current.trim())
  return lines
}


