import type { PerLineStyle } from "@/types/resume"
import { px, halfPt, cssHex, docxHex, FONT_CSS, FONT_DOCX } from "@/lib/render-spec"

/**
 * The single source of truth for per-line styling. The HTML canvas, the PDF
 * engine and the DOCX engine all derive the SAME key for a given line via
 * `lineKey`, and translate a `PerLineStyle` into their own primitives via the
 * helpers below — so a line styled in the editor renders identically everywhere.
 *
 * Keys are built from STORED (unfiltered) array indices, so the editor index
 * always equals the export index.
 */
export function lineKey(
  scope: string,
  o: { item?: number; field?: string; bullet?: number } = {},
): string {
  let k = scope
  if (o.item != null) k += `:i${o.item}`
  if (o.field) k += `:${o.field}`
  if (o.bullet != null) k += `:b${o.bullet}`
  return k
}

/** HTML preview: CSS for a styled line (spread onto the element's style). */
export function cssFor(s?: PerLineStyle): Record<string, string | number> {
  if (!s) return {}
  const css: Record<string, string | number> = {}
  if (s.bold) css.fontWeight = 700
  if (s.italic) css.fontStyle = "italic"
  if (s.underline) css.textDecoration = "underline"
  const color = cssHex(s.color)
  if (color) css.color = color
  if (s.size) css.fontSize = `${px(s.size)}px`
  if (s.font) css.fontFamily = FONT_CSS[s.font]
  return css
}

/** DOCX: extra TextRun props for a styled line (merged into the run options). */
export function docxRunProps(s?: PerLineStyle): Record<string, unknown> {
  if (!s) return {}
  const p: Record<string, unknown> = {}
  if (s.bold) p.bold = true
  if (s.italic) p.italics = true
  if (s.underline) p.underline = {}
  if (s.color) p.color = docxHex(s.color)
  if (s.size) p.size = halfPt(s.size)
  if (s.font) p.font = FONT_DOCX[s.font]
  return p
}

/** Does this line have any active formatting? */
export const hasLineStyle = (s?: PerLineStyle): boolean =>
  !!s && (!!s.bold || !!s.italic || !!s.underline || !!s.color || !!s.size || !!s.font)
