
import { PDFArray, PDFName, PDFFont, PDFPage, RGB } from 'pdf-lib'

export type LinkDisplay = 'short' | 'full'

export const normalizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export const measureText = (text: string, font: PDFFont, size: number): number => {
  const safe = text || ''
  return font.widthOfTextAtSize(safe, size)
}

export const addLinkAnnotation = (
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string
) => {
  const doc = page.doc
  const ctx = doc.context
  const linkAnnotation = ctx.obj({
    Type: PDFName.of('Annot'),
    Subtype: PDFName.of('Link'),
    Rect: [x, y, x + width, y + height],
    Border: [0, 0, 0],
    A: ctx.obj({
      Type: PDFName.of('Action'),
      S: PDFName.of('URI'),
      URI: ctx.obj(url),
    }),
  })
  const linkRef = ctx.register(linkAnnotation)
  let annots = page.node.get(PDFName.of('Annots'))
  if (!annots) {
    annots = ctx.obj([])
    page.node.set(PDFName.of('Annots'), annots)
  }
  if (annots instanceof PDFArray) {
    annots.push(linkRef)
  } else {
    const newArr = ctx.obj([annots, linkRef])
    page.node.set(PDFName.of('Annots'), newArr)
  }
}

export const defaultWrapText = (
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] => {
  const words = (text || '').split(' ')
  const lines: string[] = []
  let currentLine = ''
  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word
    const w = font.widthOfTextAtSize(candidate, fontSize)
    if (w <= maxWidth) {
      currentLine = candidate
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}
