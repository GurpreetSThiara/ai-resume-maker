import { PDFDocument, PDFPage, rgb, StandardFonts } from "@pdfme/pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { sanitizeTextForPdf } from '../utils'
import { wrapText } from '../pdf-utils'


export async function generateElegantResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89])
  const { height, width } = page.getSize()

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const margin = 50
  let y = height - margin
  const text = rgb(0.12, 0.12, 0.12)
  const secondary = rgb(0.45, 0.45, 0.45)
  const accent = rgb(0.36, 0.2, 0.8)

  const draw = (t: string, x: number, size: number, font = regular, color = text) => {
    page.drawText(sanitizeTextForPdf(t || ""), { x, y, size, font, color })
  }

  // Name & contact
  draw(resumeData.name, margin, 24, bold, accent)
  const contactParts = [resumeData.email, resumeData.phone, resumeData.location, resumeData.linkedin].filter(Boolean).map(s => String(s))
  if (contactParts.length > 0) {
    const contactText = contactParts.join(" | ")
    const contactLines = wrapText(contactText, width - 2 * margin - 200, regular, 10) // Leave space for name
    for (let i = 0; i < contactLines.length; i++) {
      const line = contactLines[i]
      const lw = regular.widthOfTextAtSize(line, 10)
      page.drawText(line, { x: width - margin - lw, y: y - (i * 12), size: 10, font: regular, color: secondary })
    }
    y -= (contactLines.length - 1) * 12
  }
  y -= 24


  // custom
  for (const item of Object.values(resumeData.custom)) {
    if (item.hidden) continue
    draw(`${item.title.toUpperCase()}: ${item.content}`, margin, 10, regular, text)
    y -= 12
  }

  y -= 6

  for (const section of resumeData.sections) {
    // Check if section has any content (only for additional sections with content property)
    const hasContent = 'content' in section && 
                      typeof section.content === 'object' && 
                      section.content !== null &&
                      Object.entries(section.content).some(([key, bullets]) => {
                        return key && Array.isArray(bullets) && bullets.length > 0 && bullets.some(bullet => typeof bullet === 'string' && bullet.trim() !== '')
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
    page.drawLine({ start: { x: margin, y: y - 3 }, end: { x: width - margin, y: y - 3 }, thickness: 0.5, color: secondary })
    y -= 14

    for (const [header, bullets] of Object.entries('content' in section ? section.content || {} : {})) {
      // Skip empty keys or empty bullet arrays
      if (!header || !Array.isArray(bullets) || bullets.length === 0) {
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
      switch (section.title.toLowerCase()) {
        case "projects":
          if ((section as any).items && (section as any).items.length) {
            for (const proj of (section as any).items) {
              draw(proj.name || "", margin, 12, bold, accent)
              y -= 14
              // Links row
              let linksRow = ''
              if (proj.link) linksRow += 'Link:'
              if (proj.link) linksRow += ` ${proj.link}`
              if (proj.link && proj.repo) linksRow += '  |  '
              if (proj.repo) linksRow += 'GitHub:'
              if (proj.repo) linksRow += ` ${proj.repo}`
              if (linksRow) {
                const linkLines = wrapTextLocal(linksRow, width - 2 * margin, regular, 9)

                for (const line of linkLines) {
                  draw(line, margin, 9, regular, rgb(0.22,0.3,0.75))
                  y -= 10
                }
              }
              // Descriptions
              if (Array.isArray(proj.description) && proj.description.length) {
                for (const d of proj.description) {
                  const descLines = wrapTextLocal(`- ${d}`, width - 2 * margin - 20, regular, 9)

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
        default:
          for (const b of bullets) {
            // Skip empty bullets
            if (!b || b.trim() === '') {
              continue
            }

            const lines = wrapTextLocal(`• ${b}`, width - 2 * margin - 10, regular, 9)

            for (const line of lines) {
              draw(line, margin + 10, 9)
              y -= 12
            }
          }
          y -= 6
          break;
      }
    }
    y -= 8
  }

  const bytes = await pdfDoc.save()
  return bytes
}

function wrapTextLocal(text: string, maxWidth: number, font: any, fontSize: number) {
  return wrapText(text, maxWidth, font, fontSize)
}



