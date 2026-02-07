import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { ResumeData } from '@/types/resume'
import { sanitizeTextForPdf } from '@/lib/utils'
import { getEffectiveSkillGroupsFromSection } from '@/utils/skills'

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
  drawText(resumeData.basics.name, margin, fontBold, 22)

  const contactText = [
    resumeData.basics.email,
    resumeData.basics.phone,
    resumeData.basics.location,
    resumeData.basics.linkedin
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

  // ==== CUSTOM FIELDS (Flex Layout) ====
  const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]) => !item.hidden);
  if (customEntries.length > 0) {
    const pageWidth = page.getWidth() - 2 * margin;
    const items = customEntries.map(([key, item]) => {
      const keyText = `${item.title}:`;
      const keyWidth = fontBold.widthOfTextAtSize(keyText, 9);
      const content = sanitizeTextForPdf(item.content);
      const maxContentWidth = Math.min(250, pageWidth - keyWidth - 15);
      const wrappedLines = wrapText(content, Math.floor(maxContentWidth / (fontRegular.widthOfTextAtSize('a', 9))));
      const actualContentWidth = Math.max(...wrappedLines.map(line => fontRegular.widthOfTextAtSize(line, 9)));
      return {
        key, item, 
        width: keyWidth + actualContentWidth + 10,
        height: wrappedLines.length * lineHeight,
        keyWidth,
        wrappedLines
      };
    });

    const rows: any[][] = [];
    let currentRow: any[] = [];
    let currentRowWidth = 0;
    const minGap = 20;

    for (const item of items) {
      if (currentRowWidth + item.width + minGap <= pageWidth) {
        currentRow.push(item);
        currentRowWidth += item.width + minGap;
      } else {
        rows.push(currentRow);
        currentRow = [item];
        currentRowWidth = item.width + minGap;
      }
    }
    if (currentRow.length > 0) rows.push(currentRow);

    for (const row of rows) {
      const rowHeight = Math.max(...row.map(item => item.height));
      if (y - rowHeight < margin) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - margin;
      }
      const totalItemsWidth = row.reduce((sum, item) => sum + item.width, 0);
      const extraGap = row.length > 1 ? (pageWidth - totalItemsWidth) / (row.length - 1) : 0;
      let currentX = margin;

      for (const item of row) {
        const keyText = `${item.item.title}:`;
        page.drawText(keyText, { x: currentX, y, size: 9, font: fontBold, color: lightGray });
        item.wrappedLines.forEach((line: string, lineIndex: number) => {
          page.drawText(line, { x: currentX + item.keyWidth + 5, y: y - (lineIndex * lineHeight), size: 9, font: fontRegular, color: gray });
        });
        currentX += item.width + extraGap;
      }
      y -= rowHeight + 8;
    }
    y -= 10;
  }

  // ==== SECTIONS ====
  resumeData.sections.forEach((section) => {
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
      color: lightGray,
    })
    y -= 14

    // Section Content
    switch (section.type) {
      case "education":
        section.items.forEach((edu) => {
          drawText(edu.institution, margin, fontBold, 10)
          const eduDates = `${edu.startDate} - ${edu.endDate}`
          const dateWidth = fontRegular.widthOfTextAtSize(eduDates, 9)
          page.drawText(eduDates, {
            x: page.getWidth() - margin - dateWidth,
            y,
            size: 9,
            font: fontRegular,
            color: lightGray,
          })
          y -= lineHeight

          drawText(edu.degree, margin, fontRegular, 9)
          y -= lineHeight

          if (edu.highlights) {
            edu.highlights.forEach((highlight) => {
              const bulletText = `• ${highlight}`
              const wrapped = wrapText(bulletText, 80)
              wrapped.forEach((line) => {
                drawText(line, margin + 10, fontRegular, 9)
                y -= lineHeight
              })
            })
          }
          y -= 6
        })
        break

      case "experience":
        section.items.forEach((exp) => {
          drawText(exp.company, margin, fontBold, 10)
          const expDates = `${exp.startDate} - ${exp.endDate}`
          const dateWidth = fontRegular.widthOfTextAtSize(expDates, 9)
          page.drawText(expDates, {
            x: page.getWidth() - margin - dateWidth,
            y,
            size: 9,
            font: fontRegular,
            color: lightGray,
          })
          y -= lineHeight

          drawText(exp.role, margin, fontRegular, 9)
          y -= lineHeight

          if (exp.achievements) {
            exp.achievements.forEach((achievement) => {
              const bulletText = `• ${achievement}`
              const wrapped = wrapText(bulletText, 80)
              wrapped.forEach((line) => {
                drawText(line, margin + 10, fontRegular, 9)
                y -= lineHeight
              })
            })
          }
          y -= 6
        })
        break

      case "skills": {
        const groups = getEffectiveSkillGroupsFromSection(section)
        const visibleGroups = groups.filter(g => g.skills.length > 0)
        
        if (visibleGroups.length > 0) {
          for (const group of visibleGroups) {
            // Draw bold title
            const titleText = `${group.title}: ` // Add a space after the colon
            drawText(titleText, margin, fontBold, 9)

            // Draw skills on the same line with regular font
            const skillsText = group.skills.join(', ')
            const skillsX = margin + fontBold.widthOfTextAtSize(titleText, 9)
            const skillsWrapped = wrapText(skillsText, 80 - fontBold.widthOfTextAtSize(titleText, 9))
            
            if (skillsWrapped.length > 0) {
              // Draw the first line of skills on the same line as the title
              drawText(skillsWrapped[0], skillsX, fontRegular, 9)
              y -= lineHeight

              // Draw subsequent lines of skills below, indented
              for (let i = 1; i < skillsWrapped.length; i++) {
                drawText(skillsWrapped[i], skillsX, fontRegular, 9)
                y -= lineHeight
              }
            } else {
              y -= lineHeight // If no skills, still move down one line for consistency
            }
            
            y -= lineHeight * 0.5 // Small spacing between groups
          }
        }
        break
      }

      case "languages":
      case "certifications":
        const itemsText = section.items.join(", ")
        const wrapped = wrapText(itemsText, 80)
        wrapped.forEach((line) => {
          drawText(line, margin, fontRegular, 9)
          y -= lineHeight
        })
        break

      case "custom":
        section.content.forEach((item) => {
          const bulletText = `• ${item}`
          const wrapped = wrapText(bulletText, 80)
          wrapped.forEach((line) => {
            drawText(line, margin + 10, fontRegular, 9)
            y -= lineHeight
          })
        })
        break

      case "projects":
        const projSection = section as any;
        if (projSection.items && projSection.items.length) {
          for (const proj of projSection.items) {
            // Project name
            drawText(proj.name || "", margin, fontBold, 12)
            y -= 15

            // Links row (blue, small, piped)
            let linksRow = ''
            if (proj.link) linksRow += 'Link:'
            if (proj.link) linksRow += ` ${proj.link}`
            if (proj.link && proj.repo) linksRow += '  |  '
            if (proj.repo) linksRow += 'GitHub:'
            if (proj.repo) linksRow += ` ${proj.repo}`
            if (linksRow) {
              const linkLines = wrapText(linksRow, 80)
              for (const line of linkLines) {
                page.drawText(line, { x: margin, y, size: 9, font: fontRegular, color: rgb(0,0,0.7) })
                y -= 12
              }
            }

            // Descriptions (dashes, gray, indented)
            if (Array.isArray(proj.description) && proj.description.length) {
              for (const d of proj.description) {
                const descLines = wrapText(`- ${d}`, 76)
                for (const line of descLines) {
                  page.drawText(line, { x: margin + 15, y, size: 9, font: fontRegular, color: lightGray })
                  y -= 12
                }
              }
            }
            y -= 16; // space between projects
          }
        }
        break;
    }

    y -= 8
  })

  // Save & Download PDF
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
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
