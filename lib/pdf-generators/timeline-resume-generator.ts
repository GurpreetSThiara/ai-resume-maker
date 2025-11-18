import { ResumeData, SECTION_TYPES } from '@/types/resume';
import { formatProject } from '@/lib/renderers/projects'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { drawProjectsSection } from '@/lib/pdf/sections/projects'

interface GenerateResumeProps {
  resumeData: ResumeData;
  filename?: string;
}

export async function generateTimelineResumePDF({
  resumeData,
  filename = "resume.pdf",
}: GenerateResumeProps) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size in points
  const { width, height } = page.getSize();

  // Load fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Define colors matching the timeline template
  const colors = {
    primary: rgb(0.102, 0.125, 0.173), // #1a202c
    text: rgb(0.176, 0.216, 0.282), // #2d3748
    secondary: rgb(0.29, 0.333, 0.408), // #4a5568
    lightGray: rgb(0.447, 0.314, 0.588), // #718096
    accent: rgb(0.259, 0.6, 0.882), // #4299e1 - blue for timeline
    border: rgb(0.796, 0.835, 0.878), // #cbd5e0
    veryLight: rgb(0.627, 0.663, 0.753), // #a0aec0
  };

  // Define font sizes
  const fontSizes = {
    name: 28,
    contact: 12,
    summary: 12,
    sectionHeader: 14,
    content: 12,
    small: 11,
    tiny: 10,
  };

  // Define margins and spacing
  const margins = {
    left: 72,
    right: 72,
    top: 60,
    bottom: 60,
  };

  let yPosition = height - margins.top;

  // Helper to sanitize strings for font encoding
  const sanitizeForFont = (text: string, font: any): string => {
    if (!text) return text;
    try {
      font.encodeText(text);
      return text;
    } catch {
      let out = '';
      for (const ch of Array.from(text)) {
        try {
          font.encodeText(ch);
          out += ch;
        } catch {
          // Skip unencodable character
        }
      }
      return out;
    }
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition - requiredSpace < margins.bottom) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - margins.top;
      return true;
    }
    return false;
  };

  // Helper function to draw text
  const drawText = (
    text: string,
    x: number,
    y: number,
    options: {
      font?: any;
      size?: number;
      color?: any;
      maxWidth?: number;
    } = {}
  ) => {
    const {
      font = regularFont,
      size = fontSizes.content,
      color = colors.text,
      maxWidth = width - margins.left - margins.right,
    } = options;
    const safeText = sanitizeForFont(text, font);

    page.drawText(safeText, {
      x,
      y,
      size,
      font,
      color,
      maxWidth,
    });
  };

  // Helper function to wrap text and return lines
  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number): string[] => {
    const safeFullText = sanitizeForFont(text, font);
    const words = safeFullText.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Draw timeline dot
  const drawTimelineDot = (x: number, y: number) => {
    // Outer circle (shadow effect)
    page.drawCircle({
      x: x,
      y: y,
      size: 6,
      borderColor: colors.accent,
      borderWidth: 2,
      color: colors.accent,
    });
    
    // Inner white circle
    page.drawCircle({
      x: x,
      y: y,
      size: 3,
      color: rgb(1, 1, 1),
    });
  };

  // Draw timeline line
  const drawTimelineLine = (x: number, yStart: number, yEnd: number) => {
    page.drawLine({
      start: { x: x, y: yStart },
      end: { x: x, y: yEnd },
      thickness: 2,
      color: colors.border,
    });
  };

  // --- Start rendering content ---

  // Name
  checkNewPage(40);
  drawText(resumeData.basics.name, margins.left, yPosition, {
    font: boldFont,
    size: fontSizes.name,
    color: colors.primary,
  });
  yPosition -= 35;

  // Contact Info
  const { email, phone, location, linkedin } = resumeData.basics;
  const contactParts = [phone, email, location, linkedin].filter(Boolean);
  const contactInfo = contactParts.join(' • ');
  
  checkNewPage(40);
  const contactLines = wrapText(
    contactInfo,
    width - margins.left - margins.right,
    regularFont,
    fontSizes.contact
  );

  for (const line of contactLines) {
    checkNewPage(15);
    drawText(line, margins.left, yPosition, {
      font: regularFont,
      size: fontSizes.contact,
      color: colors.secondary,
    });
    yPosition -= 15;
  }
  yPosition -= 15;

  // Summary
  if (resumeData.basics.summary) {
    checkNewPage(60);
    const summaryLines = wrapText(
      resumeData.basics.summary,
      width - margins.left - margins.right,
      regularFont,
      fontSizes.summary
    );
    
    for (const line of summaryLines) {
      checkNewPage(15);
      drawText(line, margins.left, yPosition, {
        font: regularFont,
        size: fontSizes.summary,
        color: colors.text,
      });
      yPosition -= 15;
    }
    yPosition -= 10;
  }

  // Custom Fields (two column grid)
  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden);
  
  if (customEntries.length > 0) {
    checkNewPage(40);
    const columnWidth = (width - margins.left - margins.right) / 2;
    
    for (let i = 0; i < customEntries.length; i += 2) {
      checkNewPage(18);
      
      // Left column
      if (customEntries[i]) {
        const [_, item] = customEntries[i];
        const labelText = sanitizeForFont(`${item.title}: `, boldFont);
        const valueText = sanitizeForFont(item.content, regularFont);
        
        drawText(labelText, margins.left, yPosition, {
          font: boldFont,
          size: fontSizes.small,
          color: colors.text,
        });
        
        const labelWidth = boldFont.widthOfTextAtSize(labelText, fontSizes.small);
        drawText(valueText, margins.left + labelWidth, yPosition, {
          font: regularFont,
          size: fontSizes.small,
          color: colors.secondary,
        });
      }
      
      // Right column
      if (customEntries[i + 1]) {
        const [_, item] = customEntries[i + 1];
        const labelText = sanitizeForFont(`${item.title}: `, boldFont);
        const valueText = sanitizeForFont(item.content, regularFont);
        
        drawText(labelText, margins.left + columnWidth, yPosition, {
          font: boldFont,
          size: fontSizes.small,
          color: colors.text,
        });
        
        const labelWidth = boldFont.widthOfTextAtSize(labelText, fontSizes.small);
        drawText(valueText, margins.left + columnWidth + labelWidth, yPosition, {
          font: regularFont,
          size: fontSizes.small,
          color: colors.secondary,
        });
      }
      
      yPosition -= 15;
    }
    yPosition -= 10;
  }

  // Process sections
  resumeData.sections.forEach((section, sectionIdx) => {
    // Check if section has content
    let hasContent = false;
    if (section.type === SECTION_TYPES.EDUCATION || section.type === SECTION_TYPES.EXPERIENCE || section.type === SECTION_TYPES.PROJECTS) {
      hasContent = section.items && section.items.length > 0;
    } else if (
      section.type === SECTION_TYPES.SKILLS ||
      section.type === SECTION_TYPES.LANGUAGES ||
      section.type === SECTION_TYPES.CERTIFICATIONS
    ) {
      hasContent = section.items && section.items.length > 0;
    } else if (section.type === SECTION_TYPES.CUSTOM) {
      hasContent = section.content && section.content.length > 0 && section.content.some((item) => item.trim() !== '');
    }

    if (!hasContent) return;

    // Section Header with underline
    checkNewPage(35);
    const sectionTitle = sanitizeForFont(section.title.toUpperCase(), boldFont);
    drawText(sectionTitle, margins.left, yPosition, {
      font: boldFont,
      size: fontSizes.sectionHeader,
      color: colors.text,
    });
    
    // Draw underline
    page.drawLine({
      start: { x: margins.left, y: yPosition - 5 },
      end: { x: width - margins.right, y: yPosition - 5 },
      thickness: 2,
      color: colors.accent,
    });
    
    yPosition -= 25;

    // Education Section with Timeline
    if (section.type === SECTION_TYPES.EDUCATION) {
      section.items.forEach((edu, eduIdx) => {
        const timelineX = margins.left + 10;
        const contentX = timelineX + 20;
        const itemStartY = yPosition;
        
        checkNewPage(80);
        
        // Draw timeline dot
        drawTimelineDot(timelineX, yPosition);
        
        // Institution and Date
        const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
        const institutionText = sanitizeForFont(edu.institution, boldFont);
        
        drawText(institutionText, contentX, yPosition, {
          font: boldFont,
          size: fontSizes.content,
          color: colors.text,
        });
        
        if (dateRange) {
          const instWidth = boldFont.widthOfTextAtSize(institutionText, fontSizes.content);
          const dateText = sanitizeForFont(` | ${dateRange}`, regularFont);
          drawText(dateText, contentX + instWidth + 5, yPosition, {
            font: regularFont,
            size: fontSizes.small,
            color: colors.lightGray,
          });
        }
        
        yPosition -= 15;
        
        // Degree
        checkNewPage(15);
        const degreeLines = wrapText(edu.degree, width - contentX - margins.right, regularFont, fontSizes.content);
        for (const line of degreeLines) {
          drawText(line, contentX, yPosition, {
            font: regularFont,
            size: fontSizes.content,
            color: colors.secondary,
          });
          yPosition -= 14;
        }
        
        // Location
        if (edu.location) {
          checkNewPage(15);
          drawText(sanitizeForFont(edu.location, italicFont), contentX, yPosition, {
            font: italicFont,
            size: fontSizes.tiny,
            color: colors.veryLight,
          });
          yPosition -= 14;
        }
        
        // Highlights
        if (edu.highlights && edu.highlights.length > 0) {
          yPosition -= 5;
          edu.highlights.forEach((highlight) => {
            checkNewPage(30);
            const bulletX = contentX + 10;
            drawText('•', bulletX, yPosition, {
              font: regularFont,
              size: fontSizes.content,
              color: colors.accent,
            });
            
            const highlightLines = wrapText(highlight, width - bulletX - 20 - margins.right, regularFont, fontSizes.content);
            for (const line of highlightLines) {
              drawText(line, bulletX + 15, yPosition, {
                font: regularFont,
                size: fontSizes.content,
                color: colors.secondary,
              });
              yPosition -= 14;
            }
          });
        }
        
        // Draw timeline line to next item
        if (eduIdx < section.items.length - 1) {
          const lineEndY = yPosition - 10;
          drawTimelineLine(timelineX, itemStartY - 10, lineEndY);
          yPosition -= 15;
        } else {
          yPosition -= 10;
        }
      });
    }

    // Experience Section with Timeline
    if (section.type === SECTION_TYPES.EXPERIENCE) {
      section.items.forEach((exp, expIdx) => {
        const timelineX = margins.left + 10;
        const contentX = timelineX + 20;
        const itemStartY = yPosition;
        
        checkNewPage(80);
        
        // Draw timeline dot
        drawTimelineDot(timelineX, yPosition);
        
        // Role and Date
        const dateRange = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
        const roleText = sanitizeForFont(exp.role, boldFont);
        
        drawText(roleText, contentX, yPosition, {
          font: boldFont,
          size: fontSizes.content,
          color: colors.text,
        });
        
        if (dateRange) {
          const roleWidth = boldFont.widthOfTextAtSize(roleText, fontSizes.content);
          const dateText = sanitizeForFont(` | ${dateRange}`, regularFont);
          drawText(dateText, contentX + roleWidth + 5, yPosition, {
            font: regularFont,
            size: fontSizes.small,
            color: colors.lightGray,
          });
        }
        
        yPosition -= 15;
        
        // Company
        checkNewPage(15);
        drawText(sanitizeForFont(exp.company, italicFont), contentX, yPosition, {
          font: italicFont,
          size: fontSizes.content,
          color: colors.secondary,
        });
        yPosition -= 14;
        
        // Location
        if (exp.location) {
          checkNewPage(15);
          drawText(sanitizeForFont(exp.location, regularFont), contentX, yPosition, {
            font: regularFont,
            size: fontSizes.tiny,
            color: colors.veryLight,
          });
          yPosition -= 14;
        }
        
        // Achievements
        if (exp.achievements && exp.achievements.length > 0) {
          yPosition -= 5;
          exp.achievements.forEach((achievement) => {
            checkNewPage(30);
            const bulletX = contentX + 10;
            drawText('•', bulletX, yPosition, {
              font: regularFont,
              size: fontSizes.content,
              color: colors.accent,
            });
            
            const achievementLines = wrapText(achievement, width - bulletX - 20 - margins.right, regularFont, fontSizes.content);
            for (const line of achievementLines) {
              drawText(line, bulletX + 15, yPosition, {
                font: regularFont,
                size: fontSizes.content,
                color: colors.secondary,
              });
              yPosition -= 14;
            }
          });
        }
        
        // Draw timeline line to next item
        if (expIdx < section.items.length - 1) {
          const lineEndY = yPosition - 10;
          drawTimelineLine(timelineX, itemStartY - 10, lineEndY);
          yPosition -= 15;
        } else {
          yPosition -= 10;
        }
      });
    }

    // Skills, Languages, Certifications
    if (
      section.type === SECTION_TYPES.SKILLS ||
      section.type === SECTION_TYPES.LANGUAGES ||
      section.type === SECTION_TYPES.CERTIFICATIONS
    ) {
      checkNewPage(30);
      const skillsText = section.items.join(', ');
      const skillsLines = wrapText(skillsText, width - margins.left - margins.right - 10, regularFont, fontSizes.content);
      
      for (const line of skillsLines) {
        checkNewPage(15);
        drawText(line, margins.left + 10, yPosition, {
          font: regularFont,
          size: fontSizes.content,
          color: colors.secondary,
        });
        yPosition -= 14;
      }
      yPosition -= 10;
    }

    // Projects Section (use shared renderer styled like timeline preview)
    if (section.type === SECTION_TYPES.PROJECTS && Array.isArray((section as any).items) && (section as any).items.length) {
      const ctx = {
        page,
        fonts: { regular: regularFont, bold: boldFont },
        margin: margins.left + 20, // align with contentX (after timeline line)
        pageInnerWidth: width - (margins.left + 20) - margins.right,
        y: yPosition,
        ensureSpace: (spaceNeeded: number) => {
          if (yPosition - spaceNeeded < margins.bottom) {
            page = pdfDoc.addPage([595, 842])
            ctx.page = page
            yPosition = 842 - margins.top
            ctx.y = yPosition
          }
        },
      }
      const style = {
        titleSize: fontSizes.content,
        titleColor: colors.text,
        linkSize: fontSizes.small,
        linkColor: colors.lightGray,
        descSize: fontSizes.content,
        descColor: colors.secondary,
        bulletIndent: 15,
        itemSpacing: 10,
      }
      const { y } = drawProjectsSection(ctx as any, section as any, style as any, { linkDisplay: 'short', withHeader: false, showTimeline: true })
      // Draw timeline dots/lines for the block roughly: place a dot at section start (optional)
      // For simplicity we keep linear flow without connectors here since content wraps variably.
      yPosition = y - 10
    }

    // Custom Section
    if (section.type === SECTION_TYPES.CUSTOM) {
      section.content.forEach((item) => {
        checkNewPage(30);
        drawText('•', margins.left + 15, yPosition, {
          font: regularFont,
          size: fontSizes.content,
          color: colors.accent,
        });
        
        const contentLines = wrapText(item, width - margins.left - margins.right - 40, regularFont, fontSizes.content);
        for (const line of contentLines) {
          drawText(line, margins.left + 30, yPosition, {
            font: regularFont,
            size: fontSizes.content,
            color: colors.secondary,
          });
          yPosition -= 14;
        }
      });
      yPosition -= 10;
    }
  });

  // Save PDF and trigger download
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
