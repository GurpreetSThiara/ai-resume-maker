import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateProfessionalStandardDOCX(coverLetter: CoverLetter): Promise<Uint8Array> {
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
    .join(", ")

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
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Centered Header
          new Paragraph({
            children: [
              new TextRun({
                text: yourName.toUpperCase(),
                bold: true,
                size: 28, // 14pt
                color: "000000",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: yourAddress,
                size: 20, // 10pt
                color: "000000",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${yourPhone} • ${yourEmail}`,
                size: 20, // 10pt
                color: "000000",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: format(new Date(content.date), "MMMM d, yyyy"),
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Recipient
          new Paragraph({
            children: [
              new TextRun({
                text: recipient.name,
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipient.title,
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipient.company,
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 60 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: recipientAddress,
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Subject line
          new Paragraph({
            children: [
              new TextRun({
                text: "RE: Application for Position",
                bold: true,
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Content
          new Paragraph({
            children: [
              new TextRun({
                text: opening,
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 160 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: body,
                size: 22, // 11pt
                color: "000000",
              }),
            ],
            spacing: { after: 160 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: closing,
                size: 22, // 11pt
                color: "000000",
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
              }),
            ],
          }),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}
