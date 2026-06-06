import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PDFFont } from "pdf-lib"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes text to be compatible with pdf-lib by replacing problematic Unicode characters
 * that cannot be encoded in WinAnsi encoding
 */
export function sanitizeTextForPdf(text: string): string {
  if (!text || typeof text !== 'string') return ''
  
  return text
    // Replace non-breaking hyphen (‑) with regular hyphen (-)
    .replace(/‑/g, '-')
    // Replace non-breaking space ( ) with regular space
    .replace(/\u00A0/g, ' ')
    // Replace other problematic Unicode characters
    .replace(/[\u2013\u2014]/g, '-') // en-dash and em-dash to regular hyphen
    .replace(/[\u2018\u2019]/g, "'") // smart quotes to regular quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes to regular quotes
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '•') // various bullet points to standard bullet
    .replace(/[\u00B0]/g, '°') // degree symbol
    .replace(/[\u00AE]/g, '(R)') // registered trademark
    .replace(/[\u00A9]/g, '(C)') // copyright
    .replace(/[\u2122]/g, '(TM)') // trademark
    // Remove or replace other potentially problematic characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // control characters
    .replace(/[\uFFFD]/g, '?') // replacement character
    .trim()
}

export function sanitizeTextForPdfWithFont(text: string, font: PDFFont): string {
  const base = sanitizeTextForPdf(text)
  if (!base) return ''

  try {
    font.encodeText(base)
    return base
  } catch {
    let out = ''
    for (const ch of Array.from(base)) {
      try {
        font.encodeText(ch)
        out += ch
      } catch {
        // skip unencodable character
      }
    }
    return out
  }
}

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

// Also export as pdfWrapText for those who started using it
export const pdfWrapText = wrapText;
