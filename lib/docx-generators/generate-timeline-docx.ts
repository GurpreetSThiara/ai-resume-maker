import { ResumeData } from "@/types/resume"
import { Document, Packer, Paragraph, TextRun, BorderStyle, WidthType, Table, TableRow, TableCell, AlignmentType } from "docx"
import { SECTION_TYPES } from "@/types/resume"

export interface DOCXGenerationOptions {
  resumeData: ResumeData
  filename?: string
}

export async function generateTimelineResumeDOCX({ resumeData, filename = "resume.docx" }: DOCXGenerationOptions) {
  const children: (Paragraph | Table)[] = []

  // Color scheme matching the template
  const primaryColor = "1a202c" // Dark gray for headings
  const accentColor = "4299e1" // Blue for timeline elements
  const textColor = "2d3748" // Medium dark gray for main text
  const secondaryColor = "4a5568" // Gray for secondary text
  const lightGray = "718096" // Light gray for dates
  const borderColor = "cbd5e0" // Very light gray for borders

  // Name - Large, bold, dark gray
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.basics.name,
          bold: true,
          size: 56, // 28pt
          color: primaryColor,
          font: "Arial",
        }),
      ],
      spacing: { after: 160 },
    }),
  )

  // Contact Info - Small, gray, single line
  const { email, phone, location, linkedin } = resumeData.basics
  const contactParts = [phone, email, location, linkedin].filter(Boolean)
  const contactInfo = contactParts.join(" • ")
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: contactInfo,
          size: 22, // 11pt
          color: secondaryColor,
          font: "Arial",
        }),
      ],
      spacing: { after: 240 },
    }),
  )

  // Summary Section (if present)
  if (resumeData.basics.summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.basics.summary,
            size: 24, // 12pt
            color: textColor,
            font: "Arial",
          }),
        ],
        spacing: { after: 240, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
      })
    )
  }

  // Custom Fields - Two column grid
  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden)

  if (customEntries.length > 0) {
    const leftColumnEntries = customEntries.filter((_, index) => index % 2 === 0)
    const rightColumnEntries = customEntries.filter((_, index) => index % 2 === 1)
    const maxRows = Math.max(leftColumnEntries.length, rightColumnEntries.length)

    const tableRows: TableRow[] = []
    for (let i = 0; i < maxRows; i++) {
      const rowCells: TableCell[] = []

      // Left column
      if (leftColumnEntries[i]) {
        const [key, item] = leftColumnEntries[i]
        rowCells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${item.title}: `,
                    bold: true,
                    size: 22,
                    color: textColor,
                    font: "Arial",
                  }),
                  new TextRun({
                    text: item.content,
                    size: 22,
                    color: secondaryColor,
                    font: "Arial",
                  }),
                ],
              }),
            ],
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            width: { size: 50, type: WidthType.PERCENTAGE },
          })
        )
      } else {
        rowCells.push(new TableCell({ children: [new Paragraph({ text: "" })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 50, type: WidthType.PERCENTAGE } }))
      }

      // Right column
      if (rightColumnEntries[i]) {
        const [key, item] = rightColumnEntries[i]
        rowCells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${item.title}: `,
                    bold: true,
                    size: 22,
                    color: textColor,
                    font: "Arial",
                  }),
                  new TextRun({
                    text: item.content,
                    size: 22,
                    color: secondaryColor,
                    font: "Arial",
                  }),
                ],
              }),
            ],
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            width: { size: 50, type: WidthType.PERCENTAGE },
          })
        )
      } else {
        rowCells.push(new TableCell({ children: [new Paragraph({ text: "" })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 50, type: WidthType.PERCENTAGE } }))
      }

      tableRows.push(new TableRow({ children: rowCells }))
    }

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
      })
    )
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }))
  }

  // Process each section
  resumeData.sections.forEach((section) => {
    // Check if section has content
    let hasContent = false
    if (section.type === SECTION_TYPES.EDUCATION || section.type === SECTION_TYPES.EXPERIENCE) {
      hasContent = section.items && section.items.length > 0
    } else if (section.type === SECTION_TYPES.SKILLS || section.type === SECTION_TYPES.LANGUAGES || section.type === SECTION_TYPES.CERTIFICATIONS) {
      hasContent = section.items && section.items.length > 0
    } else if (section.type === SECTION_TYPES.CUSTOM) {
      hasContent = section.content && section.content.length > 0 && section.content.some((item) => item.trim() !== "")
    }

    if (!hasContent) return

    // Section Title - Bold, uppercase, with bottom border
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 28, // 14pt
            color: textColor,
            font: "Arial",
          }),
        ],
        spacing: { before: 280, after: 180 },
        border: {
          bottom: {
            color: accentColor,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      })
    )

    // Education Section
    if (section.type === SECTION_TYPES.EDUCATION) {
      section.items.forEach((edu, index) => {
        // Institution and Date
        const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(" - ")
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "  ",
                size: 20,
              }),
              new TextRun({
                text: "● ",
                size: 24,
                color: accentColor,
                font: "Arial",
              }),
              new TextRun({
                text: edu.institution,
                bold: true,
                size: 26, // 13pt
                color: textColor,
                font: "Arial",
              }),
              ...(dateRange
                ? [
                    new TextRun({
                      text: "  |  ",
                      size: 22,
                      color: lightGray,
                      font: "Arial",
                    }),
                    new TextRun({
                      text: dateRange,
                      size: 22,
                      color: lightGray,
                      font: "Arial",
                    }),
                  ]
                : []),
            ],
            spacing: { before: 120, after: 60 },
          })
        )

        // Degree
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "     " + edu.degree,
                size: 24,
                color: secondaryColor,
                font: "Arial",
              }),
            ],
            spacing: { after: 60 },
          })
        )

        // Location
        if (edu.location) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "     " + edu.location,
                  size: 22,
                  color: lightGray,
                  font: "Arial",
                  italics: true,
                }),
              ],
              spacing: { after: 80 },
            })
          )
        }

        // Highlights
        if (edu.highlights && edu.highlights.length > 0) {
          edu.highlights.forEach((highlight) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "        • " + highlight,
                    size: 24,
                    color: secondaryColor,
                    font: "Arial",
                  }),
                ],
                spacing: { after: 60, line: 300 },
              })
            )
          })
        }

        // Add spacing between items
        if (index < section.items.length - 1) {
          children.push(new Paragraph({ text: "", spacing: { after: 140 } }))
        }
      })
    }

    // Experience Section
    if (section.type === SECTION_TYPES.EXPERIENCE) {
      section.items.forEach((exp, index) => {
        // Role and Date
        const dateRange = [exp.startDate, exp.endDate].filter(Boolean).join(" - ")
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "  ",
                size: 20,
              }),
              new TextRun({
                text: "● ",
                size: 24,
                color: accentColor,
                font: "Arial",
              }),
              new TextRun({
                text: exp.role,
                bold: true,
                size: 26, // 13pt
                color: textColor,
                font: "Arial",
              }),
              ...(dateRange
                ? [
                    new TextRun({
                      text: "  |  ",
                      size: 22,
                      color: lightGray,
                      font: "Arial",
                    }),
                    new TextRun({
                      text: dateRange,
                      size: 22,
                      color: lightGray,
                      font: "Arial",
                    }),
                  ]
                : []),
            ],
            spacing: { before: 120, after: 60 },
          })
        )

        // Company
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "     " + exp.company,
                size: 24,
                color: secondaryColor,
                font: "Arial",
                italics: true,
              }),
            ],
            spacing: { after: 60 },
          })
        )

        // Location
        if (exp.location) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "     " + exp.location,
                  size: 22,
                  color: lightGray,
                  font: "Arial",
                }),
              ],
              spacing: { after: 80 },
            })
          )
        }

        // Achievements
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach((achievement) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "        • " + achievement,
                    size: 24,
                    color: secondaryColor,
                    font: "Arial",
                  }),
                ],
                spacing: { after: 60, line: 300 },
              })
            )
          })
        }

        // Add spacing between items
        if (index < section.items.length - 1) {
          children.push(new Paragraph({ text: "", spacing: { after: 140 } }))
        }
      })
    }

    // Skills, Languages, Certifications
    if (section.type === SECTION_TYPES.SKILLS || section.type === SECTION_TYPES.LANGUAGES || section.type === SECTION_TYPES.CERTIFICATIONS) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "  " + section.items.join(", "),
              size: 24,
              color: secondaryColor,
              font: "Arial",
            }),
          ],
          spacing: { after: 200, line: 320 },
        })
      )
    }

    // Custom Section
    if (section.type === SECTION_TYPES.CUSTOM) {
      section.content.forEach((item) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "    • " + item,
                size: 24,
                color: secondaryColor,
                font: "Arial",
              }),
            ],
            spacing: { after: 60, line: 300 },
          })
        )
      })
    }
  })

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440, // 1 inch
              bottom: 1440, // 1 inch
              left: 1440, // 1 inch
            },
          },
        },
        children,
      },
    ],
  })

  // Generate and download
  const buffer = await Packer.toBuffer(doc)
  const blob = new Blob([buffer as unknown as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
