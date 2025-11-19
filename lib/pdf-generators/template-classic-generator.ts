import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { sanitizeTextForPdf } from "@/lib/utils"
import { drawProjectsSection } from '@/lib/pdf/sections/projects'

export async function generateClassic2ResumePDF({ resumeData, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([595.276, 841.89]) // A4

  // Fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Layout settings
  let yOffset = 800
  const margin = 50
  const pageWidth = 595.276 - 2 * margin

  const textColor = rgb(0, 0, 0) // Pure black for ATS
  const secondaryColor = rgb(0.3, 0.3, 0.3) // Dark gray for metadata

  // Utility: Page break when space runs out
  const ensureSpace = (spaceNeeded: number) => {
    if (yOffset - spaceNeeded < margin) {
      currentPage = pdfDoc.addPage([595.276, 841.89])
      yOffset = 800
    }
  }

  // Utility: Text wrapping
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

  // Utility: Draw text
  const draw = (t: string, x: number, size: number, font = regularFont, color = textColor) => {
    currentPage.drawText(sanitizeTextForPdf(t || ""), { x, y: yOffset, size, font, color })
  }

  // === HEADER ===
  draw(resumeData.basics.name, margin, 22, boldFont, textColor)
  yOffset -= 30

  if (resumeData.basics.email) {
    draw(resumeData.basics.email, margin, 11, regularFont, textColor)
    yOffset -= 14
  }
  if (resumeData.basics.phone) {
    draw(resumeData.basics.phone, margin, 11, regularFont, textColor)
    yOffset -= 14
  }
  if (resumeData.basics.location) {
    draw(resumeData.basics.location, margin, 11, regularFont, textColor)
    yOffset -= 14
  }
  if (resumeData.basics.linkedin) {
    draw(resumeData.basics.linkedin, margin, 11, regularFont, textColor)
    yOffset -= 20
  }

  // === SUMMARY ===
  if (resumeData.basics.summary) {
    const lines = wrapText(resumeData.basics.summary, pageWidth, regularFont, 11)
    for (const line of lines) {
      draw(line, margin, 11, regularFont, textColor)
      yOffset -= 14
    }
    yOffset -= 10
  }

  // === CUSTOM FIELDS (Flex Layout) ===
  const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]) => !item.hidden);
  if (customEntries.length > 0) {
    const items = customEntries.map(([key, item]) => {
      const keyText = `${item.title}:`;
      const keyWidth = boldFont.widthOfTextAtSize(keyText, 11);
      const content = sanitizeTextForPdf(item.content);
      const maxContentWidth = Math.min(250, pageWidth - keyWidth - 15);
      const wrappedLines = wrapText(content, maxContentWidth, regularFont, 11);
      const actualContentWidth = Math.max(...wrappedLines.map(line => regularFont.widthOfTextAtSize(line, 11)));
      return {
        key, item,
        width: keyWidth + actualContentWidth + 10,
        height: wrappedLines.length * 14,
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
      ensureSpace(rowHeight + 10);
      const totalItemsWidth = row.reduce((sum, item) => sum + item.width, 0);
      const extraGap = row.length > 1 ? (pageWidth - totalItemsWidth) / (row.length - 1) : 0;
      let currentX = margin;

      for (const item of row) {
        const keyText = `${item.item.title}:`;
        draw(keyText, currentX, 11, boldFont, textColor);
        item.wrappedLines.forEach((line: string, lineIndex: number) => {
          currentPage.drawText(sanitizeTextForPdf(line), { x: currentX + item.keyWidth + 5, y: yOffset - (lineIndex * 14), size: 11, font: regularFont, color: textColor });
        });
        currentX += item.width + extraGap;
      }
      yOffset -= rowHeight + 8;
    }
    yOffset -= 10;
  }

  // === SECTIONS ===
  for (const section of resumeData.sections) {
    ensureSpace(30)

    // Section header
    draw(section.title.toUpperCase(), margin, 13, boldFont, textColor)
    yOffset -= 20

    switch (section.type) {
      case "experience":
        for (const exp of section.items) {
          ensureSpace(50)

          // Company + dates
          draw(exp.company, margin, 12, boldFont, textColor)
          const dateText = `${exp.startDate} - ${exp.endDate}`
          const dateWidth = regularFont.widthOfTextAtSize(dateText, 10)
          draw(dateText, margin + pageWidth - dateWidth, 10, regularFont, secondaryColor)
          yOffset -= 14

          // Role
          if (exp.role) {
            draw(exp.role, margin, 11, regularFont, textColor)
            yOffset -= 14
          }

          // Location
          if (exp.location) {
            draw(exp.location, margin, 10, regularFont, secondaryColor)
            yOffset -= 14
          }

          // Achievements
          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              ensureSpace(12)
              const lines = wrapText(`- ${achievement}`, pageWidth - 20, regularFont, 10)
              for (const line of lines) {
                draw(line, margin + 15, 10, regularFont, textColor)
                yOffset -= 12
              }
            }
          }
          yOffset -= 16
        }
        break

      case "education":
        for (const edu of section.items) {
          ensureSpace(50)

          draw(edu.institution, margin, 12, boldFont, textColor)
          const dateText = `${edu.startDate} - ${edu.endDate}`
          const dateWidth = regularFont.widthOfTextAtSize(dateText, 10)
          draw(dateText, margin + pageWidth - dateWidth, 10, regularFont, secondaryColor)
          yOffset -= 14

          if (edu.degree) {
            draw(edu.degree, margin, 11, regularFont, textColor)
            yOffset -= 14
          }
          if (edu.location) {
            draw(edu.location, margin, 10, regularFont, secondaryColor)
            yOffset -= 14
          }

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              ensureSpace(12)
              const lines = wrapText(`- ${highlight}`, pageWidth - 20, regularFont, 10)
              for (const line of lines) {
                draw(line, margin + 15, 10, regularFont, textColor)
                yOffset -= 12
              }
            }
          }
          yOffset -= 16
        }
        break

      case "skills":
      case "languages":
      case "certifications":
        if (section.items?.length) {
          const lines = wrapText(section.items.join(", "), pageWidth - 20, regularFont, 10)
          for (const line of lines) {
            draw(line, margin + 15, 10, regularFont, textColor)
            yOffset -= 12
          }
          yOffset -= 16
        }
        break

      case "custom":
        if (section.content?.length) {
          for (const text of section.content) {
            const lines = wrapText(`- ${text}`, pageWidth - 20, regularFont, 10)
            for (const line of lines) {
              draw(line, margin + 15, 10, regularFont, textColor)
              yOffset -= 12
            }
          }
          yOffset -= 16
        }
        break

      case "projects":
        case "projects":
  if (section.items && section.items.length) {
    for (const proj of section.items) {
      ensureSpace(40);

      // Project title
      const title = proj.name || "";
      currentPage.drawText(title, {
        x: margin,
        y: yOffset,
        size: 13,
        font: boldFont,
        color: textColor,
      });
      let cursorX = margin + boldFont.widthOfTextAtSize(title, 13) + 8;

      // Links (if present)
      if (proj.link || proj.repo) {
        const parts = [];
        if (proj.link) parts.push("Link");
        if (proj.repo) parts.push("GitHub");
        if (parts.length) {
          const linksText = parts.join("  |  ");
          currentPage.drawText(linksText, {
            x: cursorX,
            y: yOffset,
            size: 9,
            font: regularFont,
            color: rgb(0,0,0.66),
          });
        }
      }

      yOffset -= 19; // Space below title + links

      // Description bullets (if any)
      if (Array.isArray(proj.description) && proj.description.length) {
        for (const d of proj.description) {
          const bullet = "• ";
          const indentX = margin + 16;
          const maxWidth = pageWidth - 26;
          const lines = wrapText(`${bullet}${d}`, maxWidth, regularFont, 10);
          for (const line of lines) {
            ensureSpace(12);
            currentPage.drawText(line, {
              x: indentX,
              y: yOffset,
              size: 10,
              font: regularFont,
              color: secondaryColor,
            });
            yOffset -= 12;
          }
        }
      }

      yOffset -= 14; // Space after each project
    }
  }
  break;

;
    }
  }

  // === SAVE PDF ===
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
