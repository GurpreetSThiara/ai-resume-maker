import { Document, Packer, Paragraph, TextRun, BorderStyle } from "docx"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateModernMinimalDOCX(coverLetter: CoverLetter): Promise<Uint8Array> {
  const { applicant , recipient , content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const yourEmail = applicant.contactInfo.email
  const yourPhone = applicant.contactInfo.phone
  const yourAddress = [
    applicant.contactInfo.address.street,
    `${applicant.contactInfo.address.city}, ${applicant.contactInfo.address.state} ${applicant.contactInfo.address.zipCode}`,
    applicant.contactInfo.address.country,
  ]
    .filter(Boolean)
    .join(" | ")

  const opening = content.openingParagraph.text
  const body = content.bodyParagraphs.map((p) => p.text).join("\n\n")
  const closing = content.closingParagraph.text
  const recipientAddress = [
    recipient.address.street,
    `${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`,
  ]
    .filter(Boolean)
    .join("\n")

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Header with name
          new Paragraph({
            children: [
              new TextRun({
                text: yourName,
                bold: true,
                size: 36, // 18pt
                color: "1a1a1a",
              }),
            ],
            spacing: { after: 120 },
          }),

          // Contact info
          new Paragraph({
            children: [
              new TextRun({
                text: `${yourEmail} | ${yourPhone}`,
                size: 20, // 10pt
                color: "666666",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: yourAddress,
                size: 20, // 10pt
                color: "666666",
              }),
            ],
            spacing: { after: 240 },
            border: {
              bottom: {
                color: "cccccc",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 12,
              },
            },
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: format(new Date(content.date), "MMMM d, yyyy"),
                size: 20, // 10pt
                color: "666666",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Recipient info
          new Paragraph({
            children: [
              new TextRun({
                text: recipient.name,
                bold: true,
                size: 22, // 11pt
                color: "1a1a1a",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipient.title,
                size: 22, // 11pt
                color: "4d4d4d",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipient.company,
                size: 22, // 11pt
                color: "4d4d4d",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipientAddress,
                size: 20, // 10pt
                color: "666666",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Content paragraphs
          new Paragraph({
            children: [
              new TextRun({
                text: opening,
                size: 22, // 11pt
                color: "1a1a1a",
              }),
            ],
            spacing: { after: 240, line: 360 }, // 1.5 line spacing
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: body,
                size: 22, // 11pt
                color: "1a1a1a",
              }),
            ],
            spacing: { after: 240, line: 360 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: closing,
                size: 22, // 11pt
                color: "1a1a1a",
              }),
            ],
            spacing: { after: 240, line: 360 },
          }),

          // Signature
          new Paragraph({
            children: [
              new TextRun({
                text: yourName,
                bold: true,
                size: 22, // 11pt
                color: "1a1a1a",
              }),
            ],
            spacing: { before: 240 },
          }),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}
