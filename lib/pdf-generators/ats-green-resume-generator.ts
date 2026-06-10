import { ResumeData, SECTION_TYPES } from '@/types/resume';
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, RGB } from '@pdfme/pdf-lib';
import { getSectionsForRendering } from "@/utils/sectionOrdering";
import { getEffectiveSkillGroupsFromSection, formatGroupedSkillsLine } from "@/utils/skills";
import { wrapText } from '../pdf-utils';


interface GenerateResumeProps {
  resumeData: ResumeData;
  filename?: string;
  theme?: 'green' | 'yellow';
}

interface ColorScheme {
  text: RGB;
  white: RGB;
  sectionHeader: RGB;
  lightGray: RGB;
  link: RGB;
  bullet: RGB;
}

interface FontSizes {
  name: number;
  contact: number;
  sectionHeader: number;
  content: number;
  small: number;
}

interface Margins {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export async function generateATSGreenResume({
  resumeData,
  filename = "resume.pdf",
  theme = 'green'
}: GenerateResumeProps) {
  
  // Validate input data
  if (!resumeData?.basics?.name) {
    throw new Error('Resume data must include at least a name in basics');
  }

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const pageSize: [number, number] = [595, 842]; // A4 size in points
  
  // Load fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Define colors with proper typing
  const colors: ColorScheme = theme === 'yellow' ? {
    text: rgb(0.05, 0.05, 0.05),
    white: rgb(1, 1, 1),
    sectionHeader: rgb(0.98, 0.94, 0.65), // soft yellow
    lightGray: rgb(0.98, 0.97, 0.95),
    link: rgb(0, 0, 0.7),
    bullet: rgb(0.3, 0.3, 0.3)
  } : {
    text: rgb(0, 0, 0),
    white: rgb(1, 1, 1),
    sectionHeader: rgb(0.75, 0.86, 0.75), // light green
    lightGray: rgb(0.95, 0.95, 0.95),
    link: rgb(0, 0, 0.7),
    bullet: rgb(0.3, 0.3, 0.3)
  };

  // Define font sizes
  const fontSizes: FontSizes = {
    name: 20,
    contact: 10,
    sectionHeader: 12,
    content: 10,
    small: 9,
  };

  // Define margins and spacing
  const margins: Margins = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 40,
  };

  // Spacing constants
  const spacing = {
    afterName: 25,
    afterContact: 15,
    afterSection: 20,
    betweenItems: 15,
    lineHeight: 15,
    bulletLineHeight: 12,
    paragraphGap: 10,
  };

  // State management
  let currentPage = pdfDoc.addPage(pageSize);
  let yPosition = pageSize[1] - margins.top;

  // Helper to sanitize strings for a given font
  const sanitizeForFont = (text: string, font: PDFFont): string => {
    if (!text) return '';
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

  // Helper to safely get string value
  const safeString = (value: any, defaultValue: string = ''): string => {
    return value != null ? String(value) : defaultValue;
  };

  // Helper function to check if we need a new page
  // Add extra buffer to prevent content from being too close to bottom
  const checkNewPage = (requiredSpace: number): boolean => {
    const safetyBuffer = 10; // Minimal buffer to prevent cramped content
    if (yPosition - requiredSpace < margins.bottom + safetyBuffer) {
      currentPage = pdfDoc.addPage(pageSize);
      yPosition = pageSize[1] - margins.top;
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
      font?: PDFFont;
      size?: number;
      color?: RGB;
      maxWidth?: number;
    } = {}
  ) => {
    const {
      font = regularFont,
      size = fontSizes.content,
      color = colors.text,
      maxWidth = pageSize[0] - margins.left - margins.right,
    } = options;
    
    const safeText = sanitizeForFont(text, font);
    if (!safeText) return;

    currentPage.drawText(safeText, {
      x,
      y,
      size,
      font,
      color,
      maxWidth,
    });
  };

  // Helper function to draw section header with background
  const drawSectionHeader = (title: string): void => {
    if (!title) return;
    
    const headerHeight = 20;
    const requiredSpace = headerHeight + 30; // Header + some content space
    
    checkNewPage(requiredSpace);
    
    // Draw background rectangle
    currentPage.drawRectangle({
      x: margins.left,
      y: yPosition - 15,
      width: pageSize[0] - margins.left - margins.right,
      height: headerHeight,
      color: colors.sectionHeader,
    });

    // Draw section title
    drawText(sanitizeForFont(title, boldFont), margins.left + 5, yPosition - 8, {
      font: boldFont,
      size: fontSizes.sectionHeader,
      color: colors.text,
    });

    yPosition -= 30;
  };

  // Helper to draw wrapped text lines with page break handling
  const drawWrappedLines = (
    lines: string[],
    x: number,
    lineHeight: number,
    options: {
      font?: PDFFont;
      size?: number;
      color?: RGB;
    } = {}
  ): void => {
    for (const line of lines) {
      // Check before drawing each line to prevent cramped spacing
      checkNewPage(lineHeight);
      drawText(line, x, yPosition, options);
      yPosition -= lineHeight;
    }
  };

  // 1. HEADER SECTION - Name and Contact Info
  const name = safeString(resumeData.basics?.name);
  if (name) {
    checkNewPage(spacing.afterName + fontSizes.name);
    drawText(name, margins.left, yPosition, {
      font: boldFont,
      size: fontSizes.name,
    });
    yPosition -= spacing.afterName;
  }

  // Contact information in one line
  const phone = safeString(resumeData.basics?.phone);
  const email = safeString(resumeData.basics?.email);
  if (phone || email) {
    const contactParts = [phone, email].filter(Boolean);
    const contactInfo = contactParts.join(' • ');
    const maxWidth = pageSize[0] - margins.left - margins.right;
    const contactLines = wrapText(contactInfo, maxWidth, regularFont, fontSizes.contact);
    
    checkNewPage(spacing.afterContact * contactLines.length);
    drawWrappedLines(contactLines, margins.left, spacing.lineHeight, {
      size: fontSizes.contact,
    });
    yPosition -= spacing.afterContact;
  }

  // Location and LinkedIn
  const location = safeString(resumeData.basics?.location);
  const linkedin = safeString(resumeData.basics?.linkedin);
  if (location || linkedin) {
    const locationParts = [location, linkedin].filter(Boolean);
    const locationInfo = locationParts.join(' • ');
    const maxWidth = pageSize[0] - margins.left - margins.right;
    const locationLines = wrapText(locationInfo, maxWidth, regularFont, fontSizes.contact);

    checkNewPage(spacing.afterContact * locationLines.length);
    drawWrappedLines(locationLines, margins.left, spacing.lineHeight, {
      size: fontSizes.contact,
    });
    yPosition -= spacing.afterContact + spacing.paragraphGap;
  }


  // 2. SUMMARY SECTION
  const summary = safeString(resumeData.basics?.summary);
  if (summary) {
    const summaryLines = wrapText(
      summary,
      pageSize[0] - margins.left - margins.right,
      regularFont,
      fontSizes.content
    );

    drawWrappedLines(summaryLines, margins.left, spacing.lineHeight, {
      size: fontSizes.content,
    });
    yPosition -= spacing.paragraphGap;
  }

  // SECTIONS (including additional links or data in order)
  const orderedSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
  
  for (const section of orderedSections) {
    // Handle Additional Links or Data Section
    if (section.type === 'custom-fields') {
      const customEntries = Object.entries(resumeData.custom || {}).filter(
        ([_, item]) => item && !item.hidden && item.title && item.content
      );
      
      if (customEntries.length > 0) {
    const pageWidth = pageSize[0] - margins.left - margins.right;
    const items = customEntries.map(([key, item]) => {
      const keyText = `${item.title}:`;
      const keyWidth = boldFont.widthOfTextAtSize(keyText, fontSizes.content);
      const content = sanitizeForFont(safeString(item.content), regularFont);
      const maxContentWidth = Math.min(250, pageWidth - keyWidth - 15);
      const wrappedLines = wrapText(content, maxContentWidth, regularFont, fontSizes.content);
      const actualContentWidth = Math.max(
        ...wrappedLines.map(line => regularFont.widthOfTextAtSize(line, fontSizes.content))
      );
      return {
        key,
        item,
        width: keyWidth + actualContentWidth + 10,
        height: wrappedLines.length * spacing.lineHeight,
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
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [item];
        currentRowWidth = item.width + minGap;
      }
    }
    if (currentRow.length > 0) rows.push(currentRow);


    for (const row of rows) {
      const rowHeight = Math.max(...row.map(item => item.height));
      checkNewPage(rowHeight + 10);
      
      const totalItemsWidth = row.reduce((sum, item) => sum + item.width, 0);
      const extraGap = row.length > 1 ? (pageWidth - totalItemsWidth) / (row.length - 1) : 0;
      let currentX = margins.left;
      const startY = yPosition; // Store starting Y position for this row

      for (const item of row) {
        const keyText = `${item.item.title}:`;
        drawText(keyText, currentX, startY, { font: boldFont, size: fontSizes.content });
        item.wrappedLines.forEach((line: string, lineIndex: number) => {
          drawText(line, currentX + item.keyWidth + 5, startY - (lineIndex * spacing.lineHeight), {
            size: fontSizes.content
          });
        });
        currentX += item.width + extraGap;
      }
        yPosition -= rowHeight + spacing.lineHeight; // Use lineHeight instead of 8 for consistency
      }
      yPosition -= spacing.paragraphGap;
      }
      continue; // Skip to next section
    }
    
    // Regular sections
    if (!section || !section.title) continue;
    
    // Check if section has content before drawing header
    const hasContent = section.type === SECTION_TYPES.SKILLS || section.type === SECTION_TYPES.LANGUAGES
      ? Array.isArray((section as any).items) && (section as any).items.length > 0
      : Array.isArray((section as any).items) && (section as any).items.length > 0 ||
        (Array.isArray((section as any).content) && (section as any).content.length > 0);
    
    if (!hasContent) continue;

    // Draw section header
    drawSectionHeader(section.title);

    switch (section.type) {
      case SECTION_TYPES.EXPERIENCE:
        const expSection = section as any;
        if (Array.isArray(expSection.items)) {
          for (const exp of expSection.items) {
            if (!exp) continue;
            
            const company = safeString(exp.company);
            const role = safeString(exp.role);
            const startDate = safeString(exp.startDate);
            const endDate = safeString(exp.endDate);
            const location = safeString(exp.location);

            // Only check space for the header line, not the entire item
            checkNewPage(spacing.lineHeight * 2);

            // Company and role on same line
            if (company || role) {
              const companyLine = [company, role].filter(Boolean).join(' - ');
              drawText(companyLine, margins.left, yPosition, {
                font: boldFont,
                size: fontSizes.content,
              });

              // Dates on the right side
              if (startDate || endDate) {
                const dateRange = [startDate, endDate].filter(Boolean).join(' - ');
                const dateWidth = regularFont.widthOfTextAtSize(dateRange, fontSizes.small);
                drawText(dateRange, pageSize[0] - margins.right - dateWidth, yPosition, {
                  size: fontSizes.small,
                });
              }
              yPosition -= spacing.lineHeight;
            }

            // Location if available
            if (location) {
              checkNewPage(spacing.lineHeight);
              drawText(location, margins.left, yPosition, {
                size: fontSizes.small,
              });
              yPosition -= spacing.lineHeight;
            }

            // Achievements/bullet points - each checked individually
            if (Array.isArray(exp.achievements)) {
              for (const achievement of exp.achievements) {
                if (!achievement) continue;
                
                const bulletLines = wrapText(
                  `• ${safeString(achievement)}`,
                  pageSize[0] - margins.left - margins.right - 20,
                  regularFont,
                  fontSizes.content
                );

                drawWrappedLines(bulletLines, margins.left + 10, spacing.bulletLineHeight, {
                  size: fontSizes.content,
                  color: colors.bullet
                });
              }
            }
            yPosition -= spacing.betweenItems;
          }
        }
        break;

      case SECTION_TYPES.EDUCATION:
        const eduSection = section as any;
        if (Array.isArray(eduSection.items)) {
          for (const edu of eduSection.items) {
            if (!edu) continue;
            
            const degree = safeString(edu.degree);
            const institution = safeString(edu.institution);
            const location = safeString(edu.location);
            const startDate = safeString(edu.startDate);
            const endDate = safeString(edu.endDate);

            // Only check for header line
            checkNewPage(spacing.lineHeight * 2);

            // Degree and Institution
            if (degree || institution) {
              const eduLine = [degree, institution].filter(Boolean).join(', ');
              drawText(eduLine, margins.left, yPosition, {
                font: boldFont,
                size: fontSizes.content,
              });
              yPosition -= spacing.lineHeight;
            }

            // Location and dates
            if (location || startDate || endDate) {
              checkNewPage(spacing.lineHeight);
              let locationLine = location;
              if (startDate || endDate) {
                const dateRange = [startDate, endDate].filter(Boolean).join(' - ');
                locationLine = locationLine 
                  ? `${locationLine} (${dateRange})`
                  : dateRange;
              }
              drawText(locationLine, margins.left, yPosition, {
                size: fontSizes.small,
              });
              yPosition -= spacing.lineHeight;
            }

            // Highlights - each checked individually
            if (Array.isArray(edu.highlights)) {
              for (const highlight of edu.highlights) {
                if (!highlight) continue;
                
                const highlightLines = wrapText(
                  `• ${safeString(highlight)}`,
                  pageSize[0] - margins.left - margins.right - 20,
                  regularFont,
                  fontSizes.content
                );

                drawWrappedLines(highlightLines, margins.left + 10, spacing.bulletLineHeight, {
                  size: fontSizes.content,
                  color: colors.bullet
                });
              }
            }
            yPosition -= spacing.betweenItems;
          }
        }
        break;

      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section as any)
        const visibleGroups = groups.filter(g => g.skills.length > 0)
        
        if (visibleGroups.length > 0) {
          for (const group of visibleGroups) {
            // Draw bold title
            const titleText = `${group.title}: ` // Add space after colon
            const titleWidth = boldFont.widthOfTextAtSize(titleText, fontSizes.content)
            
            // Draw title
            currentPage.drawText(sanitizeForFont(titleText, boldFont), {
              x: margins.left,
              y: yPosition,
              size: fontSizes.content,
              font: boldFont,
              color: colors.text,
            });

            // Draw skills on same line
            const skillsText = group.skills.join(', ')
            const skillLines = wrapText(
              skillsText,
              pageSize[0] - margins.left - margins.right - titleWidth,
              regularFont,
              fontSizes.content
            );

            if (skillLines.length > 0) {
              // Draw first line of skills on same line as title
              currentPage.drawText(sanitizeForFont(skillLines[0], regularFont), {
                x: margins.left + titleWidth,
                y: yPosition,
                size: fontSizes.content,
                font: regularFont,
                color: colors.text,
              });
              
              // Draw subsequent lines indented
              for (let i = 1; i < skillLines.length; i++) {
                yPosition -= spacing.lineHeight;
                currentPage.drawText(sanitizeForFont(skillLines[i], regularFont), {
                  x: margins.left + titleWidth,
                  y: yPosition,
                  size: fontSizes.content,
                  font: regularFont,
                  color: colors.text,
                });
              }
            }
            
            yPosition -= spacing.lineHeight; // Move to next line
            
            // Add small spacing between skill groups
            if (group !== visibleGroups[visibleGroups.length - 1]) {
              yPosition -= spacing.lineHeight * 0.5;
            }
          }
        }
        break;
      }

      case SECTION_TYPES.LANGUAGES:
        const langSection = section as any;
        if (Array.isArray(langSection.items) && langSection.items.length > 0) {
          const languagesText = langSection.items
            .filter((lang: any) => lang != null)
            .map((lang: any) => safeString(lang))
            .filter(Boolean)
            .join(', ');
          
          if (languagesText) {
            const langLines = wrapText(
              languagesText,
              pageSize[0] - margins.left - margins.right,
              regularFont,
              fontSizes.content
            );

            drawWrappedLines(langLines, margins.left, spacing.lineHeight, {
              size: fontSizes.content,
            });
          }
        }
        break;

      case SECTION_TYPES.CERTIFICATIONS:
        const certSection = section as any;
        if (Array.isArray(certSection.items)) {
          for (const cert of certSection.items) {
            if (!cert) continue;
            
            const certLines = wrapText(
              `• ${safeString(cert)}`,
              pageSize[0] - margins.left - margins.right - 20,
              regularFont,
              fontSizes.content
            );

            drawWrappedLines(certLines, margins.left + 10, spacing.bulletLineHeight, {
              size: fontSizes.content,
              color: colors.bullet
            });
          }
        }
        break;

      case SECTION_TYPES.CUSTOM:
        const customSection = section as any;
        if (Array.isArray(customSection.content)) {
          for (const content of customSection.content) {
            if (!content) continue;
            
            const contentLines = wrapText(
              safeString(content),
              pageSize[0] - margins.left - margins.right,
              regularFont,
              fontSizes.content
            );

            drawWrappedLines(contentLines, margins.left, spacing.lineHeight, {
              size: fontSizes.content,
            });
          }
        }
        break;

      case SECTION_TYPES.PROJECTS:
        const projectsSection = section as any;
        if (Array.isArray(projectsSection.items)) {
          for (const proj of projectsSection.items) {
            if (!proj) continue;
            
            const projectName = safeString(proj.name);
            const projectLink = safeString(proj.link);
            const projectRepo = safeString(proj.repo);

            // Only check for project title
            checkNewPage(spacing.lineHeight * 2);

            // Project title
            if (projectName) {
              drawText(projectName, margins.left, yPosition, {
                font: boldFont,
                size: fontSizes.sectionHeader
              });
              yPosition -= spacing.lineHeight + 3;
            }

            // Links row
            const linkParts = [];
            if (projectLink) linkParts.push(`Link: ${projectLink}`);
            if (projectRepo) linkParts.push(`GitHub: ${projectRepo}`);
            
            if (linkParts.length > 0) {
              const linksLine = linkParts.join('  |  ');
              const lines = wrapText(
                linksLine,
                pageSize[0] - margins.left - margins.right,
                regularFont,
                fontSizes.small
              );
              
              drawWrappedLines(lines, margins.left, spacing.bulletLineHeight, {
                size: fontSizes.small,
                color: colors.link
              });
            }

            // Description lines - each checked individually
            if (Array.isArray(proj.description)) {
              for (const d of proj.description) {
                if (!d) continue;
                
                const descLines = wrapText(
                  `• ${safeString(d)}`,
                  pageSize[0] - margins.left - margins.right - 20,
                  regularFont,
                  fontSizes.content
                );
                
                drawWrappedLines(descLines, margins.left + 10, spacing.bulletLineHeight - 1, {
                  size: fontSizes.content,
                  color: colors.bullet
                });
              }
            }
            yPosition -= spacing.betweenItems + 1;
          }
        }
        break;
    }

    yPosition -= spacing.afterSection;
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Export function to save PDF to file (Node.js environment)
export async function saveResumeToFile({
  resumeData,
  filename = "resume.pdf",
  theme = "green",
}: GenerateResumeProps): Promise<Uint8Array> {
  return generateATSGreenResume({ resumeData, filename, theme });
}

export async function downloadResume({
  resumeData,
  filename = "resume.pdf",
  theme = "green",
}: GenerateResumeProps): Promise<void> {
  const { triggerPdfDownload } = await import("@/lib/pdf-generators/trigger-pdf-download");
  const bytes = await generateATSGreenResume({ resumeData, filename, theme });
  triggerPdfDownload(bytes, filename);
}
