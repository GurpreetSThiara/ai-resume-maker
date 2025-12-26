import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } from "docx"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateSplitHeaderDOCX(coverLetter: CoverLetter): Promise<Uint8Array> {
  const { applicant , recipient , content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const yourTitle = applicant.professionalTitle
  const yourEmail = applicant.contactInfo.email
  const yourPhone = applicant.contactInfo.phone
  const yourAddress = applicant.contactInfo.address
  const yourLinkedin = applicant.contactInfo.linkedin

  const opening = content.openingParagraph.text
  const bodyParagraphs = content.bodyParagraphs
  const closing = content.closingParagraph.text
  const recipientAddress = recipient.address

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Split Header Layout - Two Column Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  // Left Column - Name and Title
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: yourName,
                            bold: true,
                            size: 28, // 14pt
                            color: "000000",
                            font: "Helvetica",
                          }),
                        ],
                        spacing: { after: 120 },
                      }),
                      // Professional title if exists
                      ...(yourTitle ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: yourTitle,
                              size: 22, // 11pt
                              color: "666666",
                              font: "Helvetica",
                            }),
                          ],
                          spacing: { after: 180 },
                        })
                      ] : []),
                    ],
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: {
                      top: { style: "none", size: 0 },
                      bottom: { style: "none", size: 0 },
                      left: { style: "none", size: 0 },
                      right: { style: "none", size: 0 },
                    },
                  }),
                  // Right Column - Contact Info
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: yourAddress,
                            size: 22, // 11pt
                            color: "666666",
                            font: "Helvetica",
                          }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 60 },
                      }),

                      new Paragraph({
                        children: [
                          new TextRun({
                            text: yourPhone,
                            size: 22, // 11pt
                            color: "666666",
                            font: "Helvetica",
                          }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 60 },
                      }),

                      new Paragraph({
                        children: [
                          new TextRun({
                            text: yourEmail,
                            size: 22, // 11pt
                            color: "666666",
                            font: "Helvetica",
                          }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 60 },
                      }),

                      // Social links if any exist
                      ...(yourLinkedin ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: yourLinkedin,
                              size: 22, // 11pt
                              color: "666666",
                              font: "Helvetica",
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
                          spacing: { after: 60 },
                        })
                      ] : []),
                    ],
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: {
                      top: { style: "none", size: 0 },
                      bottom: { style: "none", size: 0 },
                      left: { style: "none", size: 0 },
                      right: { style: "none", size: 0 },
                    },
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: "none", size: 0 },
              bottom: { style: "none", size: 0 },
              left: { style: "none", size: 0 },
              right: { style: "none", size: 0 },
              insideHorizontal: { style: "none", size: 0 },
              insideVertical: { style: "none", size: 0 },
            },
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: format(new Date(content.date), "MMMM d, yyyy"),
                size: 22, // 11pt
                color: "666666",
                font: "Helvetica",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Recipient Information
          new Paragraph({
            children: [
              new TextRun({
                text: recipient.name,
                bold: true,
                size: 22, // 11pt
                color: "000000",
                font: "Helvetica",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipient.title,
                size: 22, // 11pt
                color: "666666",
                font: "Helvetica",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipient.company,
                size: 22, // 11pt
                color: "666666",
                font: "Helvetica",
              }),
            ],
            spacing: { after: 60 },
          }),

          // Recipient address
          ...recipientAddress.split("\n").map((line) => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 22, // 11pt
                  color: "666666",
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 60 },
            })
          ),

          // Salutation
          ...(content.salutation ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: content.salutation,
                  size: 22, // 11pt
                  color: "000000",
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 200 },
            }),
          ] : []),

          // Content paragraphs
          new Paragraph({
            children: [
              new TextRun({
                text: opening,
                size: 22, // 11pt
                color: "000000",
                font: "Helvetica",
              }),
            ],
            spacing: { after: 160 },
          }),

          // Body paragraphs - separate for each paragraph
          ...bodyParagraphs.map((para) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: para.text,
                  size: 22, // 11pt
                  color: "000000",
                  font: "Helvetica",
                }),
              ],
              spacing: { after: 160 },
            })
          ),

          new Paragraph({
            children: [
              new TextRun({
                text: closing,
                size: 22, // 11pt
                color: "000000",
                font: "Helvetica",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Signature
          new Paragraph({
            children: [
              new TextRun({
                text: "Sincerely,",
                size: 22, // 11pt
                color: "000000",
                font: "Helvetica",
              }),
            ],
            spacing: { after: 240 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: yourName,
                bold: true,
                size: 22, // 11pt
                color: "000000",
                font: "Helvetica",
              }),
            ],
          }),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}
