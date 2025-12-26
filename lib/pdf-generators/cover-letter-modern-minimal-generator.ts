import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateModernMinimalPDF(coverLetter: CoverLetter): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([612, 792]) // 8.5" x 11" in points

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

  // Header Section with border
  checkAndCreateNewPage(25)
  page.drawText(yourName, {
    x: 64,
    y: yPosition,
    size: 18,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  yPosition -= 25

  checkAndCreateNewPage(15)
  const contactInfoParts = []
  if (yourEmail) contactInfoParts.push(yourEmail)
  if (yourPhone) contactInfoParts.push(yourPhone)
  
  if (contactInfoParts.length > 0) {
    page.drawText(contactInfoParts.join(' | '), {
      x: 64,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    })
    yPosition -= 15
  }

  checkAndCreateNewPage(15)
  page.drawText(yourAddress, {
    x: 64,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 25

  // Border line
  checkAndCreateNewPage(40)
  page.drawLine({
    start: { x: 64, y: yPosition },
    end: { x: 548, y: yPosition },
    thickness: 2,
    color: rgb(0.8, 0.8, 0.8),
  })
  yPosition -= 40

  // Date
  checkAndCreateNewPage(35)
  page.drawText(format(new Date(content.date), "MMMM d, yyyy"), {
    x: 64,
    y: yPosition,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 35

  // Recipient
  checkAndCreateNewPage(15)
  page.drawText(recipient.name, {
    x: 64,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  yPosition -= 15

  checkAndCreateNewPage(15)
  page.drawText(recipient.title, {
    x: 64,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })
  yPosition -= 15

  checkAndCreateNewPage(15)
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
    checkAndCreateNewPage(12)
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
            checkAndCreateNewPage(lineHeight)
            page.drawText(currentLine, {
              x: 64,
              y: yPosition,
              size: 11,
              font: helvetica,
              color: rgb(0.1, 0.1, 0.1),
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
          x: 64,
          y: yPosition,
          size: 11,
          font: helvetica,
          color: rgb(0.1, 0.1, 0.1),
        })
        yPosition -= lineHeight
      }
    })
    yPosition -= 8
  })

  // Signature
  checkAndCreateNewPage(15)
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
