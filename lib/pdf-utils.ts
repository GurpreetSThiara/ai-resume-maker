import type { PDFFont } from "pdf-lib"

/**
 * wrapText - wraps text for pdf-lib rendering
 */
export function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  if (!text) return ['']
  
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = font.widthOfTextAtSize(testLine, fontSize)

    if (width <= maxWidth) {
      currentLine = testLine
    } else {
      // If the word itself is wider than maxWidth, we must break it
      const wordWidth = font.widthOfTextAtSize(word, fontSize)
      if (wordWidth > maxWidth) {
        if (currentLine) {
          lines.push(currentLine)
          currentLine = ''
        }
        
        let partialWord = ''
        for (const char of Array.from(word)) {
          const testPartial = partialWord + char
          if (font.widthOfTextAtSize(testPartial, fontSize) <= maxWidth) {
            partialWord = testPartial
          } else {
            if (partialWord) lines.push(partialWord)
            partialWord = char
          }
        }
        currentLine = partialWord
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }
  }

  if (currentLine) lines.push(currentLine)
  return lines.length > 0 ? lines : ['']
}
