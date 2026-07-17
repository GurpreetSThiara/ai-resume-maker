import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "@pdfme/pdf-lib"
import type { CoverLetter } from "@/types/cover-letter"
import type { TemplateStyle } from "@/lib/config/cover-letter-templates"
import { format } from "date-fns"
import { wrapText } from "../pdf-utils"

// Shared, config-driven cover letter PDF generator. Every template in the
// registry exports through this by passing its TemplateStyle — no
// per-template generator files needed.

const PAGE_W = 612
const PAGE_H = 792
const MARGIN = 72
const SIDEBAR_W = 180
const ACCENT_BAR_W = 10

export async function generateConfigCoverLetterPDF(
  coverLetter: CoverLetter,
  style: TemplateStyle
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const isTimes = style.font === 'times'
  const font = await pdfDoc.embedFont(isTimes ? StandardFonts.TimesRoman : StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(
    isTimes ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold
  )

  const accent = rgb(style.accentRgb.r, style.accentRgb.g, style.accentRgb.b)
  const black = rgb(0, 0, 0)
  const gray = rgb(0.35, 0.35, 0.35)
  const white = rgb(1, 1, 1)

  const compact = !!style.compact
  const bodySize = compact ? 10.5 : 11
  const lineHeight = compact ? 14 : 16
  const paragraphGap = compact ? 8 : 12

  const isSidebar = style.headerLayout === 'sidebar'
  const contentX = isSidebar ? SIDEBAR_W + 36 : MARGIN
  const contentW = PAGE_W - contentX - MARGIN

  const { applicant, recipient, content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const displayName = style.nameUppercase ? yourName.toUpperCase() : yourName
  const initials = `${applicant.firstName.charAt(0)}${applicant.lastName.charAt(0)}`.toUpperCase()
  const { email, phone, address, linkedin } = applicant.contactInfo
  const contactLine = [phone, email, linkedin].filter(Boolean).join('  |  ')

  let page!: PDFPage
  let y = 0

  const decoratePage = (p: PDFPage) => {
    if (style.headerLayout === 'accent-bar') {
      p.drawRectangle({ x: 0, y: 0, width: ACCENT_BAR_W, height: PAGE_H, color: accent })
    }
    if (isSidebar) {
      p.drawRectangle({ x: 0, y: 0, width: SIDEBAR_W, height: PAGE_H, color: accent })
    }
  }

  const addPage = () => {
    page = pdfDoc.addPage([PAGE_W, PAGE_H])
    decoratePage(page)
    y = PAGE_H - MARGIN
  }
  addPage()

  const ensure = (space: number) => {
    if (y - space < MARGIN) addPage()
  }

  interface DrawOpts {
    size?: number
    f?: PDFFont
    color?: ReturnType<typeof rgb>
    x?: number
    maxW?: number
    lh?: number
    align?: 'left' | 'center' | 'right'
  }

  // Wraps and draws text, advancing y. Alignment is computed within [x, x + maxW].
  const draw = (text: string, opts: DrawOpts = {}) => {
    const {
      size = bodySize,
      f = font,
      color = black,
      x = contentX,
      maxW = contentW,
      lh = lineHeight,
      align = 'left',
    } = opts
    const lines = wrapText(text, maxW, f, size)
    for (const line of lines) {
      ensure(lh)
      let drawX = x
      const w = f.widthOfTextAtSize(line, size)
      if (align === 'center') drawX = x + (maxW - w) / 2
      if (align === 'right') drawX = x + maxW - w
      page.drawText(line, { x: drawX, y, size, font: f, color })
      y -= lh
    }
  }

  const drawRule = (kind: 'single' | 'double', color = accent) => {
    page.drawLine({
      start: { x: contentX, y },
      end: { x: contentX + contentW, y },
      thickness: kind === 'double' ? 1.5 : 1,
      color,
    })
    if (kind === 'double') {
      page.drawLine({
        start: { x: contentX, y: y - 3 },
        end: { x: contentX + contentW, y: y - 3 },
        thickness: 0.75,
        color,
      })
      y -= 3
    }
    y -= 14
  }

  // ---- Header ----------------------------------------------------------

  const drawHeaderRule = () => {
    if (style.rule && style.rule !== 'none') {
      y -= 6
      drawRule(style.rule)
    } else {
      y -= 10
    }
  }

  switch (style.headerLayout) {
    case 'centered': {
      if (style.monogram) {
        const r = 24
        const cx = contentX + contentW / 2
        page.drawEllipse({ x: cx, y: y - r, xScale: r, yScale: r, color: accent })
        const mw = bold.widthOfTextAtSize(initials, 16)
        page.drawText(initials, { x: cx - mw / 2, y: y - r - 6, size: 16, font: bold, color: white })
        y -= r * 2 + 14
      }
      draw(displayName, { size: 20, f: bold, color: accent, align: 'center', lh: 24 })
      if (applicant.professionalTitle)
        draw(applicant.professionalTitle, { size: 11, color: gray, align: 'center', lh: 15 })
      if (contactLine) draw(contactLine, { size: 10, color: gray, align: 'center', lh: 14 })
      if (address) draw(address, { size: 10, color: gray, align: 'center', lh: 14 })
      drawHeaderRule()
      break
    }

    case 'banner': {
      // Measure banner content, draw the filled rect, then the text on top.
      const bannerPadding = 28
      let bannerH = bannerPadding * 2 + 24 // name line
      if (applicant.professionalTitle) bannerH += 16
      if (contactLine) bannerH += 14
      page.drawRectangle({ x: 0, y: PAGE_H - bannerH, width: PAGE_W, height: bannerH, color: accent })
      y = PAGE_H - bannerPadding - 16
      draw(displayName, { size: 20, f: bold, color: white, x: MARGIN, maxW: PAGE_W - 2 * MARGIN, lh: 24 })
      if (applicant.professionalTitle)
        draw(applicant.professionalTitle, {
          size: 11,
          color: rgb(0.85, 0.88, 0.92),
          x: MARGIN,
          maxW: PAGE_W - 2 * MARGIN,
          lh: 16,
        })
      if (contactLine)
        draw(contactLine, {
          size: 10,
          color: rgb(0.85, 0.88, 0.92),
          x: MARGIN,
          maxW: PAGE_W - 2 * MARGIN,
          lh: 14,
        })
      y = PAGE_H - bannerH - 30
      break
    }

    case 'sidebar': {
      // Contact details inside the colored sidebar (first page only).
      const sx = 24
      const sw = SIDEBAR_W - sx * 2
      let sy = PAGE_H - MARGIN
      const sDraw = (text: string, size: number, f: PDFFont, lh: number, color = white) => {
        for (const line of wrapText(text, sw, f, size)) {
          page.drawText(line, { x: sx, y: sy, size, font: f, color })
          sy -= lh
        }
      }
      sDraw(displayName, 16, bold, 20)
      if (applicant.professionalTitle)
        sDraw(applicant.professionalTitle, 10, font, 14, rgb(0.85, 0.88, 0.97))
      sy -= 16
      sDraw('CONTACT', 9, bold, 14, rgb(0.85, 0.88, 0.97))
      if (phone) sDraw(phone, 9.5, font, 13)
      if (email) sDraw(email, 9.5, font, 13)
      if (linkedin) sDraw(linkedin, 9.5, font, 13)
      if (address) {
        sy -= 4
        sDraw(address, 9.5, font, 13)
      }
      // Letter content starts at the top of the right column.
      y = PAGE_H - MARGIN
      break
    }

    case 'split': {
      const headerTop = y
      draw(displayName, { size: 18, f: bold, maxW: contentW / 2, lh: 22 })
      if (applicant.professionalTitle)
        draw(applicant.professionalTitle, { size: 10.5, color: gray, maxW: contentW / 2, lh: 14 })
      const leftEnd = y
      y = headerTop + 4
      if (address) draw(address, { size: 10, color: gray, align: 'right', lh: 14 })
      if (phone) draw(phone, { size: 10, color: gray, align: 'right', lh: 14 })
      if (email) draw(email, { size: 10, color: gray, align: 'right', lh: 14 })
      if (linkedin) draw(linkedin, { size: 10, color: gray, align: 'right', lh: 14 })
      y = Math.min(leftEnd, y)
      drawHeaderRule()
      break
    }

    case 'left':
    case 'accent-bar':
    default: {
      draw(displayName, { size: compact ? 15 : 18, f: bold, color: accent, lh: compact ? 18 : 22 })
      if (applicant.professionalTitle)
        draw(applicant.professionalTitle, { size: 10.5, color: gray, lh: 14 })
      if (address) draw(address, { size: 10, color: gray, lh: 14 })
      if (contactLine) draw(contactLine, { size: 10, color: gray, lh: 14 })
      drawHeaderRule()
      break
    }
  }

  // ---- Letter body ------------------------------------------------------

  y -= compact ? 6 : 10

  ensure(20)
  draw(format(new Date(content.date), 'MMMM d, yyyy'))
  y -= paragraphGap

  if (recipient.name || recipient.title || recipient.company || recipient.address) {
    if (recipient.name) draw(recipient.name, { f: bold })
    if (recipient.title) draw(recipient.title)
    if (recipient.company) draw(recipient.company)
    if (recipient.address) {
      for (const line of recipient.address.split('\n')) draw(line)
    }
    y -= paragraphGap
  }

  if (content.salutation) {
    draw(content.salutation)
    y -= paragraphGap
  }

  const paragraphs = [
    content.openingParagraph.text,
    ...content.bodyParagraphs.map((p) => p.text),
    content.closingParagraph.text,
  ].filter(Boolean)

  for (const paragraph of paragraphs) {
    draw(paragraph)
    y -= paragraphGap
  }

  // Signature
  ensure(3 * lineHeight)
  y -= lineHeight / 2
  draw(content.complimentaryClose || 'Sincerely,')
  y -= lineHeight
  draw(yourName, { f: bold, color: accent })

  return pdfDoc.save()
}
