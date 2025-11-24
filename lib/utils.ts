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
