import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { sanitizeTextForPdf, sanitizeTextForPdfWithFont } from "@/lib/utils"
import { drawProjectsSection } from '@/lib/pdf/sections/projects'
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection, formatGroupedSkillsLine } from "@/utils/skills"

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

  // === SECTIONS (including additional links or data in order) ===
  const orderedSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
  
  for (const section of orderedSections) {
    // Handle Additional Links or Data Section
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

      case "skills": {
        const groups = getEffectiveSkillGroupsFromSection(section as any)
        const visibleGroups = groups.filter(g => g.skills.length > 0)
        
        if (visibleGroups.length > 0) {
          for (const group of visibleGroups) {
            // Draw bold title
            const titleText = `${group.title}: ` // Add space after colon
            const titleWidth = boldFont.widthOfTextAtSize(titleText, isCompact ? 8 : 10)
            
            draw(titleText, margin + 15, isCompact ? 8 : 10, boldFont, textColor)

            // Draw skills on same line
            const skillsText = group.skills.join(', ')
            const skillsLines = wrapText(skillsText, pageWidth - 20 - titleWidth, regularFont, isCompact ? 8 : 10)
            
            if (skillsLines.length > 0) {
              // Draw first line of skills on same line as title
              draw(skillsLines[0], margin + 15 + titleWidth, isCompact ? 8 : 10, regularFont, textColor)
              yOffset -= isCompact ? 8 : 12

              // Draw subsequent lines indented
              for (let i = 1; i < skillsLines.length; i++) {
                draw(skillsLines[i], margin + 15 + titleWidth, isCompact ? 8 : 10, regularFont, textColor)
                yOffset -= isCompact ? 8 : 12
              }
            } else {
              yOffset -= isCompact ? 8 : 12 // If no skills, still move down one line
            }
            
            yOffset -= isCompact ? 4 : 8
          }
          yOffset -= isCompact ? 12 : 16
        }
        break
      }

      case "languages":
      case "certifications":
        if (section.items?.length) {
          const lines = wrapText(section.items.join(", "), pageWidth - 20, regularFont, isCompact ? 8 : 10)
          for (const l of lines) {
            draw(l, margin + 15, isCompact ? 8 : 10, regularFont, textColor)
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
            const itemStartY = yOffset + 5; // Capture start position like Google template
            currentPage.drawText(sanitizeForFont(title, boldFont), {
              x: margin,
              y: yOffset,
              size: isCompact ? 11 : 13,
              font: boldFont,
              color: textColor,
            });

            yOffset -= isCompact ? 14 : 19; // Space below title

            // Links (if present, with clickable annotations) - Advanced URL wrapping
            if (proj.link || proj.repo) {
              const links = [];
              if (proj.link) links.push({ label: "Live demo:", url: proj.link });
              if (proj.repo) links.push({ label: "Github:", url: proj.repo });
              
              if (links.length) {
                let linkY = itemStartY - (isCompact ? 11 : 13) - (isCompact ? 6 : 8); // Match Google: itemStartY - (titleSize + 6)
                let linkX = margin + 8; // Add 8px indent
                let minLinkY = linkY; // Track the lowest Y position used
                
                // Helper function to wrap long URLs
                const wrapUrl = (url: string, maxWidth: number): string[] => {
                  const lines: string[] = [];
                  let remaining = sanitizeTextForPdf(url);
                  
                  while (remaining.length > 0) {
                    let chunk = remaining;
                    let width = regularFont.widthOfTextAtSize(chunk, isCompact ? 8 : 9);
                    
                    while (width > maxWidth && chunk.length > 1) {
                      chunk = chunk.substring(0, chunk.length - 1);
                      width = regularFont.widthOfTextAtSize(chunk, isCompact ? 8 : 9);
                    }
                    
                    lines.push(chunk);
                    remaining = remaining.substring(chunk.length);
                  }
                  
                  return lines;
                };
                
                for (let i = 0; i < links.length; i++) {
                  const link = links[i];
                  const safeLabel = sanitizeTextForPdf(link.label);
                  
                  const labelWidth = regularFont.widthOfTextAtSize(safeLabel, isCompact ? 8 : 9);
                  
                  // Check available width for URL on current line
                  const availableWidth = pageWidth - linkX - labelWidth - 8;
                  const urlLines = wrapUrl(link.url, availableWidth);
                  
                  // Draw label
                  currentPage.drawText(safeLabel, {
                    x: linkX,
                    y: linkY,
                    size: isCompact ? 8 : 9,
                    font: boldFont,
                    color: textColor,
                  });
                  
                  // Draw URL line by line
                  let currentUrlY = linkY;
                  let firstLineUrlX = linkX + labelWidth + 8;
                  
                  for (let j = 0; j < urlLines.length; j++) {
                    const urlLine = urlLines[j];
                    const safeUrl = sanitizeTextForPdf(urlLine);
                    const urlLineX = j === 0 ? firstLineUrlX : margin + 8; // Maintain 8px indent for wrapped lines
                    
                    currentPage.drawText(safeUrl, {
                      x: urlLineX,
                      y: currentUrlY,
                      size: isCompact ? 8 : 9,
                      font: regularFont,
                      color: rgb(0,0,0.66),
                    });
                    
                    // Add clickable annotation for this line
                    const urlWidth = regularFont.widthOfTextAtSize(safeUrl, isCompact ? 8 : 9);
                    const linkHeight = (isCompact ? 8 : 9) * 1.2;
                    const annotY = currentUrlY - ((isCompact ? 8 : 9) * 0.2);
                    const pdfDocCtx = currentPage.doc;
                    const context = pdfDocCtx.context;
                    const linkAnnotation = context.obj({
                      Type: PDFName.of('Annot'),
                      Subtype: PDFName.of('Link'),
                      Rect: [urlLineX, annotY, urlLineX + urlWidth, annotY + linkHeight],
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
                    
                    if (j < urlLines.length - 1) {
                      currentUrlY -= (isCompact ? 10 : 11); // Match Google template spacing
                    }
                  }
                  
                  minLinkY = Math.min(minLinkY, currentUrlY);
                  
                  // Position for next link (if any)
                  if (i < links.length - 1) {
                    linkY = currentUrlY - (isCompact ? 11 : 13); // Match Google template spacing
                    linkX = margin + 8; // Maintain 8px indent
                    minLinkY = Math.min(minLinkY, linkY);
                  }
                }
                
                // Update yOffset with minimal spacing (just 6px gap to match Google)
                yOffset = minLinkY - 13;
              }
            }

            // Description bullets (if any)
            if (Array.isArray(proj.description) && proj.description.length) {
              for (const d of proj.description) {
                const bullet = "- "; // Use - for ATS-friendly uniform formatting
                const indentX = margin + 15; // Match other sections' indent
                const maxWidth = pageWidth - 20; // Match other sections' width
                const lines = wrapText(`${bullet}${d}`, maxWidth, regularFont, isCompact ? 8 : 10); // Match font sizes
                for (const line of lines) {
                  ensureSpace(isCompact ? 8 : 12); // Match spacing
                  currentPage.drawText(sanitizeForFont(line, regularFont), {
                    x: indentX,
                    y: yOffset,
                    size: isCompact ? 8 : 10, // Match other sections
                    font: regularFont,
                    color: textColor, // Match other sections' color
                  });
                  yOffset -= isCompact ? 8 : 12; // Match spacing
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
