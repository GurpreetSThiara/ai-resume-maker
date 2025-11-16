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
  draw(resumeData.basics.name, margin, 22, bold, text)
  y -= 16
  draw([resumeData.basics.email, resumeData.basics.phone, resumeData.basics.location].filter(Boolean).join(" | "), margin, 9, regular, secondary)
  y -= 18

  for (const section of resumeData.sections) {
    if (y < 70) {
      page = pdfDoc.addPage([595.28, 841.89])
      y = height - margin
    }
    draw(section.title.toUpperCase(), margin, 11, bold, accent)
    y -= 12

    switch (section.type) {
      case "education":
        section.items.forEach((edu) => {
          draw(edu.institution, margin, 10, bold)
          const eduDates = `${edu.startDate} - ${edu.endDate}`
          const dateWidth = regular.widthOfTextAtSize(eduDates, 9)
          page.drawText(eduDates, { x: width - margin - dateWidth, y, size: 9, font: regular, color: secondary })
          y -= 12

          draw(edu.degree, margin, 9, regular)
          y -= 12

          if (edu.highlights) {
            edu.highlights.forEach((highlight) => {
              const lines = wrapText(`• ${highlight}`, 86)
              for (const line of lines) {
                draw(line, margin + 10, 9)
                y -= 12
              }
            })
          }
          y -= 6
        })
        break

      case "experience":
        section.items.forEach((exp) => {
          draw(exp.company, margin, 10, bold)
          const expDates = `${exp.startDate} - ${exp.endDate}`
          const dateWidth = regular.widthOfTextAtSize(expDates, 9)
          page.drawText(expDates, { x: width - margin - dateWidth, y, size: 9, font: regular, color: secondary })
          y -= 12

          draw(exp.role, margin, 9, regular)
          y -= 12

          if (exp.achievements) {
            exp.achievements.forEach((achievement) => {
              const lines = wrapText(`• ${achievement}`, 86)
              for (const line of lines) {
                draw(line, margin + 10, 9)
                y -= 12
              }
            })
          }
          y -= 6
        })
        break

      case "skills":
      case "languages":
      case "certifications":
        const itemsText = section.items.join(", ")
        const lines = wrapText(itemsText, 86)
        for (const line of lines) {
          draw(line, margin, 9)
          y -= 12
        }
        break

      case "projects":
        if ((section as any).items && (section as any).items.length) {
          for (const proj of (section as any).items) {
            // Project name
            draw(proj.name || "", margin, 12, bold, text)
            y -= 16
            // Links row
            let linksRow = ''
            if (proj.link) linksRow += 'Link:'
            if (proj.link) linksRow += ` ${proj.link}`
            if (proj.link && proj.repo) linksRow += '  |  '
            if (proj.repo) linksRow += 'GitHub:'
            if (proj.repo) linksRow += ` ${proj.repo}`
            if (linksRow) {
              const linkLines = wrapText(linksRow, 95)
              for (const line of linkLines) {
                draw(line, margin, 9, regular, accent)
                y -= 11
              }
            }
            // Descriptions
            if (Array.isArray(proj.description) && proj.description.length) {
              for (const d of proj.description) {
                const descLines = wrapText(`- ${d}`, 85)
                for (const line of descLines) {
                  draw(line, margin + 14, 9, regular, secondary)
                  y -= 12
                }
              }
            }
            y -= 16
          }
        }
        break;

      case "custom":
        section.content.forEach((item) => {
          const lines = wrapText(`• ${item}`, 86)
          for (const line of lines) {
            draw(line, margin + 10, 9)
            y -= 12
          }
        })
        break
    }
    y -= 8
  }

  // Custom Information
  const customEntries = Object.entries(resumeData.custom || {})
  if (customEntries.length > 0) {
    if (y < 70) {
      page = pdfDoc.addPage([595.28, 841.89])
      y = height - margin
    }
    draw("CUSTOM INFORMATION", margin, 11, bold, accent)
    y -= 12

    for (const [key, item] of customEntries) {
      if (item.hidden) continue
      const lines = wrapText(`${item.title}: ${item.content}`, 86)
      for (const line of lines) {
        draw(line, margin, 9, regular, text)
        y -= 12
      }
    }
    y -= 8
  }

  const bytes = await pdfDoc.save()
  const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" })
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


