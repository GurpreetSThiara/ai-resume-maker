import { Document, Packer, Paragraph, TextRun } from "docx"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateCoverLetterDOCX(coverLetter: CoverLetter): Promise<Uint8Array> {
  const { applicant , recipient , content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const yourEmail = applicant.contactInfo.email
  const yourPhone = applicant.contactInfo.phone
  const yourAddress = applicant.contactInfo.address

  const opening = content.openingParagraph.text
  const body = content.bodyParagraphs.map((p) => p.text).join("\n\n")
  const closing = content.closingParagraph.text
  const recipientAddress = recipient.address

  // Build contact info parts
  const contactInfoParts = []
  if (yourPhone) contactInfoParts.push(yourPhone)
  if (yourEmail) contactInfoParts.push(yourEmail)

  // Build children array
  const children = [
    // Simple header block
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

    new Paragraph({
      children: [
        new TextRun({
          text: yourAddress,
          size: 22, // 11pt
          color: "000000",
          font: "Helvetica",
        }),
      ],
      spacing: { after: 60 },
    }),

    // Contact info - phone and email with conditional separator
    ...(contactInfoParts.length > 0 ? [
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfoParts.join(' | '),
            size: 22, // 11pt
            color: "000000",
            font: "Helvetica",
          }),
        ],
        spacing: { after: 320 },
      }),
    ] : []),

    // Date
    new Paragraph({
      children: [
        new TextRun({
          text: format(new Date(content.date), "MMMM d, yyyy"),
          size: 22, // 11pt
          color: "000000",
          font: "Helvetica",
        }),
      ],
      spacing: { after: 240 },
    }),

    // Recipient block
    new Paragraph({
      children: [
        new TextRun({
          text: recipient.name,
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
          color: "000000",
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
          color: "000000",
          font: "Helvetica",
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
          font: "Helvetica",
        }),
      ],
      spacing: { after: 300 },
    }),

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
        spacing: { after: 240 },
      }),
    ] : []),

    // Content
    new Paragraph({
      children: [
        new TextRun({
          text: opening,
          size: 22, // 11pt
          color: "000000",
          font: "Helvetica",
        }),
      ],
      spacing: { after: 180 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: body,
          size: 22, // 11pt
          color: "000000",
          font: "Helvetica",
        }),
      ],
      spacing: { after: 180 },
    }),

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
  ]

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
        children,
      },
    ],
  })

  return await Packer.toBuffer(doc)
}
