import type React from "react"
import { PDFDocument, StandardFonts, rgb, PDFName, PDFArray } from "pdf-lib"
import { ResumeData, SECTION_TYPES } from "@/types/resume"
import { SECTION_LABEL_CUSTOM_FIELDS } from '@/app/constants/global'

interface ThemeConfig {
  fontSize: {
    name: string
    section: string
    content: string
    small: string
  }
  rgb: {
    text: { r: number; g: number; b: number }
    heading: { r: number; g: number; b: number }
    secondary: { r: number; g: number; b: number }
    linkColor?: { r: number; g: number; b: number }
  }
  pdfSize: {
    name: number
    section: number
    content: number
    small: number
  }
  pdfSpacing: {
    page: number
    section: number
    item: number
  }
}

interface GenerationProps {
  pdfRef: React.RefObject<HTMLDivElement>
  theme: ThemeConfig
  resumeData: ResumeData
}

export async function generateImpact({ pdfRef, theme, resumeData }: GenerationProps) {
  if (!pdfRef.current) return

  const pdFtheme: ThemeConfig = theme
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
      const width = regularFont.widthOfTextAtSize(currentLine + " " + word, pdFtheme.pdfSize?.small || 10)
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

  currentPage.drawText(resumeData.name, {
    x: margin,
    y: yOffset,
    size: pdFtheme.pdfSize?.name || 20,
    font: boldFont,
    color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
  })

  yOffset -= pdFtheme.pdfSpacing?.section || 20

  // Contact info
  const contactInfo = `${resumeData.email}    ${resumeData.phone}    ${resumeData.location}`
  currentPage.drawText(contactInfo, {
    x: margin,
    y: yOffset,
    size: pdFtheme.pdfSize?.small || 10,
    font: regularFont,
    color: rgb(pdFtheme.rgb?.secondary.r || 0.4, pdFtheme.rgb?.secondary.g || 0.4, pdFtheme.rgb?.secondary.b || 0.4),
  })

  yOffset -= pdFtheme.pdfSpacing?.section || 20

  // ${SECTION_LABEL_CUSTOM_FIELDS} with Proper Justification Between Key & Value
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
        size: pdFtheme.pdfSize?.small || 10,
        font: boldFont,
        color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
      })

      const textWidth = regularFont.widthOfTextAtSize(item.content, pdFtheme.pdfSize?.small || 10)
      const contentX = xPos + columnWidth - textWidth

      if (item.link) {
        // Draw the link text
        currentPage.drawText(item.content, {
          x: contentX,
          y: yOffset,
          size: pdFtheme.pdfSize?.small || 10,
          font: regularFont,
          color: rgb(pdFtheme.rgb?.linkColor?.r || 0, pdFtheme.rgb?.linkColor?.g || 0, pdFtheme.rgb?.linkColor?.b || 1), // Blue color for links
        })

        // Ensure URL starts with http(s)
        const url = item.content.startsWith("http") ? item.content : `https://${item.content}`

        // Create the link annotation
        const linkAnnotation = currentPage.doc.context.obj({
          Type: PDFName.of("Annot"),
          Subtype: PDFName.of("Link"),
          Rect: [contentX, yOffset, contentX + textWidth, yOffset + (pdFtheme.pdfSize?.small || 10)],
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
          size: pdFtheme.pdfSize?.small || 10,
          font: regularFont,
          color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
        })
      }
    }
    yOffset -= rowHeight
  }

  yOffset -= (pdFtheme.pdfSpacing?.section || 20) / 2

  // Sections
  for (const section of resumeData.sections) {
    ensureSpace((pdFtheme.pdfSpacing?.section || 20) + 20)

    currentPage.drawText(section.title, {
      x: margin,
      y: yOffset,
      size: pdFtheme.pdfSize?.section || 14,
      font: boldFont,
      color: rgb(pdFtheme.rgb?.heading.r || 0.1, pdFtheme.rgb?.heading.g || 0.3, pdFtheme.rgb?.heading.b || 0.7),
    })

    yOffset -= pdFtheme.pdfSpacing?.page || 15

    if (section.type === SECTION_TYPES.EDUCATION) {
      for (const education of section.items) {
        ensureSpace((pdFtheme.pdfSpacing?.item || 10) + 20)

        // Institution name
        currentPage.drawText(education.institution, {
          x: margin,
          y: yOffset,
          size: pdFtheme.pdfSize?.content || 12,
          font: boldFont,
          color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
        })
        yOffset -= pdFtheme.pdfSize?.content || 12

        // Degree and dates
        const degreeText = `${education.degree} (${education.startDate} - ${education.endDate})`
        currentPage.drawText(degreeText, {
          x: margin,
          y: yOffset,
          size: pdFtheme.pdfSize?.small || 10,
          font: regularFont,
          color: rgb(
            pdFtheme.rgb?.secondary.r || 0.4,
            pdFtheme.rgb?.secondary.g || 0.4,
            pdFtheme.rgb?.secondary.b || 0.4,
          ),
        })
        yOffset -= pdFtheme.pdfSize?.small || 10

        // Location if available
        if (education.location) {
          currentPage.drawText(education.location, {
            x: margin,
            y: yOffset,
            size: pdFtheme.pdfSize?.small || 10,
            font: regularFont,
            color: rgb(
              pdFtheme.rgb?.secondary.r || 0.4,
              pdFtheme.rgb?.secondary.g || 0.4,
              pdFtheme.rgb?.secondary.b || 0.4,
            ),
          })
          yOffset -= pdFtheme.pdfSize?.small || 10
        }

        // Highlights
        if (education.highlights) {
          for (const highlight of education.highlights) {
            const bulletText = `• ${highlight}`
            const lines = wrapText(bulletText, pageWidth - 20)
            for (const line of lines) {
              currentPage.drawText(line, {
                x: margin + 10,
                y: yOffset,
                size: pdFtheme.pdfSize?.small || 10,
                font: regularFont,
                color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
              })
              yOffset -= 15
            }
          }
        }
        yOffset -= (pdFtheme.pdfSpacing?.item || 10) / 2
      }
    } else if (section.type === SECTION_TYPES.EXPERIENCE) {
      for (const experience of section.items) {
        ensureSpace((pdFtheme.pdfSpacing?.item || 10) + 20)

        // Company name and role
        currentPage.drawText(`${experience.company} - ${experience.role}`, {
          x: margin,
          y: yOffset,
          size: pdFtheme.pdfSize?.content || 12,
          font: boldFont,
          color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
        })
        yOffset -= pdFtheme.pdfSize?.content || 12

        // Dates and location
        const dateLocation = `${experience.startDate} - ${experience.endDate}${experience.location ? ` • ${experience.location}` : ''}`
        currentPage.drawText(dateLocation, {
          x: margin,
          y: yOffset,
          size: pdFtheme.pdfSize?.small || 10,
          font: regularFont,
          color: rgb(
            pdFtheme.rgb?.secondary.r || 0.4,
            pdFtheme.rgb?.secondary.g || 0.4,
            pdFtheme.rgb?.secondary.b || 0.4,
          ),
        })
        yOffset -= pdFtheme.pdfSize?.small || 10

        // Achievements
        if (experience.achievements) {
          for (const achievement of experience.achievements) {
            const bulletText = `• ${achievement}`
            const lines = wrapText(bulletText, pageWidth - 20)
            for (const line of lines) {
              currentPage.drawText(line, {
                x: margin + 10,
                y: yOffset,
                size: pdFtheme.pdfSize?.small || 10,
                font: regularFont,
                color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
              })
              yOffset -= 15
            }
          }
        }
        yOffset -= (pdFtheme.pdfSpacing?.item || 10) / 2
      }
    } else if (section.type === SECTION_TYPES.SKILLS || section.type === SECTION_TYPES.LANGUAGES || section.type === SECTION_TYPES.CERTIFICATIONS) {
      const items = section.items
      if (Array.isArray(items)) {
        const text = items.join(" • ")
        const lines = wrapText(text, pageWidth - 20)
        for (const line of lines) {
          currentPage.drawText(line, {
            x: margin,
            y: yOffset,
            size: pdFtheme.pdfSize?.small || 10,
            font: regularFont,
            color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
          })
          yOffset -= 15
        }
      }
    } else if (section.type === SECTION_TYPES.CUSTOM) {
      if (Array.isArray(section.content)) {
        for (const text of section.content) {
          ensureSpace((pdFtheme.pdfSize?.small ?? 0) + 5)
          const lines = wrapText(text, pageWidth - 20)
          for (const line of lines) {
            currentPage.drawText(line, {
              x: margin + 10,
              y: yOffset,
              size: pdFtheme.pdfSize?.small || 10,
              font: regularFont,
              color: rgb(pdFtheme.rgb?.text.r || 0.2, pdFtheme.rgb?.text.g || 0.2, pdFtheme.rgb?.text.b || 0.2),
            })
            yOffset -= 15
          }
        }
        yOffset -= (pdFtheme.pdfSpacing?.item || 10) / 2
      }
    }
    yOffset -= (pdFtheme.pdfSpacing?.section || 20) / 2
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "resume.pdf"
  link.click()
}
