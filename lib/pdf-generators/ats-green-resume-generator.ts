import { ResumeData, SECTION_TYPES } from '@/types/resume';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


interface GenerateResumeProps {
  resumeData: ResumeData;
  filename?: string;
}

export async function generateATSGreenResume({
  resumeData,
  filename = "resume.pdf"
}: GenerateResumeProps) {

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size in points
  const { width, height } = page.getSize();

  // Load fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Define colors matching the original resume
  const colors = {
    text: rgb(0, 0, 0),           // Black text
    white: rgb(1, 1, 1),          // White background
    sectionHeader: rgb(0.75, 0.86, 0.75), // Light green for section headers
    lightGray: rgb(0.95, 0.95, 0.95), // Very light gray
  };

  // Define font sizes
  const fontSizes = {
    name: 20,
    contact: 10,
    sectionHeader: 12,
    content: 10,
    small: 9,
  };

  // Define margins and spacing
  const margins = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
  };

  let yPosition = height - margins.top;

  // Helper to sanitize strings for a given font (removes characters the font can't encode)
  const sanitizeForFont = (text: string, font: any): string => {
    if (!text) return text;
    try {
      // Fast path: if the whole string is encodable, return as is
      font.encodeText(text);
      return text;
    } catch {
      // Fallback: build a string of only encodable characters
      let out = '';
      // Iterate by code points to handle surrogate pairs
      for (const ch of Array.from(text)) {
        try {
          font.encodeText(ch);
          out += ch;
        } catch {
          // Skip unencodable character (e.g., emoji)
        }
      }
      return out;
    }
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
    // Sanitize text to avoid WinAnsi encoding issues (e.g., emoji)
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

  // Helper function to draw section header with background
  const drawSectionHeader = (title: string, y: number) => {
    // Draw background rectangle
    page.drawRectangle({
      x: margins.left,
      y: y - 15,
      width: width - margins.left - margins.right,
      height: 20,
      color: colors.sectionHeader,
    });

    // Draw section title
    drawText(sanitizeForFont(title, boldFont), margins.left + 5, y - 8, {
      font: boldFont,
      size: fontSizes.sectionHeader,
      color: colors.text,
    });

    return y - 30;
  };
  // Helper function to wrap text and return lines
  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number): string[] => {
    // Sanitize upfront so measurement matches what will be rendered
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

  // 1. HEADER SECTION - Name and Contact Info
  drawText(resumeData.basics.name, margins.left, yPosition, {
    font: boldFont,
    size: fontSizes.name,
  });
  yPosition -= 25;

  // Contact information in one line
  const contactInfo = `${resumeData.basics.phone} • ${resumeData.basics.email}`;
  drawText(contactInfo, margins.left, yPosition, {
    size: fontSizes.contact,
  });
  yPosition -= 15;

  // Location and LinkedIn
  const locationInfo = `${resumeData.basics.location} • ${resumeData.basics.linkedin}`;
  drawText(locationInfo, margins.left, yPosition, {
    size: fontSizes.contact,
  });
  yPosition -= 30;

  // 2. SUMMARY SECTION
  if (resumeData.basics.summary) {
    const summaryLines = wrapText(
      resumeData.basics.summary,
      width - margins.left - margins.right,
      regularFont,
      fontSizes.content
    );

    for (const line of summaryLines) {
      drawText(line, margins.left, yPosition, {
        size: fontSizes.content,
      });
      yPosition -= 15;
    }
    yPosition -= 10;
  }

  // 3. SECTIONS (Experience, Education, Skills, etc.)
  for (const section of resumeData.sections) {
    // Draw section header
    yPosition = drawSectionHeader(section.title, yPosition);

    switch (section.type) {
      case SECTION_TYPES.EXPERIENCE:
        const expSection = section as any; // Type assertion for experience section
        if (expSection.items) {
          for (const exp of expSection.items) {
            // Company and dates on same line
            const companyLine = `${exp.company} - ${exp.role}`;
            drawText(companyLine, margins.left, yPosition, {
              font: boldFont,
              size: fontSizes.content,
            });

            // Dates on the right side
            const dateRange = `${exp.startDate} - ${exp.endDate}`;
            const dateWidth = regularFont.widthOfTextAtSize(dateRange, fontSizes.small);
            drawText(dateRange, width - margins.right - dateWidth, yPosition, {
              size: fontSizes.small,
            });
            yPosition -= 15;

            // Location if available
            if (exp.location) {
              drawText(exp.location, margins.left, yPosition, {
                size: fontSizes.small,
              });
              yPosition -= 15;
            }

            // Achievements/bullet points
            if (exp.achievements) {
              for (const achievement of exp.achievements) {
                const bulletLines = wrapText(
                  `• ${achievement}`,
                  width - margins.left - margins.right - 20,
                  regularFont,
                  fontSizes.content
                );

                for (const line of bulletLines) {
                  drawText(line, margins.left + 10, yPosition, {
                    size: fontSizes.content,
                  });
                  yPosition -= 12;
                }
              }
            }
            yPosition -= 10; // Space between experiences
          }
        }
        break;

      case SECTION_TYPES.EDUCATION:
        const eduSection = section as any;
        if (eduSection.items) {
          for (const edu of eduSection.items) {
            // Degree and Institution
            const eduLine = `${edu.degree}, ${edu.institution}`;
            drawText(eduLine, margins.left, yPosition, {
              font: boldFont,
              size: fontSizes.content,
            });
            yPosition -= 15;

            // Location and dates
            if (edu.location) {
              let locationLine = edu.location;
              if (edu.startDate && edu.endDate) {
                locationLine += ` (${edu.startDate} - ${edu.endDate})`;
              }
              drawText(locationLine, margins.left, yPosition, {
                size: fontSizes.small,
              });
              yPosition -= 15;
            }

            // Highlights
            if (edu.highlights) {
              for (const highlight of edu.highlights) {
                const highlightLines = wrapText(
                  `• ${highlight}`,
                  width - margins.left - margins.right - 20,
                  regularFont,
                  fontSizes.content
                );

                for (const line of highlightLines) {
                  drawText(line, margins.left + 10, yPosition, {
                    size: fontSizes.content,
                  });
                  yPosition -= 12;
                }
              }
            }
            yPosition -= 10;
          }
        }
        break;

      case SECTION_TYPES.SKILLS:
        const skillsSection = section as any;
        if (skillsSection.items) {
          // Join skills with commas and wrap text
          const skillsText = skillsSection.items.join(', ');
          const skillLines = wrapText(
            skillsText,
            width - margins.left - margins.right,
            regularFont,
            fontSizes.content
          );

          for (const line of skillLines) {
            drawText(line, margins.left, yPosition, {
              size: fontSizes.content,
            });
            yPosition -= 15;
          }
        }
        break;

      case SECTION_TYPES.LANGUAGES:
        const langSection = section as any;
        if (langSection.items) {
          const languagesText = langSection.items.join(', ');
          const langLines = wrapText(
            languagesText,
            width - margins.left - margins.right,
            regularFont,
            fontSizes.content
          );

          for (const line of langLines) {
            drawText(line, margins.left, yPosition, {
              size: fontSizes.content,
            });
            yPosition -= 15;
          }
        }
        break;

      case SECTION_TYPES.CERTIFICATIONS:
        const certSection = section as any;
        if (certSection.items) {
          for (const cert of certSection.items) {
            const certLines = wrapText(
              `• ${cert}`,
              width - margins.left - margins.right - 20,
              regularFont,
              fontSizes.content
            );

            for (const line of certLines) {
              drawText(line, margins.left + 10, yPosition, {
                size: fontSizes.content,
              });
              yPosition -= 12;
            }
          }
        }
        break;

      case SECTION_TYPES.CUSTOM:
        const customSection = section as any;
        if (customSection.content) {
          for (const content of customSection.content) {
            const contentLines = wrapText(
              content,
              width - margins.left - margins.right,
              regularFont,
              fontSizes.content
            );

            for (const line of contentLines) {
              drawText(line, margins.left, yPosition, {
                size: fontSizes.content,
              });
              yPosition -= 15;
            }
          }
        }
        break;
    }

    yPosition -= 10; // Space between sections
  }

  // Add a footer note if needed
  if (yPosition < margins.bottom + 50) {
    drawText(
      "For extra tips, check out ultimate guide to writing an impactful resume.",
      margins.left,
      margins.bottom + 20,
      {
        size: fontSizes.small,
        color: rgb(0.5, 0.5, 0.5),
      }
    );
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  console.log("calllleddddddddd return")
  const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Export function to save PDF to file (Node.js environment)
export async function saveResumeToFile({
  resumeData,
  filename = "resume.pdf"
}: GenerateResumeProps): Promise<void> {
  const pdfBytes = await generateATSGreenResume({ resumeData, filename });



}

// Export function for browser environment (download)
export async function downloadResume({
  resumeData,
  filename = "resume.pdf"
}: GenerateResumeProps): Promise<void> {
  const pdfBytes = await generateATSGreenResume({ resumeData, filename });

  // Create blob and download link
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Example usage with sample data
/*
const sampleResumeData: ResumeData = {
  basics: {
    name: "Philip Franklin",
    email: "pfranklin@email.com",
    phone: "(555) 000-0000",
    location: "123 Bogges Street, Virginia Beach, VA 12345",
    linkedin: "linkedin.com/in/philipfranklin",
    summary: "Write 2-4 short sentences, summarizing your qualifications, core competencies, and most in-demand skills. If you are switching careers to a new niche use this space to communicate your career goals and best experiences. Remember, you are building on professional introduction."
  },
  custom: {},
  sections: [
    {
      id: "experience",
      title: "Professional Experience",
      type: "experience",
      items: [
        {
          company: "Company",
          role: "Company City, Company State",
          startDate: "June 2022",
          endDate: "Current",
          achievements: [
            "List your most recent role first.",
            "Include any key duties and some accomplishments in 3-4 bullet points.",
            "Use keywords appearing in the job ad to describe your duties.",
            "Write in present tense if you are still employed."
          ]
        },
        {
          company: "Company",
          role: "Company City, Company State", 
          startDate: "October 2018",
          endDate: "May 2022",
          achievements: [
            "Write in past tense to describe your main line of work.",
            "Use strong verbs to communicate your duties and responsibilities with impact.",
            "Include a quantifiable accomplishment (e.g. Created a marketing campaign with led to a 25% YoY increase in sales)."
          ]
        }
      ]
    },
    {
      id: "education",
      title: "Education", 
      type: "education",
      items: [
        {
          degree: "Degree, Field of Your Studies",
          institution: "School Name",
          location: "The School Location (City, State)",
          startDate: "Start Date",
          endDate: "End Date"
        }
      ]
    },
    {
      id: "skills",
      title: "Skills",
      type: "skills", 
      items: [
        "Check all of the job relevant technical and soft skills off."
      ]
    }
  ]
};

// Generate and save PDF
saveResumeToFile({
  resumeData: sampleResumeData,
  filename: "philip-franklin-resume.pdf"
});
*/