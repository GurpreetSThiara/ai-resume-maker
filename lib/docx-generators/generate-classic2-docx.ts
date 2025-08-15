import { ResumeData } from "@/types/resume"
import { Document, Packer, Paragraph, TextRun, BorderStyle, WidthType, Table, TableRow, TableCell } from "docx"

export interface DOCXGenerationOptions {
  resumeData: ResumeData
  filename?: string
}

export async function generateClassic2ResumeDOCX({ resumeData, filename = "resume.docx" }: DOCXGenerationOptions) {
  const children: (Paragraph | Table)[] = []

  // Colors matching PDF generator
  const accentColor = "2666A6" // rgb(0.15, 0.4, 0.65) converted to hex
  const textColor = "333333" // Darker gray for better readability
  const secondaryColor = "666666" // Medium gray
  const linkColor = "0000FF" // rgb(0, 0, 1) converted to hex
  const borderColor = "CCCCCC" // Light gray for borders

  // Name - Large, bold, blue
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.name,
          bold: true,
          size: 40, // Reduced from 48 to 40
          color: textColor,
          font: "Arial",
        }),
      ],
      spacing: { after: 160 }, // Reduced from 240 to 160
    }),
  )

  // Contact Info - Small, gray
  const contactInfo = `${resumeData.email} | ${resumeData.phone} | ${resumeData.location} | ${resumeData.linkedin}`
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: contactInfo,
          size: 22, // 11pt in half-points
          color: secondaryColor,
          font: "Arial",
        }),
      ],
      spacing: { after: 120 }, // Reduced from 200 to 120
    }),
  )

  // Custom Details - Grid layout using table
  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden)

  if (customEntries.length > 0) {
    const leftColumnEntries = customEntries.filter((_, index) => index % 2 === 0)
    const rightColumnEntries = customEntries.filter((_, index) => index % 2 === 1)
    const maxRows = Math.max(leftColumnEntries.length, rightColumnEntries.length)

    for (let i = 0; i < maxRows; i++) {
      const rowCells = []

      // Left column
      if (leftColumnEntries[i]) {
        const [key, item] = leftColumnEntries[i]
        rowCells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${item.title.toUpperCase()}: `,
                    bold: true,
                    size: 20,
                    color: textColor,
                    font: "Arial",
                  }),
                  new TextRun({
                    text: item.content,
                    size: 20,
                    color: textColor,
                    font: "Arial",
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        )
      } else {
        rowCells.push(
          new TableCell({
            children: [new Paragraph({ text: "" })],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        )
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
                    text: `${item.title.toUpperCase()}: `,
                    bold: true,
                    size: 20,
                    color: textColor,
                    font: "Arial",
                  }),
                  new TextRun({
                    text: item.content,
                    size: 20,
                    color: textColor,
                    font: "Arial",
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        )
      } else {
        rowCells.push(
          new TableCell({
            children: [new Paragraph({ text: "" })],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        )
      }

      const customTable = new Table({
        rows: [new TableRow({ children: rowCells })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
      })

      children.push(customTable)
    }

    // Add spacing after custom section
    children.push(new Paragraph({ text: "", spacing: { after: 120 } })) // Reduced from 200 to 120
  }

  // Sections
  for (const section of resumeData.sections) {
    // Check if section has content
    const hasContent = Object.entries(section.content).some(([key, bullets]) => {
      return key && bullets && bullets.length > 0 && bullets.some((bullet) => bullet.trim() !== "")
    })

    if (!hasContent) continue

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 28, // 14pt in half-points
            color: textColor,
            font: "Arial",
          }),
        ],
        spacing: { after: 120 }, // Reduced from 200 to 120
      }),
    )

    // Section Content
    for (const [key, bullets] of Object.entries(section.content)) {
      if (!key || !bullets || bullets.length === 0) continue

      const hasBulletContent = bullets.some((bullet) => bullet.trim() !== "")
      if (!hasBulletContent) continue

      const [title, subtitle] = key.split(" | ")

      if (title && title.trim() !== "") {
        const headerCells = [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 24, // 12pt
                    color: textColor,
                    font: "Arial",
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            width: { size: 70, type: WidthType.PERCENTAGE },
          }),
        ]

        if (subtitle && subtitle.trim() !== "") {
          headerCells.push(
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: subtitle,
                      size: 20, // 10pt
                      color: secondaryColor,
                      font: "Arial",
                    }),
                  ],
                  alignment: "right",
                }),
              ],
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              width: { size: 30, type: WidthType.PERCENTAGE },
            }),
          )
        }

        const headerTable = new Table({
          rows: [new TableRow({ children: headerCells })],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
        })

        children.push(headerTable)
      }

      // Bullets
      for (const bullet of bullets) {
        if (!bullet || bullet.trim() === "") continue

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${bullet}`,
                size: 20, // 10pt
                color: textColor,
                font: "Arial",
              }),
            ],
            indent: { left: 360 }, // Consistent indentation
            spacing: { after: 80 }, // Reduced from 120 to 80
          }),
        )
      }

      // Add spacing between entries
      children.push(new Paragraph({ text: "", spacing: { after: 100 } })) // Reduced from 160 to 100
    }

    // Add spacing between sections
    children.push(new Paragraph({ text: "", spacing: { after: 160 } })) // Reduced from 240 to 160
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 576, // Reduced from 720 to 576 (0.4 inch) for more compact layout
              right: 576,
              bottom: 576,
              left: 576,
            },
          },
        },
        children,
      },
    ],
  })

  // Generate and download
  const buffer = await Packer.toBuffer(doc)
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
