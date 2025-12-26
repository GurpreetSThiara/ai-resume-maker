import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateProfessionalStandardPDF(coverLetter: CoverLetter): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([612, 792])

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { applicant , recipient , content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const yourEmail = applicant.contactInfo.email
  const yourPhone = applicant.contactInfo.phone
  const yourAddress = applicant.contactInfo.address

  const opening = content.openingParagraph.text
  const body = content.bodyParagraphs.map((p) => p.text).join("\n\n")
  const closing = content.closingParagraph.text
  const recipientAddress = recipient.address

  let yPosition = 720
  const pageHeight = 792
  const bottomMargin = 72
  const lineHeight = 16
  
  // Helper function to check if we need a new page
  const checkAndCreateNewPage = (requiredSpace: number) => {
    if (yPosition - requiredSpace < bottomMargin) {
      page = pdfDoc.addPage([612, 792])
      yPosition = pageHeight - 72
    }
  }

  // Centered Header
  checkAndCreateNewPage(25)
  const nameWidth = helveticaBold.widthOfTextAtSize(yourName.toUpperCase(), 14)
  page.drawText(yourName.toUpperCase(), {
    x: (612 - nameWidth) / 2,
    y: yPosition,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })
  yPosition -= 25

  checkAndCreateNewPage(15)
  const addressWidth = helvetica.widthOfTextAtSize(yourAddress, 10)
  page.drawText(yourAddress, {
    x: (612 - addressWidth) / 2,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  checkAndCreateNewPage(15)
  const contactInfoParts = []
  if (yourPhone) contactInfoParts.push(yourPhone)
  if (yourEmail) contactInfoParts.push(yourEmail)
  
  if (contactInfoParts.length > 0) {
    const contactInfo = contactInfoParts.join(' | ')
    const contactWidth = helvetica.widthOfTextAtSize(contactInfo, 10)
    page.drawText(contactInfo, {
      x: (612 - contactWidth) / 2,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: rgb(0, 0, 0),
    })
    yPosition -= 15
  }

  // Date
  checkAndCreateNewPage(35)
  page.drawText(format(new Date(content.date), "MMMM d, yyyy"), {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 35

  // Recipient
  checkAndCreateNewPage(15)
  page.drawText(recipient.name, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  checkAndCreateNewPage(15)
  page.drawText(recipient.title, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  checkAndCreateNewPage(15)
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
    checkAndCreateNewPage(15)
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
  checkAndCreateNewPage(35)
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
            checkAndCreateNewPage(lineHeight)
            page.drawText(currentLine, {
              x: 72,
              y: yPosition,
              size: 11,
              font: helvetica,
              color: rgb(0, 0, 0),
            })
            yPosition -= lineHeight
          }
          currentLine = word
        } else {
          currentLine = testLine
        }
      })

      if (currentLine) {
        checkAndCreateNewPage(lineHeight)
        page.drawText(currentLine, {
          x: 72,
          y: yPosition,
          size: 11,
          font: helvetica,
          color: rgb(0, 0, 0),
        })
        yPosition -= lineHeight
      }
    })
    yPosition -= 8
  })

  // Signature
  checkAndCreateNewPage(45)
  yPosition -= 15
  page.drawText("Sincerely,", {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  })
  yPosition -= 30

  checkAndCreateNewPage(15)
  page.drawText(yourName, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  return pdfDoc.save()
}
