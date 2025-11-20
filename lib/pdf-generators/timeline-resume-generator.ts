import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { ResumeData } from '@/types/resume';

interface GeneratePDFOptions {
  resumeData: ResumeData;
  filename?: string;
}

// Color definitions (matching the template)
const COLORS = {
  primary: rgb(0.102, 0.125, 0.173), // #1a202c - Name color
  text: rgb(0.176, 0.196, 0.220), // #2d3748 - Main text
  secondary: rgb(0.290, 0.314, 0.345), // #4a5568 - Secondary text
  gray: rgb(0.627, 0.627, 0.627), // #a0aec0 - Light gray
  accent: rgb(0.259, 0.600, 0.882), // #4299e1 - Blue accent
  lightGray: rgb(0.796, 0.835, 0.878), // #cbd5e0 - Timeline line
  dateGray: rgb(0.445, 0.502, 0.588), // #718096 - Date color
};

// Font sizes - optimized for more content
const SIZES = {
  name: 24,
  contact: 10,
  summary: 10.5,
  sectionHeader: 12,
  institution: 11,
  content: 10,
  small: 9.5,
  tiny: 8.5,
};

// Spacing - optimized for more content
const SPACING = {
  pageMargin: 40,
  bottomMargin: 35, // Reduced bottom margin for more content
  sectionGap: 16,
  itemGap: 12,
  lineHeight: 1.35,
  timelineDotSize: 10,
  timelineLeftMargin: 28,
  timelineGapTop: 6,
  timelineGapBottom: 8,
};

export async function generateTimelineResumePDF({
  resumeData,
  filename = 'resume.pdf'
}: GeneratePDFOptions): Promise<Uint8Array> {
  // Create PDF document
  const pdfDoc = await PDFDocument.create();

  // Load fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Add page
  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  let yPosition = height - SPACING.pageMargin;
  
  // Track timeline state across pages
  let currentTimelinePage = page;
  let timelineStartY: number | null = null;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition - requiredSpace < SPACING.bottomMargin) {
      // Draw timeline line to bottom of current page if timeline is active
      if (timelineStartY !== null) {
        const dotX = SPACING.pageMargin + 5;
        currentTimelinePage.drawLine({
          start: { x: dotX, y: timelineStartY },
          end: { x: dotX, y: SPACING.bottomMargin },
          thickness: 1.5,
          color: COLORS.lightGray,
        });
      }
      
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - SPACING.pageMargin;
      
      // Continue timeline from top of new page if it was active
      if (timelineStartY !== null) {
        currentTimelinePage = page;
        timelineStartY = yPosition;
      }
      
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number, font: any, size: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Helper function to draw timeline dot (outer circle + inner filled circle)
  const drawTimelineDot = (x: number, y: number) => {
    // Outer circle (border)
    page.drawCircle({
      x: x,
      y: y,
      size: 5,
      borderColor: COLORS.accent,
      borderWidth: 1.5,
    });

    // Inner filled circle
    page.drawCircle({
      x: x,
      y: y,
      size: 2.5,
      color: COLORS.accent,
    });
  };

  // 1. Draw Name (NO underline)
  const nameText = resumeData.basics.name;
  page.drawText(nameText, {
    x: SPACING.pageMargin,
    y: yPosition,
    size: SIZES.name,
    font: helveticaBold,
    color: COLORS.primary,
  });
  yPosition -= SIZES.name * 1.3;

  // 2. Draw Contact Info (with wrapping if needed)
  const contactParts: string[] = [];
  if (resumeData.basics.phone) contactParts.push(resumeData.basics.phone);
  if (resumeData.basics.email) contactParts.push(resumeData.basics.email);
  if (resumeData.basics.location) contactParts.push(resumeData.basics.location);
  if (resumeData.basics.linkedin) contactParts.push(resumeData.basics.linkedin);

  // Build contact line with wrapping support
  const maxContactWidth = width - (SPACING.pageMargin * 2);
  let contactLine: string[] = [];
  const contactLineGroups: string[][] = [];

  for (let i = 0; i < contactParts.length; i++) {
    const part = contactParts[i];
    const testLine = [...contactLine, part];
    const testText = testLine.join(' • ');
    const testWidth = helvetica.widthOfTextAtSize(testText, SIZES.contact);

    if (testWidth > maxContactWidth && contactLine.length > 0) {
      contactLineGroups.push([...contactLine]);
      contactLine = [part];
    } else {
      contactLine.push(part);
    }
  }
  if (contactLine.length > 0) contactLineGroups.push(contactLine);

  // Draw contact lines with justification for wrapped lines
  for (let lineIdx = 0; lineIdx < contactLineGroups.length; lineIdx++) {
    const parts = contactLineGroups[lineIdx];
    const isFirstLine = lineIdx === 0;
    const isWrapped = contactLineGroups.length > 1;

    if (isFirstLine && isWrapped && parts.length > 1) {
      // First line with wrapping: justify between
      const totalPartsWidth = parts.reduce((sum, part) => 
        sum + helvetica.widthOfTextAtSize(part, SIZES.contact), 0
      );
      const availableSpace = maxContactWidth - totalPartsWidth;
      const gapBetween = availableSpace / (parts.length - 1);

      let currentX = SPACING.pageMargin;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        page.drawText(part, {
          x: currentX,
          y: yPosition,
          size: SIZES.contact,
          font: helvetica,
          color: COLORS.secondary,
        });
        currentX += helvetica.widthOfTextAtSize(part, SIZES.contact) + gapBetween;
      }
    } else {
      // Regular line or single item: normal spacing with bullets
      const lineText = parts.join(' • ');
      page.drawText(lineText, {
        x: SPACING.pageMargin,
        y: yPosition,
        size: SIZES.contact,
        font: helvetica,
        color: COLORS.secondary,
      });
    }
    
    yPosition -= SIZES.contact * 1.4;
  }
  yPosition -= 4;

  // 3. Draw Summary
  if (resumeData.basics.summary) {
    const summaryLines = wrapText(
      resumeData.basics.summary,
      width - (SPACING.pageMargin * 2),
      helvetica,
      SIZES.summary
    );

    for (const line of summaryLines) {
      page.drawText(line, {
        x: SPACING.pageMargin,
        y: yPosition,
        size: SIZES.summary,
        font: helvetica,
        color: COLORS.text,
      });
      yPosition -= SIZES.summary * SPACING.lineHeight;
    }
    yPosition -= 6;
  }

  // 4. Draw Custom Fields (Grid layout)
  const visibleCustomFields = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden);
  if (visibleCustomFields.length > 0) {
    const colWidth = (width - SPACING.pageMargin * 2) / 2;
    let col = 0;
    let rowStartY = yPosition;

    for (const [key, item] of visibleCustomFields) {
      const xPos = SPACING.pageMargin + (col * colWidth);

      // Draw title (bold)
      page.drawText(`${item.title}:`, {
        x: xPos,
        y: rowStartY,
        size: SIZES.small,
        font: helveticaBold,
        color: COLORS.text,
      });

      // Draw content
      const titleWidth = helveticaBold.widthOfTextAtSize(`${item.title}: `, SIZES.small);
      page.drawText(item.content, {
        x: xPos + titleWidth,
        y: rowStartY,
        size: SIZES.small,
        font: helvetica,
        color: COLORS.secondary,
      });

      col++;
      if (col >= 2) {
        col = 0;
        rowStartY -= SIZES.small * 1.6;
      }
    }

    if (col !== 0) rowStartY -= SIZES.small * 1.6;
    yPosition = rowStartY - 8;
  }

  // 5. Draw Sections
  const sortedSections = [...resumeData.sections].sort((a, b) => (a.order || 0) - (b.order || 0));

  for (const section of sortedSections) {
    if (section.hidden) continue;

    // Check if section has content
    let hasContent = false;
    if (section.type === 'education' || section.type === 'experience' || section.type === 'projects') {
      hasContent = section.items && section.items.length > 0;
    } else if (section.type === 'skills' || section.type === 'languages' || section.type === 'certifications') {
      hasContent = section.items && section.items.length > 0;
    } else if (section.type === 'custom') {
      hasContent = section.content && section.content.some(c => c.trim() !== '');
    }

    if (!hasContent) continue;

    // Reset timeline state for each section
    timelineStartY = null;

    checkPageBreak(50);

    // Draw Section Header with blue underline
    page.drawText(section.title.toUpperCase(), {
      x: SPACING.pageMargin,
      y: yPosition,
      size: SIZES.sectionHeader,
      font: helveticaBold,
      color: COLORS.text,
    });

    // Draw blue underline
    page.drawLine({
      start: { x: SPACING.pageMargin, y: yPosition - 3 },
      end: { x: width - SPACING.pageMargin, y: yPosition - 3 },
      thickness: 1.5,
      color: COLORS.accent,
    });

    yPosition -= SIZES.sectionHeader * 1.8;

    // Draw section content
    if (section.type === 'education') {
      for (let i = 0; i < section.items.length; i++) {
        const edu = section.items[i];
        const isLast = i === section.items.length - 1;

        checkPageBreak(80);

        const dotX = SPACING.pageMargin + 5;
        const contentX = SPACING.pageMargin + SPACING.timelineLeftMargin;

        // Draw institution and dates first to get the proper Y position
        const institutionY = yPosition;
        // Draw institution and dates first to get the proper Y position
     //   const institutionY = yPosition;
        const dateText = `${edu.startDate || ''} - ${edu.endDate || ''}`;
        const dateWidth = helvetica.widthOfTextAtSize(dateText, SIZES.small);

        page.drawText(edu.institution, {
          x: contentX,
          y: institutionY,
          size: SIZES.institution,
          font: helveticaBold,
          color: COLORS.text,
        });

        if (edu.startDate || edu.endDate) {
          page.drawText(dateText, {
            x: width - SPACING.pageMargin - dateWidth,
            y: institutionY,
            size: SIZES.small,
            font: helvetica,
            color: COLORS.dateGray,
          });
        }

        // Now calculate dot position aligned with institution text (at text baseline)
        const dotY = institutionY;

        // Draw timeline line from previous item to this dot
        if (timelineStartY !== null) {
          currentTimelinePage.drawLine({
            start: { x: dotX, y: timelineStartY },
            end: { x: dotX, y: dotY + SPACING.timelineGapTop },
            thickness: 1.5,
            color: COLORS.lightGray,
          });
        }

        // Draw timeline dot
        drawTimelineDot(dotX, dotY);

        // Update timeline tracking
        currentTimelinePage = page;
        timelineStartY = isLast ? null : (dotY - SPACING.timelineGapBottom);

        yPosition -= SIZES.institution * 1.3;

        // Draw degree
        page.drawText(edu.degree, {
          x: contentX,
          y: yPosition,
          size: SIZES.content,
          font: helvetica,
          color: COLORS.secondary,
        });
        yPosition -= SIZES.content * 1.3;

        // Draw location
        if (edu.location) {
          page.drawText(edu.location, {
            x: contentX,
            y: yPosition,
            size: SIZES.small,
            font: helvetica,
            color: COLORS.gray,
          });
          yPosition -= SIZES.small * 1.3;
        }

        // Draw highlights
        if (edu.highlights && edu.highlights.length > 0) {
          yPosition -= 3;
          for (const highlight of edu.highlights) {
            checkPageBreak(25);

            page.drawText('•', {
              x: contentX,
              y: yPosition,
              size: SIZES.content,
              font: helvetica,
              color: COLORS.accent,
            });

            const highlightLines = wrapText(
              highlight,
              width - contentX - SPACING.pageMargin - 20,
              helvetica,
              SIZES.content
            );

            for (const line of highlightLines) {
              page.drawText(line, {
                x: contentX + 12,
                y: yPosition,
                size: SIZES.content,
                font: helvetica,
                color: COLORS.secondary,
              });
              yPosition -= SIZES.content * SPACING.lineHeight;
            }
          }
        }

        yPosition -= SPACING.itemGap;
      }
    } else if (section.type === 'experience') {
      for (let i = 0; i < section.items.length; i++) {
        const exp = section.items[i];
        const isLast = i === section.items.length - 1;

        checkPageBreak(80);

        const dotX = SPACING.pageMargin + 5;
        const contentX = SPACING.pageMargin + SPACING.timelineLeftMargin;

        // Draw role and dates first to get the proper Y position
      //  const roleY = yPosition;
        // Draw role and dates first to get the proper Y position
        const roleY = yPosition;
        const dateText = `${exp.startDate || ''} - ${exp.endDate || ''}`;
        const dateWidth = helvetica.widthOfTextAtSize(dateText, SIZES.small);

        page.drawText(exp.role, {
          x: contentX,
          y: roleY,
          size: SIZES.institution,
          font: helveticaBold,
          color: COLORS.text,
        });

        page.drawText(dateText, {
          x: width - SPACING.pageMargin - dateWidth,
          y: roleY,
          size: SIZES.small,
          font: helvetica,
          color: COLORS.dateGray,
        });

        // Now calculate dot position aligned with role text (at text baseline)
        const dotY = roleY;

        // Draw timeline line from previous item to this dot
        if (timelineStartY !== null) {
          currentTimelinePage.drawLine({
            start: { x: dotX, y: timelineStartY },
            end: { x: dotX, y: dotY + SPACING.timelineGapTop },
            thickness: 1.5,
            color: COLORS.lightGray,
          });
        }

        // Draw timeline dot
        drawTimelineDot(dotX, dotY);

        // Update timeline tracking
        currentTimelinePage = page;
        timelineStartY = isLast ? null : (dotY - SPACING.timelineGapBottom);

        yPosition -= SIZES.institution * 1.3;

        // Draw company
        page.drawText(exp.company, {
          x: contentX,
          y: yPosition,
          size: SIZES.content,
          font: helveticaOblique,
          color: COLORS.secondary,
        });
        yPosition -= SIZES.content * 1.3;

        // Draw location
        if (exp.location) {
          page.drawText(exp.location, {
            x: contentX,
            y: yPosition,
            size: SIZES.small,
            font: helvetica,
            color: COLORS.gray,
          });
          yPosition -= SIZES.small * 1.3;
        }

        // Draw achievements
        if (exp.achievements && exp.achievements.length > 0) {
          yPosition -= 3;
          for (const achievement of exp.achievements) {
            checkPageBreak(25);

            page.drawText('•', {
              x: contentX,
              y: yPosition,
              size: SIZES.content,
              font: helvetica,
              color: COLORS.accent,
            });

            const achievementLines = wrapText(
              achievement,
              width - contentX - SPACING.pageMargin - 20,
              helvetica,
              SIZES.content
            );

            for (const line of achievementLines) {
              page.drawText(line, {
                x: contentX + 12,
                y: yPosition,
                size: SIZES.content,
                font: helvetica,
                color: COLORS.secondary,
              });
              yPosition -= SIZES.content * SPACING.lineHeight;
            }
          }
        }

        yPosition -= SPACING.itemGap;
      }
    } else if (section.type === 'projects') {
      for (let i = 0; i < section.items.length; i++) {
        const proj = section.items[i];
        const isLast = i === section.items.length - 1;

        checkPageBreak(80);

        const dotX = SPACING.pageMargin + 5;
        const contentX = SPACING.pageMargin + SPACING.timelineLeftMargin;

        // Draw project name first to get the proper Y position
        const projectY = yPosition;

        page.drawText(proj.name, {
          x: contentX,
          y: projectY,
          size: SIZES.institution,
          font: helveticaBold,
          color: COLORS.text,
        });

        page.drawText(proj.name, {
          x: contentX,
          y: projectY,
          size: SIZES.institution,
          font: helveticaBold,
          color: COLORS.text,
        });

        // Draw links on the same line
        let linkX = contentX + helveticaBold.widthOfTextAtSize(proj.name, SIZES.institution) + 6;

        if (proj.link) {
          page.drawText('Link', {
            x: linkX,
            y: projectY,
            size: SIZES.tiny,
            font: helvetica,
            color: COLORS.accent,
          });
          const linkWidth = helvetica.widthOfTextAtSize('Link', SIZES.tiny);
          page.drawLine({
            start: { x: linkX, y: projectY - 1 },
            end: { x: linkX + linkWidth, y: projectY - 1 },
            thickness: 0.5,
            color: COLORS.accent,
          });
          linkX += linkWidth + 4;
        }

        if (proj.link && proj.repo) {
          page.drawText('|', {
            x: linkX,
            y: projectY,
            size: SIZES.tiny,
            font: helvetica,
            color: COLORS.lightGray,
          });
          linkX += 6;
        }

        if (proj.repo) {
          page.drawText('GitHub', {
            x: linkX,
            y: projectY,
            size: SIZES.tiny,
            font: helvetica,
            color: COLORS.accent,
          });
          const repoWidth = helvetica.widthOfTextAtSize('GitHub', SIZES.tiny);
          page.drawLine({
            start: { x: linkX, y: projectY - 1 },
            end: { x: linkX + repoWidth, y: projectY - 1 },
            thickness: 0.5,
            color: COLORS.accent,
          });
        }

        // Now calculate dot position aligned with project name text (at text baseline)
        const dotY = projectY;

        // Draw timeline line from previous item to this dot
        if (timelineStartY !== null) {
          currentTimelinePage.drawLine({
            start: { x: dotX, y: timelineStartY },
            end: { x: dotX, y: dotY + SPACING.timelineGapTop },
            thickness: 1.5,
            color: COLORS.lightGray,
          });
        }

        // Draw timeline dot
        drawTimelineDot(dotX, dotY);

        // Update timeline tracking
        currentTimelinePage = page;
        timelineStartY = isLast ? null : (dotY - SPACING.timelineGapBottom);

        yPosition -= SIZES.institution * 1.5;

        // Draw descriptions
        if (proj.description && proj.description.length > 0) {
          for (const desc of proj.description) {
            checkPageBreak(25);

            page.drawText('•', {
              x: contentX + 12,
              y: yPosition,
              size: SIZES.content,
              font: helvetica,
              color: COLORS.secondary,
            });

            const descLines = wrapText(
              desc,
              width - contentX - SPACING.pageMargin - 35,
              helvetica,
              SIZES.content
            );

            for (const line of descLines) {
              page.drawText(line, {
                x: contentX + 24,
                y: yPosition,
                size: SIZES.content,
                font: helvetica,
                color: COLORS.secondary,
              });
              yPosition -= SIZES.content * SPACING.lineHeight;
            }
          }
        }

        yPosition -= SPACING.itemGap;
      }
    } else if (section.type === 'skills' || section.type === 'languages' || section.type === 'certifications') {
      const contentX = SPACING.pageMargin + 6;
      const itemsText = section.items.join(', ');
      const lines = wrapText(
        itemsText,
        width - contentX - SPACING.pageMargin,
        helvetica,
        SIZES.content
      );

      for (const line of lines) {
        checkPageBreak(18);
        page.drawText(line, {
          x: contentX,
          y: yPosition,
          size: SIZES.content,
          font: helvetica,
          color: COLORS.secondary,
        });
        yPosition -= SIZES.content * SPACING.lineHeight;
      }

      yPosition -= SPACING.itemGap;
    } else if (section.type === 'custom') {
      const contentX = SPACING.pageMargin + 6;

      for (const item of section.content) {
        if (!item.trim()) continue;

        checkPageBreak(25);

        page.drawText('•', {
          x: contentX,
          y: yPosition,
          size: SIZES.content,
          font: helvetica,
          color: COLORS.accent,
        });

        const itemLines = wrapText(
          item,
          width - contentX - SPACING.pageMargin - 20,
          helvetica,
          SIZES.content
        );

        for (const line of itemLines) {
          page.drawText(line, {
            x: contentX + 12,
            y: yPosition,
            size: SIZES.content,
            font: helvetica,
            color: COLORS.secondary,
          });
          yPosition -= SIZES.content * SPACING.lineHeight;
        }
      }

      yPosition -= SPACING.itemGap;
    }
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);

  return pdfBytes;
}

// Usage function to download the PDF
export async function downloadATSTimelinePDF(options: GeneratePDFOptions) {
  await generateTimelineResumePDF(options);
}