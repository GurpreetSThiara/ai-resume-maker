import type { PerLineStyle } from "@/types/resume"

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

const hashHex = (c?: string) => (c ? (c.startsWith("#") ? c : `#${c}`) : undefined)

const HTML_FAMILY: Record<NonNullable<PerLineStyle["font"]>, string> = {
  sans: "Helvetica, Arial, sans-serif",
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", monospace',
}

/** HTML preview: CSS for a styled line (spread onto the element's style). pt→px uses the engine's 1.34 ratio. */
export function cssFor(s?: PerLineStyle): Record<string, string | number> {
  if (!s) return {}
  const css: Record<string, string | number> = {}
  if (s.bold) css.fontWeight = 700
  if (s.italic) css.fontStyle = "italic"
  if (s.underline) css.textDecoration = "underline"
  const color = hashHex(s.color)
  if (color) css.color = color
  if (s.size) css.fontSize = `${s.size * 1.34}px`
  if (s.font) css.fontFamily = HTML_FAMILY[s.font]
  return css
}

const DOCX_FAMILY: Record<NonNullable<PerLineStyle["font"]>, string> = {
  sans: "Helvetica",
  serif: "Times New Roman",
  mono: "Courier New",
}

/** DOCX: extra TextRun props for a styled line (merged into the run options). */
export function docxRunProps(s?: PerLineStyle): Record<string, unknown> {
  if (!s) return {}
  const p: Record<string, unknown> = {}
  if (s.bold) p.bold = true
  if (s.italic) p.italics = true
  if (s.underline) p.underline = {}
  if (s.color) p.color = (s.color || "").replace("#", "")
  if (s.size) p.size = Math.round(s.size * 2) // half-points
  if (s.font) p.font = DOCX_FAMILY[s.font]
  return p
}

/** Does this line have any active formatting? */
export const hasLineStyle = (s?: PerLineStyle): boolean =>
  !!s && (!!s.bold || !!s.italic || !!s.underline || !!s.color || !!s.size || !!s.font)
