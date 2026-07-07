/**
 * render-spec.ts — the single source of truth for cross-renderer geometry, units,
 * colours and fonts.
 *
 * The HTML canvas (components/resumes/shared/ConfigurableResume.tsx), the PDF
 * engine (lib/pdf-generators/design-pdf-engine.ts) and the DOCX engine
 * (lib/docx-generators/design-docx-engine.ts) are three independent renderers of
 * the same `ResumeDesign`. Historically each hard-coded its own units, colour
 * conversions, font maps and structural constants, so they drifted (different
 * wrapping/density, mismatched skill-bar colours, contact layouts, etc.).
 *
 * Everything that must agree across renderers lives HERE and is imported, never
 * re-declared.
 *
 * ── THE COORDINATE CONTRACT ─────────────────────────────────────────────────
 * The PDF is authored in PostScript points (pt): A4 = 595.28 × 841.89 pt, with
 * text sized in pt. For the preview to wrap and stack identically, the HTML
 * canvas MUST scale EVERY dimension — page, columns, margins, gaps AND font
 * sizes — by the SAME factor (`PT_TO_PX`). Mixing scales (page at 1pt→1px but
 * text at 1pt→1.34px, the historical bug) makes glyphs ~33% larger relative to
 * the columns, so the preview wraps sooner and looks more spread out than the
 * exported PDF.  Rule: a canvas dimension = `px(designValuePt)`. Never raw px.
 */

/** A4 page, in points (the PDF's native unit). */
export const PAGE_PT = { w: 595.276, h: 841.89 } as const
export const PAGE_ASPECT = PAGE_PT.h / PAGE_PT.w

/** Canvas CSS px per point. 96/72 renders A4 at a true 96-dpi size. */
export const PT_TO_PX = 96 / 72 // 1.3333…
/** pt → CSS px (HTML canvas). */
export const px = (pt: number) => pt * PT_TO_PX
/** pt → half-points (docx TextRun `size`). */
export const halfPt = (pt: number) => Math.round(pt * 2)

/** A4 in CSS px at PT_TO_PX — the canvas page must use these so its geometry is
 *  the PDF's pt space uniformly scaled (→ identical proportions & wrapping). */
export const PAGE_PX = { w: PAGE_PT.w * PT_TO_PX, h: PAGE_PT.h * PT_TO_PX }

/** Shared structural geometry, declared once in pt. */
export const GEO = {
  sidebarWPt: 188,
  sidebarMarginPt: 28,
  singleMarginPt: 44,
  compactMarginPt: 36,
  skillBarHPt: 4,
} as const

// ── Colour ──────────────────────────────────────────────────────────────────
/** CSS needs `#rrggbb`. */
export const cssHex = (hex?: string) => (hex ? (hex.startsWith("#") ? hex : `#${hex}`) : undefined)
/** docx needs `rrggbb` (no #). */
export const docxHex = (hex?: string) => (hex || "").replace("#", "")
/** pdf-lib needs channels in 0..1. */
export const hexToRgb01 = (hex: string) => {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const n = parseInt(full, 16) || 0
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}
/**
 * Neutral for sidebar skill-bar tracks / empty proficiency dots. The canvas used
 * a translucent-white wash over the dark sidebar; pdf-lib fills are opaque, so we
 * pin both renderers to this pre-flattened value (≈ rgb(0.42)).
 */
export const SIDEBAR_TRACK_HEX = "#6b6b6b"
export const SIDEBAR_TRACK_RGB01 = { r: 0.42, g: 0.42, b: 0.42 } as const

// ── Fonts ─────────────────────────────────────────────────────────────────---
export type FontKey = "sans" | "serif" | "mono"
/** CSS font stacks chosen to match the metrics of the PDF StandardFonts below. */
export const FONT_CSS: Record<FontKey, string> = {
  // Lead with fonts that are metric-compatible with the PDF StandardFonts
  // (Arial≈Helvetica, Times New Roman≈Times, Courier New≈Courier) so the
  // browser's line-breaking matches pdf-lib's. Georgia is intentionally NOT
  // used for serif — its advance widths differ from Times and break wrapping.
  sans: "Arial, Helvetica, sans-serif",
  serif: '"Times New Roman", Times, serif',
  mono: '"Courier New", Courier, monospace',
}
/** docx font names. */
export const FONT_DOCX: Record<FontKey, string> = {
  sans: "Helvetica",
  serif: "Times New Roman",
  mono: "Courier New",
}
/**
 * pdf-lib StandardFonts key per family/weight/style. The PDF engine maps these to
 * actual embedded `PDFFont`s (it owns the pdf-lib import); keeping the names here
 * documents the canonical font matrix all renderers approximate.
 */
export const FONT_PDF_STANDARD: Record<FontKey, { r: string; b: string; i: string; bi: string }> = {
  sans: { r: "Helvetica", b: "Helvetica-Bold", i: "Helvetica-Oblique", bi: "Helvetica-BoldOblique" },
  serif: { r: "Times-Roman", b: "Times-Bold", i: "Times-Italic", bi: "Times-BoldItalic" },
  mono: { r: "Courier", b: "Courier-Bold", i: "Courier-Oblique", bi: "Courier-BoldOblique" },
}
