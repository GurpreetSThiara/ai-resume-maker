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
    // ───────────────────────────────────────────────
    // ⭐ TITLE + LINKS ON SAME ROW (WITH CLICKABLE ANNOTATIONS)
    // ───────────────────────────────────────────────
    ctx.ensureSpace(style.titleSize + 10)

    const title = proj.name || ''
    const titleWidth = measureText(title, fonts.bold, style.titleSize)

    const titleY = ctx.y
    const titleX = margin

    // Draw Title
    ctx.page.drawText(title, {
      x: titleX,
      y: titleY,
      size: style.titleSize,
      font: fonts.bold,
      color: style.titleColor,
    })

    // Build link list
    const parts: Array<{ label: string; url?: string }> = []
    if (proj.link) parts.push({ label: 'Link', url: normalizeUrl(proj.link) })
    if (proj.repo) parts.push({ label: 'GitHub', url: normalizeUrl(proj.repo) })

    if (parts.length) {
      const gap = '  |  '
      let cursorX = margin + titleWidth + 12
      const linkY = titleY

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
  }

  // Section spacing
  if (options.withHeader) {
    const sectionSpacing = (style as any).sectionSpacing || 0
    if (sectionSpacing) ctx.y -= sectionSpacing
  }

  return { y: ctx.y }
}