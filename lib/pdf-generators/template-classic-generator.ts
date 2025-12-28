import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { sanitizeTextForPdf, sanitizeTextForPdfWithFont } from "@/lib/utils"
import { drawProjectsSection } from '@/lib/pdf/sections/projects'
import { getSectionsForRendering } from "@/utils/sectionOrdering"

export async function generateClassic2ResumePDF({ 
  resumeData, 
  filename = "resume.pdf",
  variant = "default"
}: PDFGenerationOptions & { variant?: "default" | "compact" }) {
  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([595.276, 841.89]) // A4

  // Fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Layout settings
  let yOffset = 800
  const isCompact = variant === "compact"
  const margin = isCompact ? 35 : 50  // Even smaller margins for compact
  const pageWidth = 595.276 - 2 * margin

  const textColor = rgb(0, 0, 0) // Pure black for ATS
  const secondaryColor = rgb(0.3, 0.3, 0.3) // Dark gray for metadata

  const sanitizeForFont = (text: string, font = regularFont): string => {
    return sanitizeTextForPdfWithFont(text || "", font)
  }

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
      const testText = currentLine + " " + word
      const safeTestText = sanitizeForFont(testText, font)
      const width = font.widthOfTextAtSize(safeTestText, size)
      if (width < maxWidth) {
        currentLine += (currentLine ? " " : "") + word
      } else {
        if (currentLine) {
          lines.push(sanitizeForFont(currentLine, font))
        }
        currentLine = word
      }
    })
    if (currentLine) {
      lines.push(sanitizeForFont(currentLine, font))
    }
    return lines
  }

  // Utility: Draw text
  const draw = (t: string, x: number, size: number, font = regularFont, color = textColor) => {
    if (!t) return
    // Text is already sanitized if coming from wrapText, but sanitize anyway for safety
    const safe = sanitizeForFont(t, font)
    if (!safe) return
    currentPage.drawText(safe, { x, y: yOffset, size, font, color })
  }

  // === HEADER ===
  draw(resumeData.basics.name, margin, isCompact ? 18 : 22, boldFont, textColor)
  yOffset -= isCompact ? 20 : 30

  if (resumeData.basics.email) {
    draw(resumeData.basics.email, margin, isCompact ? 9 : 11, regularFont, textColor)
    yOffset -= isCompact ? 10 : 14
  }
  if (resumeData.basics.phone) {
    draw(resumeData.basics.phone, margin, isCompact ? 9 : 11, regularFont, textColor)
    yOffset -= isCompact ? 10 : 14
  }
  if (resumeData.basics.location) {
    draw(resumeData.basics.location, margin, isCompact ? 9 : 11, regularFont, textColor)
    yOffset -= isCompact ? 10 : 14
  }
  if (resumeData.basics.linkedin) {
    draw(resumeData.basics.linkedin, margin, isCompact ? 9 : 11, regularFont, textColor)
    yOffset -= isCompact ? 12 : 20
  }

  // === SUMMARY ===
  if (resumeData.basics.summary) {
    const lines = wrapText(resumeData.basics.summary, pageWidth, regularFont, isCompact ? 9 : 11)
    for (const line of lines) {
      draw(line, margin, isCompact ? 9 : 11, regularFont, textColor)
      yOffset -= isCompact ? 10 : 14
    }
    yOffset -= isCompact ? 6 : 10
  }

  // === SECTIONS (including custom fields in order) ===
  const orderedSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
  
  for (const section of orderedSections) {
    // Handle Custom Fields Section
    if (section.type === 'custom-fields') {
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
              const safeLine = sanitizeForFont(line, regularFont)
              if (!safeLine) return
              currentPage.drawText(safeLine, { x: currentX + item.keyWidth + 5, y: yOffset - (lineIndex * 14), size: 11, font: regularFont, color: textColor });
            });
            currentX += item.width + extraGap;
          }
          yOffset -= rowHeight + 8;
        }
        yOffset -= 10;
      }
      continue; // Skip to next section
    }
    
    // Regular sections
    ensureSpace(isCompact ? 20 : 30)

    // Section header
    draw(section.title.toUpperCase(), margin, isCompact ? 11 : 13, boldFont, textColor)
    yOffset -= isCompact ? 12 : 20

    switch (section.type) {
      case "experience":
        for (const exp of section.items) {
          ensureSpace(isCompact ? 35 : 50)

          // Company + dates
          draw(exp.company, margin, isCompact ? 10 : 12, boldFont, textColor)
          const dateText = `${exp.startDate} - ${exp.endDate}`
          const dateWidth = regularFont.widthOfTextAtSize(dateText, isCompact ? 8 : 10)
          draw(dateText, margin + pageWidth - dateWidth, isCompact ? 8 : 10, regularFont, secondaryColor)
          yOffset -= isCompact ? 10 : 14

          // Role
          if (exp.role) {
            draw(exp.role, margin, isCompact ? 9 : 11, regularFont, textColor)
            yOffset -= isCompact ? 10 : 14
          }

          // Location
          if (exp.location) {
            draw(exp.location, margin, isCompact ? 8 : 10, regularFont, secondaryColor)
            yOffset -= isCompact ? 10 : 14
          }

          // Achievements
          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              ensureSpace(isCompact ? 8 : 12)
              const lines = wrapText(`- ${achievement}`, pageWidth - 20, regularFont, isCompact ? 8 : 10)
              for (const line of lines) {
                draw(line, margin + 15, isCompact ? 8 : 10, regularFont, textColor)
                yOffset -= isCompact ? 8 : 12
              }
            }
          }
          yOffset -= isCompact ? 8 : 16
        }
        break

      case "education":
        for (const edu of section.items) {
          ensureSpace(isCompact ? 35 : 50)

          draw(edu.institution, margin, isCompact ? 10 : 12, boldFont, textColor)
          const dateText = `${edu.startDate} - ${edu.endDate}`
          const dateWidth = regularFont.widthOfTextAtSize(dateText, isCompact ? 8 : 10)
          draw(dateText, margin + pageWidth - dateWidth, isCompact ? 8 : 10, regularFont, secondaryColor)
          yOffset -= isCompact ? 10 : 14

          if (edu.degree) {
            draw(edu.degree, margin, isCompact ? 9 : 11, regularFont, textColor)
            yOffset -= isCompact ? 10 : 14
          }
          if (edu.location) {
            draw(edu.location, margin, isCompact ? 8 : 10, regularFont, secondaryColor)
            yOffset -= isCompact ? 10 : 14
          }

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              ensureSpace(isCompact ? 8 : 12)
              const lines = wrapText(`- ${highlight}`, pageWidth - 20, regularFont, isCompact ? 8 : 10)
              for (const line of lines) {
                draw(line, margin + 15, isCompact ? 8 : 10, regularFont, textColor)
                yOffset -= isCompact ? 8 : 12
              }
            }
          }
          yOffset -= isCompact ? 8 : 16
        }
        break

      case "skills":
      case "languages":
      case "certifications":
        if (section.items?.length) {
          const lines = wrapText(section.items.join(", "), pageWidth - 20, regularFont, isCompact ? 8 : 10)
          for (const line of lines) {
            draw(line, margin + 15, isCompact ? 8 : 10, regularFont, textColor)
            yOffset -= isCompact ? 8 : 12
          }
          yOffset -= isCompact ? 12 : 16
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
        if (section.items && section.items.length) {
          for (const proj of section.items) {
            ensureSpace(isCompact ? 35 : 40);

            // Project title
            const title = proj.name || "";
            currentPage.drawText(sanitizeForFont(title, boldFont), {
              x: margin,
              y: yOffset,
              size: isCompact ? 11 : 13,
              font: boldFont,
              color: textColor,
            });

            yOffset -= isCompact ? 14 : 19; // Space below title

            // Links (if present, with clickable annotations) - Flex wrap strategy
            if (proj.link || proj.repo) {
              const links = [];
              if (proj.link) links.push({ label: "Live demo:", url: proj.link });
              if (proj.repo) links.push({ label: "Github:", url: proj.repo });
              
              if (links.length) {
                let linkY = yOffset;
                let linkX = margin;
                
                for (let i = 0; i < links.length; i++) {
                  const link = links[i];
                  const labelText = link.label;
                  const urlText = link.url;
                  const fullText = `${labelText} ${urlText}`;
                  const safeLabel = sanitizeForFont(labelText, regularFont);
                  const safeFull = sanitizeForFont(fullText, regularFont);
                  
                  const labelWidth = regularFont.widthOfTextAtSize(safeLabel, isCompact ? 8 : 9);
                  const fullWidth = regularFont.widthOfTextAtSize(safeFull, isCompact ? 8 : 9);
                  
                  // Check if we need to wrap to next line
                  if (linkX + fullWidth > pageWidth + margin && i > 0) {
                    linkY -= (isCompact ? 12 : 14);
                    linkX = margin;
                  }
                  
                  // Draw label
                  currentPage.drawText(safeLabel, {
                    x: linkX,
                    y: linkY,
                    size: isCompact ? 8 : 9,
                    font: boldFont,
                    color: textColor,
                  });
                  
                  // Draw URL
                  currentPage.drawText(safeFull.substring(labelText.length), {
                    x: linkX + labelWidth + 8, // Add 8px spacing between label and URL
                    y: linkY,
                    size: isCompact ? 8 : 9,
                    font: regularFont,
                    color: rgb(0,0,0.66),
                  });
                  
                  // Add clickable annotation for the URL part
                  const linkHeight = (isCompact ? 8 : 9) * 1.2;
                  const annotY = linkY - ((isCompact ? 8 : 9) * 0.2);
                  const pdfDocCtx = currentPage.doc;
                  const context = pdfDocCtx.context;
                  const linkAnnotation = context.obj({
                    Type: PDFName.of('Annot'),
                    Subtype: PDFName.of('Link'),
                    Rect: [linkX + labelWidth + 8, annotY, linkX + fullWidth + 8, annotY + linkHeight], // Adjust for spacing
                    Border: [0, 0, 0],
                    C: [0, 0, 1],
                    A: {
                      Type: PDFName.of('Action'),
                      S: PDFName.of('URI'),
                      URI: PDFString.of(link.url),
                      NewWindow: true
                    }
                  });
                  const linkAnnotationRef = context.register(linkAnnotation);
                  const annots = currentPage.node.lookup(PDFName.of('Annots'));
                  if (annots) {
                    (annots as any).push(linkAnnotationRef);
                  } else {
                    currentPage.node.set(PDFName.of('Annots'), context.obj([linkAnnotationRef]));
                  }
                  
                  // Move to next link position
                  linkX += fullWidth + 15; // Add space between links
                }
                
                yOffset -= (isCompact ? 16 : 19); // Space below links
              }
            }

            // Description bullets (if any)
            if (Array.isArray(proj.description) && proj.description.length) {
              for (const d of proj.description) {
                const bullet = "• ";
                const indentX = margin + 16;
                const maxWidth = pageWidth - 26;
                const lines = wrapText(`${bullet}${d}`, maxWidth, regularFont, isCompact ? 9 : 10);
                for (const line of lines) {
                  ensureSpace(isCompact ? 10 : 12);
                  currentPage.drawText(sanitizeForFont(line, regularFont), {
                    x: indentX,
                    y: yOffset,
                    size: isCompact ? 9 : 10,
                    font: regularFont,
                    color: secondaryColor,
                  });
                  yOffset -= isCompact ? 10 : 12;
                }
              }
            }

            yOffset -= isCompact ? 12 : 14; // Space after each project
          }
        }
        break;

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
