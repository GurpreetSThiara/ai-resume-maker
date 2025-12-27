import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from "pdf-lib"
import type { PDFPage, PDFFont } from "pdf-lib"
import type { PDFGenerationOptions, ProjectsSection } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { sanitizeTextForPdf, sanitizeTextForPdfWithFont } from '@/lib/utils'

// ============================================================================
// Projects Section Types & Utilities
// ============================================================================

interface PdfContext {
  page: PDFPage
  fonts: { regular: PDFFont; bold: PDFFont }
  margin: number
  pageInnerWidth: number
  y: number
  ensureSpace: (spaceNeeded: number) => void
}

interface ProjectsStyle {
  titleSize: number
  titleColor: ReturnType<typeof rgb>
  linkSize: number
  linkColor: ReturnType<typeof rgb>
  descSize: number
  descColor: ReturnType<typeof rgb>
  bulletIndent: number
  itemSpacing: number
}

interface ProjectsOptions {
  linkDisplay?: 'short' | 'full'
  withHeader?: boolean
  showTimeline?: boolean
}

const normalizeUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

const measureText = (text: string, font: PDFFont, size: number): number => {
  return font.widthOfTextAtSize(text || '', size)
}

const defaultWrapText = (
  text: string,
  maxWidth: number,
  font: PDFFont,
  size: number
): string[] => {
  const words = sanitizeTextForPdf(text || '').split(' ')

  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = measureText(testLine, font, size)
    
    if (width < maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  
  if (currentLine) lines.push(currentLine)
  return lines
}

const sanitizeForFont = (text: string, font: PDFFont): string => {
  return sanitizeTextForPdfWithFont(text || '', font)
}

// ============================================================================
// Draw Projects Section Function
// ============================================================================

const drawProjectsSection = (
  ctx: PdfContext,
  section: ProjectsSection,
  style: ProjectsStyle,
  options: ProjectsOptions = {}
): { y: number } => {
  const { fonts, margin, pageInnerWidth } = ctx
  const linkDisplay = options.linkDisplay || 'short'

  // Header
  if (options.withHeader) {
    const headerSize = (style as any).sectionTitleSize || 0
    const headerColor = (style as any).sectionTitleColor
    if (headerSize && headerColor) {
      ctx.ensureSpace(headerSize + 10)
      const safe = sanitizeForFont(section.title, fonts.bold)
      if (!safe) return { y: ctx.y }
      ctx.page.drawText(safe, {
        x: margin,
        y: ctx.y,
        size: headerSize,
        font: fonts.bold,
        color: headerColor
      })
      ctx.y -= headerSize + 6
    }
  }

  // Project Items
  for (const proj of section.items || []) {
    const isLast = section.items?.indexOf(proj) === (section.items?.length || 0) - 1
    
    // Reserve space for title row
    ctx.ensureSpace(style.titleSize + 10 + (options.showTimeline ? 6 : 0))

    const itemStartY = ctx.y
    const timelineX = margin - 10

    // Draw timeline dot if requested
    if (options.showTimeline) {
      try {
        ctx.page.drawCircle({
          x: timelineX,
          y: itemStartY,
          size: 6,
          color: rgb(0.259, 0.6, 0.882),
          borderColor: rgb(0.259, 0.6, 0.882),
          borderWidth: 2
        })
        ctx.page.drawCircle({
          x: timelineX,
          y: itemStartY,
          size: 3,
          color: rgb(1, 1, 1)
        })
      } catch (e) {
        // ignore if drawCircle not supported
      }
    }

    // Draw project title
    const title = proj.name || ''
    let cursorX = margin
    const safe = sanitizeForFont(title, fonts.bold)
    if (!safe) return { y: ctx.y }
    ctx.page.drawText(safe, {
      x: cursorX,
      y: itemStartY,
      size: style.titleSize,
      font: fonts.bold,
      color: style.titleColor,
    })
    const titleWidth = measureText(title, fonts.bold, style.titleSize)
    cursorX += titleWidth + 8

    // Draw date range if timeline and dates exist
    if (options.showTimeline && (proj.startDate || proj.endDate)) {
      const dateText = `${proj.startDate || ''} - ${proj.endDate || ''}`
      const safe = sanitizeForFont(dateText, fonts.regular)
      if (!safe) return { y: ctx.y }
      ctx.page.drawText(safe, {
        x: cursorX,
        y: itemStartY,
        size: style.linkSize,
        font: fonts.regular,
        color: rgb(0.447, 0.314, 0.588),
      })
      cursorX += measureText(dateText, fonts.regular, style.linkSize) + 10
    }

    // Build link list
    const parts: Array<{ label: string; url?: string }> = []
    if (proj.link) parts.push({ label: 'Link', url: normalizeUrl(proj.link) })
    if (proj.repo) parts.push({ label: 'GitHub', url: normalizeUrl(proj.repo) })

    if (parts.length) {
      const linkY = itemStartY
      
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        const text = linkDisplay === 'full' && p.url ? `${p.label}: ${p.url}` : p.label
        const safe = sanitizeForFont(text, fonts.regular)
        if (!safe) return { y: ctx.y }
        const w = measureText(text, fonts.regular, style.linkSize)

        // Draw link text
        ctx.page.drawText(safe, {
          x: cursorX,
          y: linkY,
          size: style.linkSize,
          font: fonts.regular,
          color: style.linkColor,
        })

        // Create clickable link annotation
        if (p.url) {
          const linkHeight = style.linkSize * 1.2
          const annotY = linkY - (style.linkSize * 0.2)
          
          const pdfDoc = ctx.page.doc
          const context = pdfDoc.context
          
          const linkAnnotation = context.obj({
            Type: PDFName.of('Annot'),
            Subtype: PDFName.of('Link'),
            Rect: [cursorX, annotY, cursorX + w, annotY + linkHeight],
            Border: [0, 0, 0],
            C: [0, 0, 1],
            A: {
              Type: PDFName.of('Action'),
              S: PDFName.of('URI'),
              URI: PDFString.of(p.url),
              NewWindow: true
            }
          })
          
          const linkAnnotationRef = context.register(linkAnnotation)
          
          const annots = ctx.page.node.lookup(PDFName.of('Annots'))
          if (annots) {
            annots.push(linkAnnotationRef)
          } else {
            ctx.page.node.set(PDFName.of('Annots'), context.obj([linkAnnotationRef]))
          }
        }

        cursorX += w

        // Add small space between links instead of pipe
        if (i < parts.length - 1) {
          cursorX += 8
        }
      }
    }

    ctx.y -= style.titleSize + 6

    // Description bullets
    if (Array.isArray(proj.description) && proj.description.length) {
      for (const d of proj.description) {
        const bullet = '• '
        const indentX = margin + style.bulletIndent
        const maxWidth = pageInnerWidth - style.bulletIndent - 10
        const lines = defaultWrapText(`${bullet}${d}`, maxWidth, fonts.regular, style.descSize)

        for (const line of lines) {
          ctx.ensureSpace(style.descSize + 4)
          const safe = sanitizeForFont(line, fonts.regular)
          if (!safe) return { y: ctx.y }
          ctx.page.drawText(safe, {
            x: indentX,
            y: ctx.y,
            size: style.descSize,
            font: fonts.regular,
            color: style.descColor,
          })
          ctx.y -= style.descSize + 2
        }
      }
    }

    ctx.y -= style.itemSpacing

    // Draw timeline connector line to next item
    if (options.showTimeline && !isLast) {
      try {
        const lineStartY = itemStartY - 10
        const lineEndY = ctx.y + style.itemSpacing + 10
        ctx.page.drawLine({
          start: { x: timelineX, y: lineStartY },
          end: { x: timelineX, y: lineEndY },
          thickness: 2,
          color: rgb(0.796, 0.835, 0.878)
        })
      } catch (e) {
        // ignore
      }
    }
  }

  // Section spacing
  if (options.withHeader) {
    const sectionSpacing = (style as any).sectionSpacing || 0
    if (sectionSpacing) ctx.y -= sectionSpacing
  }

  return { y: ctx.y }
}
// Main PDF Generation Function
// ============================================================================

export async function generateResumePDF({
  resumeData,
  filename = "resume.pdf",
  // Optional variant to support a compact black-lines layout while reusing logic
  variant = "default",
}: PDFGenerationOptions & { variant?: "default" | "black_compact" }) {

  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([595.276, 841.89]) // A4

  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const isBlackCompact = variant === "black_compact"

  // Slightly smaller margins and higher starting offset for compact variant
  const margin = isBlackCompact ? 40 : 50
  let yOffset = isBlackCompact ? 790 : 800
  const pageWidth = 595.276 - 2 * margin

  const accentColor = isBlackCompact ? rgb(0, 0, 0) : rgb(0.15, 0.4, 0.65) // Black vs blue accent
  const textColor = rgb(0.1, 0.1, 0.1)
  const secondaryColor = rgb(0.35, 0.35, 0.35)
  const linkColor = rgb(0, 0, 1)

  const ensureSpace = (spaceNeeded: number) => {
    if (yOffset - spaceNeeded < margin) {
      currentPage = pdfDoc.addPage([595.276, 841.89])
      yOffset = 800
    }
  }

  const wrapText = (text: string, maxWidth: number, font = regularFont, size = 10): string[] => {
    const words = sanitizeTextForPdf(text).split(" ")

    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      const width = font.widthOfTextAtSize(
        sanitizeTextForPdf(currentLine + " " + word),
        size
      )
      
      if (width < maxWidth) {
        currentLine += (currentLine ? " " : "") + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    })
    if (currentLine) lines.push(currentLine)
    return lines
  }

  const draw = (t: string, x: number, size: number, font = regularFont, color = textColor) => {
    const safe = sanitizeForFont(t || "", font)
    if (!safe) return
    currentPage.drawText(safe, { x, y: yOffset, size, font, color })
  }

  // Name
  const nameSize = isBlackCompact ? 18 : 20
  draw(resumeData.basics.name, margin, nameSize, boldFont, accentColor)
  yOffset -= nameSize

  // Contact Info - render as one joined string so separators are uniform
  const { email, phone, location, linkedin } = resumeData.basics
  const contactItems = [email, phone, location, linkedin]
    .filter(Boolean)
    .map((item) => sanitizeTextForPdf(String(item)))
    .filter((item) => item.length > 0)

  if (contactItems.length > 0) {
    const contactText = contactItems.join(" | ")
    const contactFontSize = isBlackCompact ? 9 : 10
    const contactLines = wrapText(contactText, pageWidth - 20, regularFont, contactFontSize)

    for (const line of contactLines) {
      const safeLine = sanitizeForFont(line, regularFont)
      if (!safeLine) continue
      currentPage.drawText(safeLine, {
        x: margin,
        y: yOffset,
        size: contactFontSize,
        font: regularFont,
        color: secondaryColor,
      })
      yOffset -= isBlackCompact ? 10 : 12
    }

    // Extra spacing after contact block
    yOffset -= isBlackCompact ? 6 : 8
  }

  // Summary
  if (resumeData.basics.summary) {
    const summaryFontSize = isBlackCompact ? 9 : 10
    const summaryLines = wrapText(resumeData.basics.summary, pageWidth - 20, regularFont, summaryFontSize)
    for (const line of summaryLines) {
      draw(line, margin, summaryFontSize, regularFont, textColor)
      yOffset -= isBlackCompact ? 10 : 12
    }
    yOffset -= isBlackCompact ? 10 : 13
  }

  // Custom entries
  const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]: any) => !item?.hidden)

  if (customEntries.length > 0) {
    if (isBlackCompact) {
      // Compact, clean two-column layout for ATS Compact variant
      const columnCount = 2
      const gap = 20
      const columnWidth = (pageWidth - gap * (columnCount - 1)) / columnCount
      const fontSize = 9

      const entries = customEntries.map(([key, item]) => ({ key, item }))

      for (let i = 0; i < entries.length; i += columnCount) {
        const rowEntries = entries.slice(i, i + columnCount)

        // Measure row height based on wrapped lines in each column
        let rowHeight = 0
        const rowLines: string[][] = []

        for (const { item } of rowEntries) {
          const label = sanitizeTextForPdf(`${item.title}:`)
          const value = sanitizeTextForPdf(item.content || "")
          const text = value ? `${label} ${value}` : label
          const lines = wrapText(text, columnWidth, regularFont, fontSize)
          rowLines.push(lines)
          const height = lines.length * (fontSize + 2)
          if (height > rowHeight) rowHeight = height
        }

        ensureSpace(rowHeight + 4)
        let colX = margin
        const rowStartY = yOffset

        rowEntries.forEach(({ item }, colIndex) => {
          const lines = rowLines[colIndex]
          let lineY = rowStartY
          for (const line of lines) {
            const safe = sanitizeForFont(line, regularFont)
            if (!safe) continue
            currentPage.drawText(safe, {
              x: colX,
              y: lineY,
              size: fontSize,
              font: regularFont,
              color: item.link ? linkColor : textColor,
            })
            lineY -= fontSize + 2
          }
          colX += columnWidth + gap
        })

        yOffset -= rowHeight + 4
      }

      yOffset -= 6
    } else {
      // Original flex-wrap layout for non-compact variant
      interface CustomItem {
        key: string
        item: any
        width: number
        height: number
        keyWidth: number
        contentWidth: number
        wrappedLines: string[]
      }

      const items: CustomItem[] = customEntries.map(([key, item]) => {
        const keyText = `${item.title}:`
        const keyWidth = boldFont.widthOfTextAtSize(keyText, 10)
        const content = sanitizeTextForPdf(item.content)
        const contentFontWidth = regularFont.widthOfTextAtSize(content, 10)
        
        const maxContentWidth = Math.min(300, pageWidth - keyWidth - 20)
        const wrappedLines = contentFontWidth > maxContentWidth 
          ? wrapText(content, maxContentWidth, regularFont, 10)
          : [content]
        
        const actualContentWidth = Math.max(...wrappedLines.map(line => 
          regularFont.widthOfTextAtSize(line, 10)
        ))
        
        return {
          key,
          item,
          width: keyWidth + actualContentWidth + 15,
          height: wrappedLines.length * 12,
          keyWidth,
          contentWidth: actualContentWidth,
          wrappedLines
        }
      })

      // Flex-wrap layout
      const rows: CustomItem[][] = []
      let currentRow: CustomItem[] = []
      let currentRowWidth = 0
      const minGap = 30
      
      for (const item of items) {
        const itemTotalWidth = item.width + minGap
        
        if (currentRowWidth + itemTotalWidth <= pageWidth + minGap) {
          currentRow.push(item)
          currentRowWidth += itemTotalWidth
        } else {
          if (currentRow.length > 0) rows.push(currentRow)
          currentRow = [item]
          currentRowWidth = itemTotalWidth
        }
      }
      
      if (currentRow.length > 0) rows.push(currentRow)

      // Render rows
      for (const row of rows) {
        const rowHeight = Math.max(...row.map(item => item.height))
        ensureSpace(rowHeight + 5)
        
        const rowStartY = yOffset
        const totalItemsWidth = row.reduce((sum, item) => sum + item.width, 0)
        const totalGaps = (row.length - 1) * minGap
        const availableSpace = pageWidth - totalItemsWidth - totalGaps
        const extraGapPerItem = row.length > 1 ? availableSpace / (row.length - 1) : 0
        
        let currentX = margin
        
        for (let i = 0; i < row.length; i++) {
          const item = row[i]
          const keyText = `${item.item.title}:`
          
          currentPage.drawText(sanitizeTextForPdf(keyText), {
            x: currentX,
            y: rowStartY,
            size: isBlackCompact ? 9 : 10,
            font: boldFont,
            color: textColor
          })
          
          const contentX = currentX + item.keyWidth + 5
          item.wrappedLines.forEach((line, lineIndex) => {
            currentPage.drawText(sanitizeForFont(line, regularFont), {
              x: contentX,
              y: rowStartY - (lineIndex * (isBlackCompact ? 10 : 12)),
              size: isBlackCompact ? 9 : 10,
              font: regularFont,
              color: item.item.link ? linkColor : textColor
            })
          })
          
          currentX += item.width + minGap + (i < row.length - 1 ? extraGapPerItem : 0)
        }
        
        yOffset -= rowHeight + 8
      }

      yOffset -= 10
    }
  }

  // Sections
  for (const section of resumeData.sections) {
    if ((section as any).hidden) continue

    let hasContent = false

    if ('items' in (section as any) && Array.isArray((section as any).items)) {
      if ([SECTION_TYPES.EDUCATION, SECTION_TYPES.EXPERIENCE, SECTION_TYPES.PROJECTS].includes(section.type as any)) {
        hasContent = (section as any).items.length > 0
      } else if ([SECTION_TYPES.SKILLS, SECTION_TYPES.LANGUAGES, SECTION_TYPES.CERTIFICATIONS].includes(section.type as any)) {
        hasContent = (section as any).items.filter((s: string) => s && s.trim()).length > 0
      }
    } else if ('content' in (section as any) && Array.isArray((section as any).content)) {
      hasContent = (section as any).content.some((t: string) => t && t.trim() !== '')
    }
    
    if (!hasContent) continue
    ensureSpace(30)

    // Section Title
    draw(section.title, margin, isBlackCompact ? 13 : 14, boldFont, accentColor)

    // Divider line
    currentPage.drawLine({
      start: { x: margin, y: yOffset - 2 },
      end: { x: margin + pageWidth, y: yOffset - 2 },
      thickness: 0.5,
      color: isBlackCompact ? rgb(0.8, 0.8, 0.8) : accentColor,
    })

    yOffset -= isBlackCompact ? 16 : 18

    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of section.items) {
          ensureSpace(isBlackCompact ? 13 : 15)
          const instSize = isBlackCompact ? 10 : 11
          const degreeSize = isBlackCompact ? 9 : 10
          draw(edu.institution, margin, instSize, boldFont, textColor)
          yOffset -= instSize + 1
          draw(edu.degree, margin, degreeSize, regularFont, textColor)
          yOffset -= degreeSize + 1
          const eduDates = `${edu.startDate} - ${edu.endDate}${edu.location ? ` • ${edu.location}` : ''}`
          draw(eduDates, margin, isBlackCompact ? 8 : 9, regularFont, secondaryColor)
          yOffset -= isBlackCompact ? 10 : 12

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              ensureSpace(isBlackCompact ? 10 : 12)
              const lines = wrapText(`• ${highlight}`, pageWidth - 20, regularFont, isBlackCompact ? 9 : 10)
              for (const line of lines) {
                draw(line, margin + 12, isBlackCompact ? 9 : 10, regularFont, textColor)
                yOffset -= isBlackCompact ? 10 : 12
              }
            }
          }
          yOffset -= isBlackCompact ? 3 : 5
        }
        break

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of section.items) {
          ensureSpace(isBlackCompact ? 13 : 15)
          const companySize = isBlackCompact ? 10 : 11
          const roleSize = isBlackCompact ? 9 : 10
          draw(exp.company, margin, companySize, boldFont, textColor)
          yOffset -= companySize + 1
          draw(exp.role, margin, roleSize, regularFont, textColor)
          yOffset -= roleSize + 1
          const expDates = `${exp.startDate} - ${exp.endDate}${exp.location ? ` • ${exp.location}` : ''}`
          draw(expDates, margin, isBlackCompact ? 8 : 9, regularFont, secondaryColor)
          yOffset -= isBlackCompact ? 10 : 12

          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              ensureSpace(isBlackCompact ? 10 : 12)
              const lines = wrapText(`• ${achievement}`, pageWidth - 20, regularFont, isBlackCompact ? 9 : 10)
              for (const line of lines) {
                draw(line, margin + 12, isBlackCompact ? 9 : 10, regularFont, textColor)
                yOffset -= isBlackCompact ? 10 : 12
              }
            }
          }
          yOffset -= isBlackCompact ? 3 : 5
        }
        break

      case SECTION_TYPES.SKILLS:
      case SECTION_TYPES.LANGUAGES:
      case SECTION_TYPES.CERTIFICATIONS:
        if (section.items?.length) {
          ensureSpace(isBlackCompact ? 10 : 12)
          const lines = wrapText(section.items.join(" • "), pageWidth - 20, regularFont, isBlackCompact ? 9 : 10)
          for (const line of lines) {
            draw(line, margin, isBlackCompact ? 9 : 10, regularFont, textColor)
            yOffset -= isBlackCompact ? 10 : 12
          }
        }
        break

      case SECTION_TYPES.PROJECTS:
        if ((section as any).items?.length) {
          const ctx = {
            page: currentPage,
            fonts: { regular: regularFont, bold: boldFont },
            margin,
            pageInnerWidth: pageWidth,
            y: yOffset,
            ensureSpace: (spaceNeeded: number) => {
              if (ctx.y - spaceNeeded < margin) {
                currentPage = pdfDoc.addPage([595.276, 841.89])
                ctx.page = currentPage
                ctx.y = 800
              }
            },
          }
          
          const style = {
            titleSize: isBlackCompact ? 10 : 11,
            titleColor: textColor,
            linkSize: isBlackCompact ? 7 : 8,
            linkColor,
            descSize: isBlackCompact ? 9 : 10,
            descColor: secondaryColor,
            bulletIndent: 12,
            itemSpacing: isBlackCompact ? 3 : 5,
          }
          
          const { y } = drawProjectsSection(ctx as any, section as any, style as any, {
            linkDisplay: 'short',
            withHeader: false
          })
          yOffset = y
          currentPage = ctx.page
        }
        break

      case SECTION_TYPES.CUSTOM:
        if (section.content?.length) {
          for (const text of section.content) {
            ensureSpace(isBlackCompact ? 10 : 12)
            const lines = wrapText(`• ${text}`, pageWidth - 20, regularFont, isBlackCompact ? 9 : 10)
            for (const line of lines) {
              draw(line, margin + 12, isBlackCompact ? 9 : 10, regularFont, textColor)
              yOffset -= isBlackCompact ? 10 : 12
            }
          }
          yOffset -= isBlackCompact ? 3 : 5
        }
        break
    }

    yOffset -= 10
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}