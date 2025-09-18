import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateProfessionalStandardPDF(coverLetter: CoverLetter): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])

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

  let yPosition = 720

  // Centered Header
  const nameWidth = helveticaBold.widthOfTextAtSize(yourName.toUpperCase(), 14)
  page.drawText(yourName.toUpperCase(), {
    x: (612 - nameWidth) / 2,
    y: yPosition,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })
  yPosition -= 25

  const addressWidth = helvetica.widthOfTextAtSize(yourAddress, 10)
  page.drawText(yourAddress, {
    x: (612 - addressWidth) / 2,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  const contactInfo = `${yourPhone} • ${yourEmail}`
  const contactWidth = helvetica.widthOfTextAtSize(contactInfo, 10)
  page.drawText(contactInfo, {
    x: (612 - contactWidth) / 2,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 50

  // Date
  page.drawText(format(new Date(content.date), "MMMM d, yyyy"), {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 35

  // Recipient
  page.drawText(recipient.name, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  page.drawText(recipient.title, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  page.drawText(recipient.company, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  const addressLines = recipientAddress.split("\n")
  addressLines.forEach((line) => {
    page.drawText(line, {
      x: 72,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: rgb(0, 0, 0),
    })
    yPosition -= 15
  })
  yPosition -= 20

  // Subject line
  page.drawText("RE: Application for Position", {
    x: 72,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })
  yPosition -= 35

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

        if (textWidth > 468) {
          if (currentLine) {
            page.drawText(currentLine, {
              x: 72,
              y: yPosition,
              size: 11,
              font: helvetica,
              color: rgb(0, 0, 0),
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
          x: 72,
          y: yPosition,
          size: 11,
          font: helvetica,
          color: rgb(0, 0, 0),
        })
        yPosition -= 16
      }
    })
    yPosition -= 8
  })

  // Signature
  yPosition -= 15
  page.drawText("Sincerely,", {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 30

  page.drawText(yourName, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  return pdfDoc.save()
}
