import { ResumeData } from "@/types/resume"
import { Document, Packer, Paragraph, TextRun, BorderStyle, WidthType, Table, TableRow, TableCell } from "docx"

export interface DOCXGenerationOptions {
  resumeData: ResumeData
  filename?: string
}

export async function generateClassic1ResumeDOCX({ resumeData, filename = "resume.docx" }: DOCXGenerationOptions) {
  // Create an array to store all document children
  const documentChildren: (Paragraph | Table)[] = []

  // Colors matching PDF generator
  const accentColor = "2666A6" // rgb(0.15, 0.4, 0.65) converted to hex
  const textColor = "1A1A1A" // rgb(0.1, 0.1, 0.1) converted to hex
  const secondaryColor = "666666" // rgb(0.4, 0.4, 0.4) converted to hex
  const linkColor = "0000FF" // rgb(0, 0, 1) converted to hex

  // Name - Large, bold, blue
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.basics.name,
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
  const { email, phone, location, linkedin } = resumeData.basics
  const contactInfo = [email, phone, location, linkedin].filter(Boolean).join(" | ")
  documentChildren.push(
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

  // // LinkedIn link
  // if (resumeData.basics.linkedin) {
  //   documentChildren.push(
  //     new Paragraph({
  //       children: [
  //         new TextRun({
  //           text: resumeData.basics.linkedin,
  //           size: 20,
  //           color: linkColor,
  //           font: "Helvetica",
  //         }),
  //       ],
  //       spacing: { after: 200 },
  //     }),
  //   )
  // }

  // Summary
  if (resumeData.basics.summary) {
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.basics.summary,
            size: 20,
            color: textColor,
            font: "Helvetica",
          }),
        ],
        spacing: { after: 300 },
      }),
    )
  }

  // Custom Information Section
  const customEntries = Object.entries(resumeData.custom || {})
  if (customEntries.length > 0) {
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Custom Information",
            bold: true,
            size: 28, // 14pt
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

    customEntries.forEach(([key, item]) => {
      if (item.hidden) return
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${item.title}: `,
              bold: true,
              size: 20,
              color: textColor,
              font: "Helvetica",
            }),
            new TextRun({
              text: item.content || "",
              size: 20,
              color: textColor,
              font: "Helvetica",
            }),
          ],
          spacing: { after: 120 },
        }),
      )
    })

    documentChildren.push(new Paragraph({ spacing: { after: 240 } }))
  }

  // Sections
  for (const section of resumeData.sections) {
    // Section Title with underline
    documentChildren.push(
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

    switch (section.type) {
      case "education":
        for (const edu of section.items) {
          // Institution
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.institution,
                  bold: true,
                  size: 24, // 12pt
                  color: textColor,
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 120 },
            }),
          )

          // Degree and dates
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  size: 20, // 10pt
                  color: textColor,
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 120 },
            }),
          )

          // Dates and location
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.startDate} - ${edu.endDate}${edu.location ? ` • ${edu.location}` : ''}`,
                  size: 20, // 10pt
                  color: secondaryColor,
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 120 },
            }),
          )

          // Highlights
          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              documentChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${highlight}`,
                      size: 20,
                      color: textColor,
                      font: "Helvetica",
                    }),
                  ],
                  spacing: { after: 120 },
                  indent: { left: 360 }, // 0.25 inch in twips
                }),
              )
            }
          }

          // Spacing between entries
          documentChildren.push(new Paragraph({ spacing: { after: 240 } }))
        }
        break;

      case "experience":
        for (const exp of section.items) {
          // Company and role
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.company,
                  bold: true,
                  size: 24,
                  color: textColor,
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 120 },
            }),
          )

          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.role,
                  size: 20,
                  color: textColor,
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 120 },
            }),
          )

          // Dates and location
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.startDate} - ${exp.endDate}${exp.location ? ` • ${exp.location}` : ''}`,
                  size: 20,
                  color: secondaryColor,
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 120 },
            }),
          )

          // Achievements
          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              documentChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${achievement}`,
                      size: 20,
                      color: textColor,
                      font: "Helvetica",
                    }),
                  ],
                  spacing: { after: 120 },
                  indent: { left: 360 },
                }),
              )
            }
          }

          // Spacing between entries
          documentChildren.push(new Paragraph({ spacing: { after: 240 } }))
        }
        break;

      case "skills":
      case "languages":
      case "certifications":
        if (section.items?.length) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: section.items.join(" • "),
                  size: 20,
                  color: textColor,
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 240 },
            }),
          )
        }
        break;

      case "custom":
        if (section.content?.length) {
          for (const item of section.content) {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${item}`,
                    size: 20,
                    color: textColor,
                    font: "Helvetica",
                  }),
                ],
                spacing: { after: 120 },
                indent: { left: 360 },
              }),
            )
          }
          documentChildren.push(new Paragraph({ spacing: { after: 240 } }))
        }
        break;
    }
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
        children: documentChildren,
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
