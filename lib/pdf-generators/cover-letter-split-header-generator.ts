import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

export async function generateSplitHeaderPDF(coverLetter: CoverLetter): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([612, 792])

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { applicant , recipient , content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const yourTitle = applicant.professionalTitle
  const yourEmail = applicant.contactInfo.email
  const yourPhone = applicant.contactInfo.phone
  const yourAddress = applicant.contactInfo.address
  const yourLinkedin = applicant.contactInfo.linkedin
  // const yourPortfolio = applicant.contactInfo.portfolio
  // const yourGithub = applicant.contactInfo.github

  const opening = content.openingParagraph.text
  const body = content.bodyParagraphs.map((p) => p.text).join("\n\n")
  const closing = content.closingParagraph.text
  const salutation = content.salutation
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

  // Split Header Layout
  checkAndCreateNewPage(40)
  
  // Left Side - Name (bold at top left)
  page.drawText(yourName, {
    x: 72,
    y: yPosition,
    size: 20,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })
  yPosition -= 25

  // Professional title if exists
  if (yourTitle) {
    checkAndCreateNewPage(20)
    page.drawText(yourTitle, {
      x: 72,
      y: yPosition,
      size: 12,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    })
    yPosition -= 18
  }

  // Right Side - Contact Info (top right)
  let rightYPosition = 720
  
  // Helper function to wrap text for right side
  const wrapTextForRightSide = (text: string, maxWidth: number) => {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const textWidth = helvetica.widthOfTextAtSize(testLine, 11)
      
      if (textWidth > maxWidth) {
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          // Word is too long, break it
          lines.push(word)
          currentLine = ''
        }
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }
  
  // Address with proper wrapping
  const applicantAddressLines = wrapTextForRightSide(yourAddress, 200) // 200 points max width
  applicantAddressLines.forEach((line) => {
    checkAndCreateNewPage(15)
    const textWidth = helvetica.widthOfTextAtSize(line, 11)
    page.drawText(line, {
      x: 540 - textWidth, // Right align: 540 (page width - right margin) - text width
      y: rightYPosition,
      size: 11,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    })
    rightYPosition -= 15
  })

  checkAndCreateNewPage(15)
  const phoneTextWidth = helvetica.widthOfTextAtSize(yourPhone, 11)
  page.drawText(yourPhone, {
    x: 540 - phoneTextWidth, // Right align
    y: rightYPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  rightYPosition -= 15

  checkAndCreateNewPage(15)
  const emailTextWidth = helvetica.widthOfTextAtSize(yourEmail, 11)
  page.drawText(yourEmail, {
    x: 540 - emailTextWidth, // Right align
    y: rightYPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  rightYPosition -= 15

  // Social links if any exist
  const socialLinks = []
  if (yourLinkedin) socialLinks.push(yourLinkedin)
  // if (yourPortfolio) socialLinks.push(`Portfolio: ${yourPortfolio}`)
  // if (yourGithub) socialLinks.push(`GitHub: ${yourGithub}`)
  
  if (socialLinks.length > 0) {
    socialLinks.forEach((socialLink) => {
      checkAndCreateNewPage(15)
      const socialTextWidth = helvetica.widthOfTextAtSize(socialLink, 11)
      page.drawText(socialLink, {
        x: 540 - socialTextWidth, // Right align
        y: rightYPosition,
        size: 11,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4),
      })
      rightYPosition -= 15
    })
  }

  // Reset yPosition to account for the right side content
  yPosition = Math.min(yPosition, rightYPosition) - 30

  // Date
  checkAndCreateNewPage(25)
  page.drawText(format(new Date(content.date), "MMMM d, yyyy"), {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 25

  // Recipient Information
  checkAndCreateNewPage(20)
  page.drawText(recipient.name, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })
  yPosition -= 15

  checkAndCreateNewPage(15)
  page.drawText(recipient.title, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 15

  checkAndCreateNewPage(15)
  page.drawText(recipient.company, {
    x: 72,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })
  yPosition -= 15

  const recipientAddressLines = recipientAddress.split("\n")
  recipientAddressLines.forEach((line) => {
    checkAndCreateNewPage(15)
    page.drawText(line, {
      x: 72,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    })
    yPosition -= 15
  })
  yPosition -= 20

  // Salutation
  if (salutation) {
    checkAndCreateNewPage(20)
    page.drawText(salutation, {
      x: 72,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: rgb(0, 0, 0),
    })
    yPosition -= 20
  }

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
    yPosition -= 12
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
