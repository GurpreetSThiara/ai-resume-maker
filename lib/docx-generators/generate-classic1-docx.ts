import { ResumeData } from "@/types/resume"
import { Document, Packer, Paragraph, TextRun, BorderStyle, WidthType, Table, TableRow, TableCell } from "docx"

export interface DOCXGenerationOptions {
  resumeData: ResumeData
  filename?: string
}

export async function generateClassic1ResumeDOCX({ resumeData, filename = "resume.docx" }: DOCXGenerationOptions) {
  const children: (Paragraph | Table)[] = []

  // Colors matching PDF generator
  const accentColor = "2666A6" // rgb(0.15, 0.4, 0.65) converted to hex
  const textColor = "1A1A1A" // rgb(0.1, 0.1, 0.1) converted to hex
  const secondaryColor = "666666" // rgb(0.4, 0.4, 0.4) converted to hex
  const linkColor = "0000FF" // rgb(0, 0, 1) converted to hex

  // Name - Large, bold, blue
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.name,
          bold: true,
          size: 40, // 20pt in half-points
          color: accentColor,
          font: "Helvetica",
        }),
      ],
      spacing: { after: 200 },
    }),
  )

  // Contact Info - Small, gray
  const contactInfo = `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: contactInfo,
          size: 20, // 10pt in half-points
          color: secondaryColor,
          font: "Helvetica",
        }),
      ],
      spacing: { after: 300 },
    }),
  )

  // Custom Details - Flex-wrap style layout using table
  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden)

  if (customEntries.length > 0) {
    // Create table for custom details to simulate flex-wrap
    const customRows: TableRow[] = []
    let currentRowCells: TableCell[] = []
    const maxCellsPerRow = 3 // Adjust based on content width

    customEntries.forEach((entry, index) => {
      const [key, item] = entry
      const cell = new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${item.title}: `,
                bold: true,
                size: 20, // 10pt
                color: textColor,
                font: "Helvetica",
              }),
              new TextRun({
                text: item.content,
                size: 20, // 10pt
                color: item.link ? linkColor : textColor,
                font: "Helvetica",
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
        margins: { top: 50, bottom: 50, left: 0, right: 200 },
      })

      currentRowCells.push(cell)

      // Create new row when we have enough cells or it's the last item
      if (currentRowCells.length === maxCellsPerRow || index === customEntries.length - 1) {
        // Fill remaining cells if needed
        while (currentRowCells.length < maxCellsPerRow) {
          currentRowCells.push(
            new TableCell({
              children: [new Paragraph({ text: "" })],
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
            }),
          )
        }

        customRows.push(new TableRow({ children: [...currentRowCells] }))
        currentRowCells = []
      }
    })

    const customTable = new Table({
      rows: customRows,
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

    // Add spacing after custom section
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }))
  }

  // Sections
  for (const section of resumeData.sections) {
    // Check if section has content
    const hasContent = Object.entries(section.content).some(([key, bullets]) => {
      return key && bullets && bullets.length > 0 && bullets.some((bullet) => bullet.trim() !== "")
    })

    if (!hasContent) continue

    // Section Title with underline
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title,
            bold: true,
            size: 28, // 14pt in half-points
            color: accentColor,
            font: "Helvetica",
          }),
        ],
        border: {
          bottom: {
            color: accentColor,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { after: 200 },
      }),
    )

    // Section Content
    for (const [key, bullets] of Object.entries(section.content)) {
      if (!key || !bullets || bullets.length === 0) continue

      const hasBulletContent = bullets.some((bullet) => bullet.trim() !== "")
      if (!hasBulletContent) continue

      const [title, subtitle] = key.split(" | ")

      // Title
      if (title && title.trim() !== "") {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 22, // 11pt in half-points
                color: textColor,
                font: "Helvetica",
              }),
            ],
            spacing: { after: 100 },
          }),
        )
      }

      // Subtitle
      if (subtitle && subtitle.trim() !== "") {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: subtitle,
                size: 18, // 9pt in half-points
                color: secondaryColor,
                font: "Helvetica",
              }),
            ],
            spacing: { after: 100 },
          }),
        )
      }

      // Bullets
      for (const bullet of bullets) {
        if (!bullet || bullet.trim() === "") continue

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${bullet}`,
                size: 20, // 10pt in half-points
                color: textColor,
                font: "Helvetica",
              }),
            ],
            indent: { left: 240 }, // Indent for bullet points
            spacing: { after: 100 },
          }),
        )
      }

      // Add spacing between entries
      children.push(new Paragraph({ text: "", spacing: { after: 100 } }))
    }

    // Add spacing between sections
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }))
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch in twips (720 twips = 0.5 inch)
              right: 720,
              bottom: 720,
              left: 720,
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
