import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { ResumeData } from '@/types/resume'
import { sanitizeTextForPdf } from '@/lib/utils'

export async function generateCreativeResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89])
  const { height, width } = page.getSize()

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const margin = 50
  let y = height - margin
  const text = rgb(0.1, 0.1, 0.1)
  const secondary = rgb(0.42, 0.42, 0.42)
  const accent = rgb(0.2, 0.5, 0.85)

  const draw = (t: string, x: number, size: number, font = regular, color = text) => {
    page.drawText(sanitizeTextForPdf(t || ""), { x, y, size, font, color })
  }

  // Name with accent bar
  page.drawRectangle({ x: margin, y: y - 4, width: width - 2 * margin, height: 3, color: accent })
  y -= 10
  draw(resumeData.name, margin, 22, bold, text)
  y -= 16
  draw([resumeData.email, resumeData.phone, resumeData.location].filter(Boolean).join(" | "), margin, 9, regular, secondary)
  y -= 18

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
          const dw = regular.widthOfTextAtSize(date, 9)
          page.drawText(date, { x: width - margin - dw, y, size: 9, font: regular, color: secondary })
        }
        y -= 12
      }
      for (const b of bullets) {
        // Skip empty bullets
        if (!b || b.trim() === '') {
          continue
        }

        const lines = wrapText(`• ${b}`, 86)
        for (const line of lines) {
          draw(line, margin + 10, 9)
          y -= 12
        }
      }
      y -= 6
    }
    y -= 8
  }

  // custom
  for (const item of Object.values(resumeData.custom)) {
    if (item.hidden) continue
    draw(`${item.title.toUpperCase()}: ${item.content}`, margin, 9, regular, text)
    y -= 10
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


