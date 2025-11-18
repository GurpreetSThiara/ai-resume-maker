import { PDFPage, PDFFont, rgb, PDFString, PDFName } from 'pdf-lib'
import { ProjectsSection } from '@/types/resume'
import { addLinkAnnotation, defaultWrapText, LinkDisplay, measureText, normalizeUrl } from '../utils'

export interface PdfContext {
  page: PDFPage
  fonts: { regular: PDFFont; bold: PDFFont }
  margin: number
  pageInnerWidth: number
  y: number
  ensureSpace: (spaceNeeded: number) => void
}

export interface ProjectsStyle {
  titleSize: number
  titleColor: ReturnType<typeof rgb>
  linkSize: number
  linkColor: ReturnType<typeof rgb>
  descSize: number
  descColor: ReturnType<typeof rgb>
  bulletIndent: number
  itemSpacing: number
}

export interface ProjectsOptions {
  linkDisplay?: LinkDisplay
  withHeader?: boolean
  showTimeline?: boolean
}

export const drawProjectsSection = (
  ctx: PdfContext,
  section: ProjectsSection,
  style: ProjectsStyle,
  options: ProjectsOptions = {}
): { y: number } => {
  const { fonts, margin, pageInnerWidth } = ctx
  const linkDisplay: LinkDisplay = options.linkDisplay || 'short'

  // Utility function
  const drawText = (
    text: string,
    x: number,
    size: number,
    font: PDFFont,
    color: ReturnType<typeof rgb>
  ) => {
    ctx.page.drawText(text || '', { x, y: ctx.y, size, font, color })
  }

  // Header
  if (options.withHeader) {
    const headerSize = (style as any).sectionTitleSize || 0
    const headerColor = (style as any).sectionTitleColor
    if (headerSize && headerColor) {
      ctx.ensureSpace(headerSize + 10)
      drawText(section.title, margin, headerSize, ctx.fonts.bold, headerColor)
      ctx.y -= headerSize + 6
    }
  }

  // Project Items
  for (const proj of section.items || []) {
    const isLast = section.items?.indexOf(proj) === (section.items?.length || 0) - 1
    // ───────────────────────────────────────────────
    // ⭐ TITLE + LINKS + DATES ON SAME ROW (WITH CLICKABLE ANNOTATIONS)
    // ───────────────────────────────────────────────
    // Reserve some extra space when drawing timeline markers
    ctx.ensureSpace(style.titleSize + 10 + (options.showTimeline ? 6 : 0))

    const itemStartY = ctx.y
    const timelineX = margin - 10

    // Draw timeline dot if requested
    if (options.showTimeline) {
      // outer circle
      try {
        ctx.page.drawCircle({ x: timelineX, y: itemStartY, size: 6, color: rgb(0.259, 0.6, 0.882), borderColor: rgb(0.259, 0.6, 0.882), borderWidth: 2 })
        // inner white
        ctx.page.drawCircle({ x: timelineX, y: itemStartY, size: 3, color: rgb(1, 1, 1) })
      } catch (e) {
        // ignore if drawCircle not supported in this environment
      }
    }


    // Draw project title
    const title = proj.name || ''
    let cursorX = margin
    ctx.page.drawText(title, {
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
      ctx.page.drawText(dateText, {
        x: cursorX,
        y: itemStartY,
        size: style.linkSize,
        font: fonts.regular,
        color: rgb(0.447, 0.314, 0.588), // #718096
      })
      cursorX += measureText(dateText, fonts.regular, style.linkSize) + 10
    }

    const titleY = ctx.y
    const titleX = margin

    // Build link list
    const parts: Array<{ label: string; url?: string }> = []
    if (proj.link) parts.push({ label: 'Link', url: normalizeUrl(proj.link) })
    if (proj.repo) parts.push({ label: 'GitHub', url: normalizeUrl(proj.repo) })

    if (parts.length) {
      const gap = '  |  '
      const linkY = itemStartY
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        const text =
          linkDisplay === 'full' && p.url ? `${p.label}: ${p.url}` : p.label

        const w = measureText(text, fonts.regular, style.linkSize)

        // Draw link text
        ctx.page.drawText(text, {
          x: cursorX,
          y: linkY,
          size: style.linkSize,
          font: fonts.regular,
          color: style.linkColor,
        })

        // ✅ FIXED: Create clickable link annotation with new window hint
        if (p.url) {
          const linkHeight = style.linkSize * 1.2
          const annotY = linkY - (style.linkSize * 0.2)
          
          // Get PDF context
          const pdfDoc = ctx.page.doc
          const context = pdfDoc.context
          
          // Create link annotation object with NewWindow flag
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
              NewWindow: true // Hint to open in new window/tab
            }
          })
          
          const linkAnnotationRef = context.register(linkAnnotation)
          
          // Add to page's annotations
          const annots = ctx.page.node.lookup(PDFName.of('Annots'))
          if (annots) {
            annots.push(linkAnnotationRef)
          } else {
            ctx.page.node.set(PDFName.of('Annots'), context.obj([linkAnnotationRef]))
          }
        }

        cursorX += w

        // Gap
        if (i < parts.length - 1) {
          const gw = measureText(gap, fonts.regular, style.linkSize)
          ctx.page.drawText(gap, {
            x: cursorX,
            y: linkY,
            size: style.linkSize,
            font: fonts.regular,
            color: style.linkColor,
          })
          cursorX += gw
        }
      }
    }

    ctx.y -= style.titleSize + 6

    // ───────────────────────────────────────────────
    // Description bullets
    // ───────────────────────────────────────────────
    if (Array.isArray(proj.description) && proj.description.length) {
      for (const d of proj.description) {
        const bullet = '• '
        const indentX = margin + style.bulletIndent
        const maxWidth = pageInnerWidth - style.bulletIndent - 10
        const lines = defaultWrapText(`${bullet}${d}`, maxWidth, fonts.regular, style.descSize)

        for (const line of lines) {
          ctx.ensureSpace(style.descSize + 4)
          ctx.page.drawText(line, {
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

    // Draw timeline connector line from this item to next
    if (options.showTimeline && !isLast) {
      try {
        const lineStartY = itemStartY - 10
        const lineEndY = ctx.y + style.itemSpacing + 10
        ctx.page.drawLine({ start: { x: timelineX, y: lineStartY }, end: { x: timelineX, y: lineEndY }, thickness: 2, color: rgb(0.796, 0.835, 0.878) })
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