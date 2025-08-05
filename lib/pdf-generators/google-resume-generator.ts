import { PDFDocument, StandardFonts, rgb, PDFName, PDFArray } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"

export async function generateResumePDF({ resumeData, template, filename = "resume.pdf" }: PDFGenerationOptions) {
  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([595.276, 841.89]) // A4 size in points

  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  let yOffset = 800 // Start from top of page
  const margin = 50
  const pageWidth = 595.276 - 2 * margin

  // Helper function to add a new page when needed
  const ensureSpace = (spaceNeeded: number) => {
    if (yOffset - spaceNeeded < margin) {
      currentPage = pdfDoc.addPage([595.276, 841.89])
      yOffset = 800
    }
  }

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      const width = regularFont.widthOfTextAtSize(currentLine + " " + word, template.pdfConfig.sizes.small)
      if (width < maxWidth) {
        currentLine += (currentLine ? " " : "") + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    })

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }

  // Name
  currentPage.drawText(resumeData.name, {
    x: margin,
    y: yOffset,
    size: template.pdfConfig.sizes.name,
    font: boldFont,
    color: rgb(template.pdfConfig.colors.text.r, template.pdfConfig.colors.text.g, template.pdfConfig.colors.text.b),
  })

  yOffset -= template.pdfConfig.spacing.section

  // Contact info
  const contactInfo = `${resumeData.email}    ${resumeData.phone}    ${resumeData.location}`
  currentPage.drawText(contactInfo, {
    x: margin,
    y: yOffset,
    size: template.pdfConfig.sizes.small,
    font: regularFont,
    color: rgb(
      template.pdfConfig.colors.secondary.r,
      template.pdfConfig.colors.secondary.g,
      template.pdfConfig.colors.secondary.b,
    ),
  })

  yOffset -= template.pdfConfig.spacing.section

  // Custom Section with Proper Justification Between Key & Value
  const customEntries = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden)
  const columnCount = 2
  const rowCount = Math.ceil(customEntries.length / columnCount)
  const leftX = margin
  const rightX = margin + pageWidth / 2 // Right column starts halfway
  const columnWidth = pageWidth / 2 - 10
  const rowHeight = 15

  for (let i = 0; i < rowCount; i++) {
    ensureSpace(rowHeight + 5)

    for (let j = 0; j < columnCount; j++) {
      const index = i + j * rowCount
      if (index >= customEntries.length) break

      const [key, item] = customEntries[index]
      const xPos = j === 0 ? leftX : rightX

      // Key (left-aligned)
      currentPage.drawText(`${item.title}:`, {
        x: xPos,
        y: yOffset,
        size: template.pdfConfig.sizes.small,
        font: boldFont,
        color: rgb(
          template.pdfConfig.colors.text.r,
          template.pdfConfig.colors.text.g,
          template.pdfConfig.colors.text.b,
        ),
      })

      const textWidth = regularFont.widthOfTextAtSize(item.content, template.pdfConfig.sizes.small)
      const contentX = xPos + columnWidth - textWidth

      if (item.link) {
        // Draw the link text
        currentPage.drawText(item.content, {
          x: contentX,
          y: yOffset,
          size: template.pdfConfig.sizes.small,
          font: regularFont,
          color: rgb(
            template.pdfConfig.colors.linkColor.r,
            template.pdfConfig.colors.linkColor.g,
            template.pdfConfig.colors.linkColor.b,
          ),
        })

        // Ensure URL starts with http(s)
        const url = item.content.startsWith("http") ? item.content : `https://${item.content}`

        // Create the link annotation
        const linkAnnotation = currentPage.doc.context.obj({
          Type: PDFName.of("Annot"),
          Subtype: PDFName.of("Link"),
          Rect: [contentX, yOffset, contentX + textWidth, yOffset + template.pdfConfig.sizes.small],
          Border: [0, 0, 0],
          A: currentPage.doc.context.obj({
            Type: PDFName.of("Action"),
            S: PDFName.of("URI"),
            URI: currentPage.doc.context.obj(url),
          }),
        })

        // Register the annotation in the document context
        const linkRef = currentPage.doc.context.register(linkAnnotation)

        // Get existing annotations or create a new array
        let annotations = currentPage.node.get(PDFName.of("Annots"))
        if (!annotations) {
          annotations = currentPage.doc.context.obj([]) // Create new annotations array
          currentPage.node.set(PDFName.of("Annots"), annotations)
        }

        // Ensure annotations is a PDFArray and add the new link
        if (annotations instanceof PDFArray) {
          annotations.push(linkRef)
        } else {
          const newAnnotations = currentPage.doc.context.obj([annotations, linkRef])
          currentPage.node.set(PDFName.of("Annots"), newAnnotations)
        }
      } else {
        // Draw regular text if it's not a link
        currentPage.drawText(item.content, {
          x: contentX,
          y: yOffset,
          size: template.pdfConfig.sizes.small,
          font: regularFont,
          color: rgb(
            template.pdfConfig.colors.text.r,
            template.pdfConfig.colors.text.g,
            template.pdfConfig.colors.text.b,
          ),
        })
      }
    }
    yOffset -= rowHeight
  }

  yOffset -= template.pdfConfig.spacing.section / 2

  // Sections
  for (const section of resumeData.sections) {
    ensureSpace(template.pdfConfig.spacing.section + 20)

    currentPage.drawText(section.title, {
      x: margin,
      y: yOffset,
      size: template.pdfConfig.sizes.section,
      font: boldFont,
      color: rgb(
        template.pdfConfig.colors.heading.r,
        template.pdfConfig.colors.heading.g,
        template.pdfConfig.colors.heading.b,
      ),
    })

    yOffset -= template.pdfConfig.spacing.page

    for (const [key, bullets] of Object.entries(section.content)) {
      ensureSpace(template.pdfConfig.spacing.item + 20)

      if (key) {
        const [title, subtitle] = key.split(" | ")

        currentPage.drawText(title, {
          x: margin,
          y: yOffset,
          size: template.pdfConfig.sizes.content,
          font: boldFont,
          color: rgb(
            template.pdfConfig.colors.text.r,
            template.pdfConfig.colors.text.g,
            template.pdfConfig.colors.text.b,
          ),
        })

        yOffset -= template.pdfConfig.sizes.content

        if (subtitle) {
          currentPage.drawText(subtitle, {
            x: margin,
            y: yOffset,
            size: template.pdfConfig.sizes.small,
            font: regularFont,
            color: rgb(
              template.pdfConfig.colors.secondary.r,
              template.pdfConfig.colors.secondary.g,
              template.pdfConfig.colors.secondary.b,
            ),
          })
          yOffset -= template.pdfConfig.sizes.small
        }
      }

      for (const bullet of bullets) {
        ensureSpace(template.pdfConfig.sizes.small + 5)
        const bulletText = `• ${bullet}`
        const lines = wrapText(bulletText, pageWidth - 20)

        for (const line of lines) {
          currentPage.drawText(line, {
            x: margin + 10,
            y: yOffset,
            size: template.pdfConfig.sizes.small,
            font: regularFont,
            color: rgb(
              template.pdfConfig.colors.text.r,
              template.pdfConfig.colors.text.g,
              template.pdfConfig.colors.text.b,
            ),
          })
          yOffset -= 15
        }
      }
      yOffset -= template.pdfConfig.spacing.item / 2
    }
    yOffset -= template.pdfConfig.spacing.section / 2
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
