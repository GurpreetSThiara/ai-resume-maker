import type { LucideIcon } from "lucide-react"
import {
  AlignCenter,
  AlignLeft,
  BadgeCheck,
  Circle,
  Columns2,
  FileText,
  Files,
  Hexagon,
  List,
  PanelLeft,
  PanelRight,
  Rows3,
  Signal,
  Sparkles,
  Square,
  Tags,
  Type,
} from "lucide-react"
import type { DesignFont, DesignHeader, DesignLayout, SkillStyle } from "@/lib/resume-designs"

/**
 * Facet definitions for the template marketplace.
 *
 * Every option here maps to a real property of a ResumeDesign — layout, header
 * treatment, font, skill rendering, export formats — rather than to invented
 * metadata, so a filter can never select an empty set for a reason the user
 * cannot see.
 *
 * Kept as named module constants (not inline arrays in JSX) so the sidebar is
 * declarative config rather than duplicated markup per group.
 */

export interface FacetOption<T extends string> {
  value: T
  label: string
  /** Short clarifier shown under the label where the term is not self-evident. */
  hint?: string
  icon?: LucideIcon
}

/* ── Layout ─────────────────────────────────────────────────────────────── */

export const LAYOUT_OPTIONS: FacetOption<DesignLayout>[] = [
  { value: "single", label: "One column", hint: "Safest for ATS parsing", icon: Rows3 },
  { value: "sidebar-left", label: "Sidebar left", hint: "Two column", icon: PanelLeft },
  { value: "sidebar-right", label: "Sidebar right", hint: "Two column", icon: PanelRight },
]

/* ── Typeface ───────────────────────────────────────────────────────────── */

export const FONT_OPTIONS: FacetOption<DesignFont>[] = [
  { value: "sans", label: "Sans-serif", hint: "Modern, clean", icon: Type },
  { value: "serif", label: "Serif", hint: "Traditional, formal", icon: Type },
]

/* ── Header treatment ───────────────────────────────────────────────────── */

export const HEADER_OPTIONS: FacetOption<DesignHeader>[] = [
  { value: "left", label: "Left aligned", icon: AlignLeft },
  { value: "centered", label: "Centred", icon: AlignCenter },
  { value: "band", label: "Colour band", icon: Square },
  { value: "geometric", label: "Geometric", icon: Hexagon },
]

/* ── Skills rendering ───────────────────────────────────────────────────── */

export const SKILL_STYLE_OPTIONS: FacetOption<SkillStyle>[] = [
  { value: "pills", label: "Pills", icon: Tags },
  { value: "grouped-line", label: "Grouped lines", icon: Columns2 },
  { value: "bullets", label: "Bullets", icon: List },
  { value: "bars", label: "Bars", hint: "Shows a proficiency level", icon: Signal },
  { value: "dots", label: "Dots", hint: "Shows a proficiency level", icon: Circle },
]

/* ── Price ──────────────────────────────────────────────────────────────── */

export type PriceFacet = "free" | "premium"

export const PRICE_OPTIONS: FacetOption<PriceFacet>[] = [
  { value: "free", label: "Free", icon: BadgeCheck },
  { value: "premium", label: "Premium", icon: Sparkles },
]

/* ── Export formats ─────────────────────────────────────────────────────── */

export type FormatFacet = "pdf-docx" | "pdf-only"

export const FORMAT_OPTIONS: FacetOption<FormatFacet>[] = [
  { value: "pdf-docx", label: "PDF and Word", hint: "Download either format", icon: Files },
  { value: "pdf-only", label: "PDF only", hint: "Design does not convert to Word", icon: FileText },
]

/* ── Design features ────────────────────────────────────────────────────── */

export type FeatureFacet = "monogram" | "timeline" | "accentStripe" | "showRole" | "isNew"

export const FEATURE_OPTIONS: FacetOption<FeatureFacet>[] = [
  { value: "monogram", label: "Initials monogram" },
  { value: "timeline", label: "Timeline markers" },
  { value: "accentStripe", label: "Accent stripe" },
  { value: "showRole", label: "Role headline" },
  { value: "isNew", label: "Recently added" },
]

/* ── Colour ─────────────────────────────────────────────────────────────── */

export type ColorFamily =
  | "neutral"
  | "blue"
  | "teal"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "pink"
  | "purple"

/** Representative swatch per family, for the colour grid. */
export const COLOR_OPTIONS: { value: ColorFamily; label: string; swatch: string }[] = [
  { value: "neutral", label: "Neutral", swatch: "#334155" },
  { value: "blue", label: "Blue", swatch: "#1d4ed8" },
  { value: "teal", label: "Teal", swatch: "#0d9488" },
  { value: "green", label: "Green", swatch: "#15803d" },
  { value: "yellow", label: "Yellow", swatch: "#ca8a04" },
  { value: "orange", label: "Orange", swatch: "#c2410c" },
  { value: "red", label: "Red", swatch: "#b91c1c" },
  { value: "pink", label: "Pink", swatch: "#be185d" },
  { value: "purple", label: "Purple", swatch: "#6d28d9" },
]

/**
 * Buckets an accent colour into a named family.
 *
 * Saturation is checked before hue: a near-grey is "neutral" regardless of the
 * hue its tiny colour cast happens to land on, which is what stops charcoal and
 * slate scattering across the colour filter.
 */
export function colorFamilyOf(hex: string): ColorFamily {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  if (delta < 0.12) return "neutral"

  let hue: number
  if (max === r) hue = ((g - b) / delta) % 6
  else if (max === g) hue = (b - r) / delta + 2
  else hue = (r - g) / delta + 4
  hue = (hue * 60 + 360) % 360

  if (hue < 15) return "red"
  if (hue < 40) return "orange"
  if (hue < 70) return "yellow"
  if (hue < 160) return "green"
  if (hue < 200) return "teal"
  if (hue < 260) return "blue"
  if (hue < 300) return "purple"
  if (hue < 340) return "pink"
  return "red"
}

/* ── Value lists, derived from the option tables above ───────────────────
 * Used for facet counting. Derived rather than retyped so a new option cannot
 * be added to a group and silently go uncounted.
 * ────────────────────────────────────────────────────────────────────────── */

export const LAYOUT_VALUES = LAYOUT_OPTIONS.map((o) => o.value)
export const FONT_VALUES = FONT_OPTIONS.map((o) => o.value)
export const HEADER_VALUES = HEADER_OPTIONS.map((o) => o.value)
export const SKILL_STYLE_VALUES = SKILL_STYLE_OPTIONS.map((o) => o.value)
export const PRICE_VALUES = PRICE_OPTIONS.map((o) => o.value)
export const FORMAT_VALUES = FORMAT_OPTIONS.map((o) => o.value)
export const FEATURE_VALUES = FEATURE_OPTIONS.map((o) => o.value)
export const COLOR_VALUES = COLOR_OPTIONS.map((o) => o.value)

/** Minimum-ATS thresholds offered, ascending. 0 ("Any") is handled separately. */
export const ATS_THRESHOLDS = [90, 95, 98] as const
