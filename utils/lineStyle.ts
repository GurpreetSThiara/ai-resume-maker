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

const CSS_TRANSFORM: Record<NonNullable<PerLineStyle["transform"]>, string> = {
  upper: "uppercase",
  lower: "lowercase",
  title: "capitalize",
}

/**
 * Apply the letter-case transform to the actual string — used by the PDF and
 * DOCX renderers, which have no "display transform" (the canvas uses CSS).
 */
export function caseText(text: string, s?: PerLineStyle): string {
  if (!s?.transform || !text) return text
  if (s.transform === "upper") return text.toUpperCase()
  if (s.transform === "lower") return text.toLowerCase()
  return text.replace(/\b\w/g, (c) => c.toUpperCase()) // title
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
  if (s.transform) css.textTransform = CSS_TRANSFORM[s.transform]
  const bg = cssHex(s.background)
  if (bg) css.backgroundColor = bg
  if (s.lineHeight) css.lineHeight = s.lineHeight
  if (s.letterSpacing) css.letterSpacing = `${px(s.letterSpacing)}px`
  if (s.shadow) css.textShadow = "0.7px 0.7px 1px rgba(15,23,42,0.45)"
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
  if (s.transform === "upper") p.allCaps = true // lower/title handled via caseText()
  if (s.background) p.shading = { type: "clear", color: "auto", fill: docxHex(s.background) }
  if (s.letterSpacing) p.characterSpacing = Math.round(s.letterSpacing * 20) // pt → twips
  if (s.shadow) p.shadow = true
  return p
}

/** DOCX paragraph spacing for line-height (applied on the Paragraph, not the run). */
export function docxParaSpacing(s?: PerLineStyle): Record<string, unknown> | undefined {
  if (!s?.lineHeight) return undefined
  return { line: Math.round(s.lineHeight * 240), lineRule: "auto" }
}

/** Does this line have any active formatting? */
export const hasLineStyle = (s?: PerLineStyle): boolean =>
  !!s && Object.values(s).some((v) => v !== undefined && v !== false && v !== "")
