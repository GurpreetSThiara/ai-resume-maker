import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateModernMinimalPDF(coverLetter: CoverLetter): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // 8.5" x 11" in points

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

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

  let yPosition = 720

  // Header Section with border
  page.drawText(yourName, {
    x: 64,
    y: yPosition,
    size: 18,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  yPosition -= 25

  page.drawText(`${yourEmail} | ${yourPhone}`, {
    x: 64,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 15

  page.drawText(yourAddress, {
    x: 64,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 25

  // Border line
  page.drawLine({
    start: { x: 64, y: yPosition },
    end: { x: 548, y: yPosition },
    thickness: 2,
    color: rgb(0.8, 0.8, 0.8),
  })
  yPosition -= 40

  // Date
  page.drawText(format(new Date(content.date), "MMMM d, yyyy"), {
    x: 64,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 35

  // Recipient
  page.drawText(recipient.name, {
    x: 64,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  yPosition -= 15

  page.drawText(recipient.title, {
    x: 64,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })
  yPosition -= 15

  page.drawText(recipient.company, {
    x: 64,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })
  yPosition -= 15

  const addressLines = recipientAddress.split("\n")
  addressLines.forEach((line) => {
    page.drawText(line, {
      x: 64,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    })
    yPosition -= 12
  })
  yPosition -= 20

  // Content paragraphs
  const paragraphs = [opening, body, closing]
  paragraphs.forEach((paragraph) => {
    const lines = paragraph.split("\n")
    lines.forEach((line) => {
      const words = line.split(" ")
      let currentLine = ""

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word
        const textWidth = helvetica.widthOfTextAtSize(testLine, 11)

        if (textWidth > 484) {
          // Max width
          if (currentLine) {
            page.drawText(currentLine, {
              x: 64,
              y: yPosition,
              size: 11,
              font: helvetica,
              color: rgb(0.1, 0.1, 0.1),
            })
            yPosition -= 16
          }
          currentLine = word
        } else {
          currentLine = testLine
        }
      })

      if (currentLine) {
        page.drawText(currentLine, {
          x: 64,
          y: yPosition,
          size: 11,
          font: helvetica,
          color: rgb(0.1, 0.1, 0.1),
        })
        yPosition -= 16
      }
    })
    yPosition -= 8
  })

  // Signature
  yPosition -= 15
  page.drawText(yourName, {
    x: 64,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })

  return pdfDoc.save()
}
