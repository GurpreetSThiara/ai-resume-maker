/**
 * Central design specifications for the premium resume formats.
 *
 * This is the SINGLE SOURCE OF TRUTH for every config-driven template. One
 * `ResumeDesign` object drives all of:
 *   - the editable preview  (components/resumes/shared/ConfigurableResume.tsx)
 *   - the PDF generator     (lib/pdf-generators/design-pdf-engine.ts)
 *   - the DOCX generator    (lib/docx-generators/design-docx-engine.ts)
 *   - the templates gallery (lib/templates, constants/resumeConstants)
 *   - the marketplace        (app/free-ats-resume-templates/_marketplace/data.ts)
 *
 * Because the PDF and DOCX dispatchers both fall through to the design engines
 * for any design id, EVERY design listed here is automatically downloadable as
 * both a PDF and a DOCX. Add a design here and it becomes a fully working,
 * selectable, downloadable template everywhere.
 *
 * Colours are stored as 6-digit hex strings WITHOUT a leading "#".
 */

export type DesignLayout = "single" | "sidebar-left" | "sidebar-right"
export type DesignHeader = "centered" | "left" | "band" | "geometric"
export type DesignFont = "serif" | "sans"
export type SectionTitleStyle = "rule-full" | "underline" | "left-bar" | "plain" | "boxed" | "centered" | "pill"
export type SkillStyle = "pills" | "grouped-line" | "bullets" | "bars" | "dots"

/**
 * Deterministic, auto-derived proficiency level (0..1) for skill bars/dots.
 * Skills carry no level in the data model, so we taper by position within a
 * group — the first listed skill reads as strongest. Shared by all renderers.
 */
export const skillLevel = (index: number): number => Math.max(0.5, 0.95 - index * 0.12)

/** Out of 5 filled dots, for the "dots" skill/language style. */
export const skillDotsFilled = (index: number): number =>
  Math.max(3, Math.round(skillLevel(index) * 5))

/**
 * The proficiency level (1–5) used to draw a skill's bar/dots. A user-set value
 * in the `skillLevels` map wins; otherwise we fall back to an auto starting
 * value derived from list order. Shared by the editor and all three renderers.
 */
export const effectiveSkillLevel = (
  levels: Record<string, number> | undefined,
  name: string,
  index: number,
): number => {
  const v = levels ? levels[name] : undefined
  if (typeof v === "number" && v >= 1 && v <= 5) return Math.round(v)
  return skillDotsFilled(index)
}

/** Marketplace category ids (kept in sync with the marketplace CATEGORIES list). */
export type DesignCategory =
  | "professional"
  | "modern"
  | "minimalist"
  | "executive"
  | "corporate"
  | "creative"
  | "designer"
  | "developer"
  | "ats-friendly"
  | "academic"
  | "student"
  | "internship"
  | "marketing"
  | "sales"
  | "product"
  | "finance"
  | "healthcare"
  | "engineering"
  | "legal"
  | "government"

export interface DesignColors {
  name: string
  heading: string
  accent: string
  text: string
  secondary: string
  divider: string
  headerBg?: string
  headerText?: string
  sidebarBg?: string
  sidebarText?: string
  sidebarHeading?: string
  sidebarAccent?: string
}

export interface DesignSizes {
  name: number
  section: number
  item: number
  content: number
  small: number
}

export interface ResumeDesign {
  id: string
  name: string
  description: string
  category: string
  categoryId: DesignCategory
  suggestedFor: string[]
  isAtsFriendly: boolean
  image: string

  layout: DesignLayout
  header: DesignHeader
  font: DesignFont
  sizes: DesignSizes
  colors: DesignColors

  sectionTitle: SectionTitleStyle
  uppercaseTitles: boolean
  uppercaseName: boolean
  letterSpacingTitles: boolean

  accentStripe?: boolean
  timeline?: boolean
  skillStyle: SkillStyle
  /** Draw an initials monogram circle in the header (single) / sidebar top (two-column). */
  monogram?: boolean
  /** Two-column: put name + role (+ monogram) in an accent block at the top of the sidebar. */
  sidebarNameBlock?: boolean
  /** Show a role/headline line under the name (derived from the most recent experience role). */
  showRole?: boolean
  /** PDF-only: visual templates whose DOCX approximation is poor — hide DOCX download. */
  pdfOnly?: boolean

  // ── marketplace metadata ────────────────────────────────────────────────
  tags: string[]
  atsScore: number
  popularityScore: number
  isPremium: boolean

  // ── design family ────────────────────────────────────────────────────────
  // Designs that share the same structural layout and differ only by colour
  // belong to the same `family`, so the marketplace can club them into one
  // card with selectable colour swatches.
  family: string
  familyName: string
  colorName: string
}

// Per-template preview screenshots hosted on the jsdelivr CDN. The file name is
// `<NN>-<id>.png`, where NN is the 1-based position of the design below.
const THUMB_BASE =
  "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/images"
const thumbUrl = (id: string, index: number) =>
  `${THUMB_BASE}/${String(index + 1).padStart(2, "0")}-${id}.png`

/* ────────────────────────────────────────────────────────────────────────
 * Category labels
 * ──────────────────────────────────────────────────────────────────────── */

const CATEGORY_LABEL: Record<DesignCategory, string> = {
  professional: "Professional",
  modern: "Modern",
  minimalist: "Minimalist",
  executive: "Executive",
  corporate: "Corporate",
  creative: "Creative",
  designer: "Designer",
  developer: "Developer",
  "ats-friendly": "ATS Friendly",
  academic: "Academic",
  student: "Student",
  internship: "Internship",
  marketing: "Marketing",
  sales: "Sales",
  product: "Product Management",
  finance: "Finance",
  healthcare: "Healthcare",
  engineering: "Engineering",
  legal: "Legal",
  government: "Government",
}

/* ────────────────────────────────────────────────────────────────────────
 * Sizes
 * ──────────────────────────────────────────────────────────────────────── */

/** Human-friendly name for each design family (a layout/typography recipe). */
const FAMILY_LABEL: Record<string, string> = {
  execSerif: "Executive Serif",
  bandSerif: "Serif Banner",
  classicSerif: "Classic Serif",
  minimal: "Minimalist",
  modernLeft: "Modern Clean",
  band: "Corporate Banner",
  bandPills: "Banner Pills",
  pills: "Modern Pills",
  stripe: "Accent Stripe",
  stripeGrouped: "Accent Edge",
  timeline: "Career Timeline",
  leftbar: "Accent Bar",
  compact: "Compact Pro",
  centeredSans: "Centered",
  sidebar: "Two-Column Sidebar",
  sidebarSerif: "Serif Sidebar",
  boxedModern: "Boxed Modern",
  boxedPills: "Boxed Pills",
  boxedSidebar: "Boxed Sidebar",
  rightSidebar: "Right Sidebar",
  rightSidebarBoxed: "Right Sidebar Pro",
  centeredModern: "Centered Modern",
  centeredSerifP: "Centered Serif",
  timelineSerifP: "Serif Timeline",
  centeredPillsP: "Centered Pills",
  studioMono: "Studio Mono",
  cascade: "Cascade",
  portfolioRight: "Portfolio Coral",
  twoToneStudio: "Two-Tone Studio",
  accentEdgePro: "Accent Edge",
  timelineCraft: "Timeline Craft",
  monoMinimal: "Mono Minimal",
  creativePrism: "Creative Prism",
  boldPrism: "Bold Prism",
  vividPills: "Vivid Pills",
}

/** Display name for each colour palette. */
const PALETTE_LABEL: Record<string, string> = {
  ink: "Ink",
  slate: "Slate",
  navy: "Navy",
  teal: "Teal",
  indigo: "Indigo",
  blue: "Blue",
  maroon: "Maroon",
  emerald: "Emerald",
  burgundy: "Burgundy",
  steel: "Steel Blue",
  charcoal: "Charcoal",
  royal: "Royal",
  forest: "Forest",
  plum: "Plum",
  crimson: "Crimson",
  ocean: "Ocean",
  bronze: "Bronze",
  graphite: "Graphite",
  sky: "Sky",
  rose: "Rose",
  lime: "Lime",
  tealVivid: "Teal",
  coral: "Coral",
  amberIndigo: "Amber",
  goldPlum: "Gold",
}

const SIZE_DEFAULT: DesignSizes = { name: 24, section: 11, item: 11, content: 10, small: 9 }
const SIZE_SERIF: DesignSizes = { name: 26, section: 12, item: 11.5, content: 10.5, small: 9.5 }
const SIZE_COMPACT: DesignSizes = { name: 21, section: 10, item: 10, content: 9, small: 8 }
const SIZE_SIDEBAR: DesignSizes = { name: 24, section: 11, item: 10.5, content: 9.5, small: 8.5 }

/* ────────────────────────────────────────────────────────────────────────
 * Presets — reusable layout/typography recipes
 * ──────────────────────────────────────────────────────────────────────── */

interface Preset {
  layout: DesignLayout
  header: DesignHeader
  font: DesignFont
  sectionTitle: SectionTitleStyle
  skillStyle: SkillStyle
  uppercaseName: boolean
  uppercaseTitles: boolean
  letterSpacingTitles: boolean
  accentStripe?: boolean
  timeline?: boolean
  monogram?: boolean
  sidebarNameBlock?: boolean
  showRole?: boolean
  /** PDF-only template: hide the DOCX download (visual designs DOCX can't reproduce). */
  pdfOnly?: boolean
  sizes: DesignSizes
}

type PresetKey =
  | "execSerif"
  | "bandSerif"
  | "classicSerif"
  | "minimal"
  | "modernLeft"
  | "band"
  | "bandPills"
  | "pills"
  | "stripe"
  | "stripeGrouped"
  | "timeline"
  | "leftbar"
  | "compact"
  | "centeredSans"
  | "sidebar"
  | "sidebarSerif"
  | "boxedModern"
  | "boxedPills"
  | "boxedSidebar"
  | "rightSidebar"
  | "rightSidebarBoxed"
  | "centeredModern"
  | "centeredSerifP"
  | "timelineSerifP"
  | "centeredPillsP"
  // ── graphic-designer families ──────────────────────────────────────────────
  | "studioMono"
  | "cascade"
  | "portfolioRight"
  | "twoToneStudio"
  | "accentEdgePro"
  | "timelineCraft"
  | "monoMinimal"
  | "creativePrism"
  | "boldPrism"
  | "vividPills"

const PRESETS: Record<PresetKey, Preset> = {
  execSerif: { layout: "single", header: "centered", font: "serif", sectionTitle: "rule-full", skillStyle: "grouped-line", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_SERIF },
  bandSerif: { layout: "single", header: "band", font: "serif", sectionTitle: "rule-full", skillStyle: "grouped-line", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_SERIF },
  classicSerif: { layout: "single", header: "left", font: "serif", sectionTitle: "rule-full", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_SERIF },
  minimal: { layout: "single", header: "left", font: "sans", sectionTitle: "plain", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  modernLeft: { layout: "single", header: "left", font: "sans", sectionTitle: "underline", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  band: { layout: "single", header: "band", font: "sans", sectionTitle: "left-bar", skillStyle: "grouped-line", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  bandPills: { layout: "single", header: "band", font: "sans", sectionTitle: "underline", skillStyle: "pills", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  pills: { layout: "single", header: "left", font: "sans", sectionTitle: "underline", skillStyle: "pills", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  stripe: { layout: "single", header: "left", font: "sans", sectionTitle: "left-bar", skillStyle: "pills", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, accentStripe: true, sizes: SIZE_DEFAULT },
  stripeGrouped: { layout: "single", header: "left", font: "sans", sectionTitle: "left-bar", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, accentStripe: true, sizes: SIZE_DEFAULT },
  timeline: { layout: "single", header: "left", font: "sans", sectionTitle: "underline", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, timeline: true, sizes: SIZE_DEFAULT },
  leftbar: { layout: "single", header: "left", font: "sans", sectionTitle: "left-bar", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  compact: { layout: "single", header: "left", font: "sans", sectionTitle: "underline", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_COMPACT },
  centeredSans: { layout: "single", header: "centered", font: "sans", sectionTitle: "rule-full", skillStyle: "grouped-line", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  sidebar: { layout: "sidebar-left", header: "left", font: "sans", sectionTitle: "underline", skillStyle: "bullets", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_SIDEBAR },
  sidebarSerif: { layout: "sidebar-left", header: "left", font: "serif", sectionTitle: "underline", skillStyle: "bullets", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_SIDEBAR },
  // ── new families ──────────────────────────────────────────────────────────
  boxedModern: { layout: "single", header: "left", font: "sans", sectionTitle: "boxed", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: false, sizes: SIZE_DEFAULT },
  boxedPills: { layout: "single", header: "left", font: "sans", sectionTitle: "boxed", skillStyle: "pills", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: false, sizes: SIZE_DEFAULT },
  boxedSidebar: { layout: "sidebar-left", header: "left", font: "sans", sectionTitle: "boxed", skillStyle: "bullets", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, sizes: SIZE_SIDEBAR },
  rightSidebar: { layout: "sidebar-right", header: "left", font: "sans", sectionTitle: "underline", skillStyle: "bullets", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_SIDEBAR },
  rightSidebarBoxed: { layout: "sidebar-right", header: "left", font: "sans", sectionTitle: "boxed", skillStyle: "bullets", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, sizes: SIZE_SIDEBAR },
  centeredModern: { layout: "single", header: "centered", font: "sans", sectionTitle: "centered", skillStyle: "grouped-line", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  centeredSerifP: { layout: "single", header: "centered", font: "serif", sectionTitle: "centered", skillStyle: "grouped-line", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_SERIF },
  timelineSerifP: { layout: "single", header: "left", font: "serif", sectionTitle: "underline", skillStyle: "grouped-line", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, timeline: true, sizes: SIZE_SERIF },
  centeredPillsP: { layout: "single", header: "centered", font: "sans", sectionTitle: "centered", skillStyle: "pills", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: true, sizes: SIZE_DEFAULT },
  // ── graphic-designer families (visual-first; flagged non-ATS via low atsScore) ──
  // Two-column designs put name+role in a sidebar accent block, use pill section
  // headers, and a dotted timeline for experience — the recurring designer look.
  studioMono: { layout: "sidebar-left", header: "left", font: "sans", sectionTitle: "pill", skillStyle: "bars", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, monogram: true, sidebarNameBlock: true, timeline: true, pdfOnly: true, sizes: SIZE_SIDEBAR },
  cascade: { layout: "sidebar-left", header: "left", font: "sans", sectionTitle: "pill", skillStyle: "bars", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, monogram: true, sidebarNameBlock: true, timeline: true, sizes: SIZE_SIDEBAR },
  portfolioRight: { layout: "sidebar-right", header: "left", font: "sans", sectionTitle: "pill", skillStyle: "dots", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, monogram: true, sidebarNameBlock: true, timeline: true, pdfOnly: true, sizes: SIZE_SIDEBAR },
  twoToneStudio: { layout: "sidebar-left", header: "left", font: "sans", sectionTitle: "pill", skillStyle: "bars", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, monogram: true, sidebarNameBlock: true, timeline: true, sizes: SIZE_SIDEBAR },
  accentEdgePro: { layout: "single", header: "left", font: "sans", sectionTitle: "pill", skillStyle: "bars", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: false, accentStripe: true, monogram: true, showRole: true, timeline: true, sizes: SIZE_DEFAULT },
  timelineCraft: { layout: "single", header: "left", font: "sans", sectionTitle: "pill", skillStyle: "bars", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: false, timeline: true, monogram: true, showRole: true, sizes: SIZE_DEFAULT },
  monoMinimal: { layout: "single", header: "left", font: "sans", sectionTitle: "underline", skillStyle: "dots", uppercaseName: false, uppercaseTitles: true, letterSpacingTitles: true, monogram: true, showRole: true, sizes: SIZE_DEFAULT },
  creativePrism: { layout: "single", header: "geometric", font: "sans", sectionTitle: "pill", skillStyle: "pills", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, showRole: true, timeline: true, pdfOnly: true, sizes: SIZE_DEFAULT },
  boldPrism: { layout: "single", header: "geometric", font: "sans", sectionTitle: "pill", skillStyle: "pills", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, showRole: true, timeline: true, sizes: SIZE_DEFAULT },
  vividPills: { layout: "single", header: "band", font: "sans", sectionTitle: "pill", skillStyle: "pills", uppercaseName: true, uppercaseTitles: true, letterSpacingTitles: false, showRole: true, pdfOnly: true, sizes: SIZE_DEFAULT },
}

/* ────────────────────────────────────────────────────────────────────────
 * Palettes
 * ──────────────────────────────────────────────────────────────────────── */

type PaletteKey =
  | "ink"
  | "slate"
  | "navy"
  | "teal"
  | "indigo"
  | "blue"
  | "maroon"
  | "emerald"
  | "burgundy"
  | "steel"
  | "charcoal"
  | "royal"
  | "forest"
  | "plum"
  | "crimson"
  | "ocean"
  | "bronze"
  | "graphite"
  | "sky"
  | "rose"
  // ── vivid designer duotones ─────────────────────────────────────────────────
  | "lime"
  | "tealVivid"
  | "coral"
  | "amberIndigo"
  | "goldPlum"

const PALETTES: Record<PaletteKey, DesignColors> = {
  ink: { name: "1a1a1a", heading: "1a1a1a", accent: "1a1a1a", text: "2b2b2b", secondary: "595959", divider: "1a1a1a" },
  slate: { name: "0f172a", heading: "334155", accent: "475569", text: "334155", secondary: "64748b", divider: "e2e8f0" },
  navy: { name: "0f1f3d", heading: "1e3a5f", accent: "1e3a5f", text: "1f2937", secondary: "6b7280", divider: "cbd5e1", headerBg: "1e3a5f", headerText: "ffffff", sidebarBg: "1e3a5f", sidebarText: "dbe4f0", sidebarHeading: "ffffff", sidebarAccent: "93c5fd" },
  teal: { name: "0f172a", heading: "0f172a", accent: "0d9488", text: "334155", secondary: "64748b", divider: "99f6e4" },
  indigo: { name: "1e1b4b", heading: "312e81", accent: "4f46e5", text: "374151", secondary: "6b7280", divider: "e0e7ff" },
  blue: { name: "0f172a", heading: "1e293b", accent: "2563eb", text: "334155", secondary: "64748b", divider: "dbeafe" },
  maroon: { name: "7f1d1d", heading: "7f1d1d", accent: "7f1d1d", text: "292524", secondary: "78716c", divider: "e7e5e4", sidebarBg: "f5f0ef", sidebarText: "44403c", sidebarHeading: "7f1d1d", sidebarAccent: "9f1239" },
  emerald: { name: "064e3b", heading: "065f46", accent: "059669", text: "1f2937", secondary: "6b7280", divider: "d1fae5", sidebarBg: "064e3b", sidebarText: "d1fae5", sidebarHeading: "6ee7b7", sidebarAccent: "34d399" },
  burgundy: { name: "6b1f2a", heading: "6b1f2a", accent: "6b1f2a", text: "2b2b2b", secondary: "6b7280", divider: "e5d6d8", headerBg: "6b1f2a", headerText: "fdf2f4" },
  steel: { name: "111827", heading: "1f2937", accent: "1d4ed8", text: "374151", secondary: "6b7280", divider: "e5e7eb" },
  charcoal: { name: "111827", heading: "111827", accent: "111827", text: "374151", secondary: "6b7280", divider: "e5e7eb", headerBg: "111827", headerText: "f9fafb", sidebarBg: "1f2937", sidebarText: "d1d5db", sidebarHeading: "ffffff", sidebarAccent: "9ca3af" },
  royal: { name: "1e1b4b", heading: "3730a3", accent: "4338ca", text: "374151", secondary: "6b7280", divider: "e0e7ff", headerBg: "3730a3", headerText: "eef2ff", sidebarBg: "312e81", sidebarText: "e0e7ff", sidebarHeading: "c7d2fe", sidebarAccent: "a5b4fc" },
  forest: { name: "14532d", heading: "166534", accent: "16a34a", text: "1f2937", secondary: "6b7280", divider: "dcfce7", headerBg: "166534", headerText: "f0fdf4", sidebarBg: "14532d", sidebarText: "dcfce7", sidebarHeading: "bbf7d0", sidebarAccent: "4ade80" },
  plum: { name: "3b0764", heading: "6b21a8", accent: "7c3aed", text: "3f3f46", secondary: "71717a", divider: "ede9fe", headerBg: "6b21a8", headerText: "faf5ff", sidebarBg: "581c87", sidebarText: "f3e8ff", sidebarHeading: "e9d5ff", sidebarAccent: "c084fc" },
  crimson: { name: "7f1d1d", heading: "b91c1c", accent: "dc2626", text: "3f3f46", secondary: "71717a", divider: "fee2e2", headerBg: "b91c1c", headerText: "fef2f2" },
  ocean: { name: "083344", heading: "0e7490", accent: "0891b2", text: "164e63", secondary: "475569", divider: "cffafe", headerBg: "0e7490", headerText: "ecfeff", sidebarBg: "083344", sidebarText: "cffafe", sidebarHeading: "67e8f9", sidebarAccent: "22d3ee" },
  bronze: { name: "451a03", heading: "9a3412", accent: "b45309", text: "44403c", secondary: "78716c", divider: "fef3c7", headerBg: "9a3412", headerText: "fff7ed" },
  graphite: { name: "18181b", heading: "27272a", accent: "3f3f46", text: "3f3f46", secondary: "71717a", divider: "e4e4e7", sidebarBg: "27272a", sidebarText: "d4d4d8", sidebarHeading: "fafafa", sidebarAccent: "a1a1aa" },
  sky: { name: "0c4a6e", heading: "0369a1", accent: "0284c7", text: "1f2937", secondary: "6b7280", divider: "e0f2fe" },
  rose: { name: "881337", heading: "9f1239", accent: "e11d48", text: "3f3f46", secondary: "71717a", divider: "ffe4e6", headerBg: "9f1239", headerText: "fff1f2" },
  // Charcoal canvas + lime accent — bars pop on a dark sidebar.
  lime: { name: "171717", heading: "3f6212", accent: "65a30d", text: "262626", secondary: "525252", divider: "e5e5e5", sidebarBg: "171717", sidebarText: "d4d4d4", sidebarHeading: "ffffff", sidebarAccent: "a3e635" },
  // Vivid teal sidebar.
  tealVivid: { name: "042f2e", heading: "0f766e", accent: "0d9488", text: "1f2937", secondary: "6b7280", divider: "ccfbf1", sidebarBg: "0f766e", sidebarText: "ccfbf1", sidebarHeading: "ffffff", sidebarAccent: "5eead4" },
  // Dark slate sidebar with a coral accent.
  coral: { name: "0f172a", heading: "1e293b", accent: "f43f5e", text: "334155", secondary: "64748b", divider: "ffe4e6", sidebarBg: "1e293b", sidebarText: "e2e8f0", sidebarHeading: "ffffff", sidebarAccent: "fb7185" },
  // Indigo header block + amber accent (geometric header).
  amberIndigo: { name: "312e81", heading: "3730a3", accent: "d97706", text: "374151", secondary: "6b7280", divider: "e0e7ff", headerBg: "3730a3", headerText: "ffffff" },
  // Deep violet header + gold accent (dark geometric header).
  goldPlum: { name: "3b0764", heading: "6b21a8", accent: "b45309", text: "3f3f46", secondary: "71717a", divider: "ede9fe", headerBg: "4c1d95", headerText: "faf5ff" },
}

/* ────────────────────────────────────────────────────────────────────────
 * Builder
 * ──────────────────────────────────────────────────────────────────────── */

// [id, name, categoryId, presetKey, paletteKey, atsScore, popularityScore, isPremium, tags]
type Row = [
  string,
  string,
  DesignCategory,
  PresetKey,
  PaletteKey,
  number,
  number,
  boolean,
  string[],
]

function describe(name: string, categoryId: DesignCategory, ats: number): string {
  const cat = CATEGORY_LABEL[categoryId].toLowerCase()
  const atsLine =
    ats >= 98
      ? "Engineered for flawless ATS parsing."
      : ats >= 95
        ? "Optimized to clear ATS screening with ease."
        : ats >= 90
          ? "Strong ATS support with a refined visual edge."
          : "A design-forward layout with solid ATS support."
  return `${name} is a ${cat} resume template. ${atsLine}`
}

function buildColors(preset: Preset, base: DesignColors): DesignColors {
  const c: DesignColors = { ...base }
  if (preset.header === "band" || preset.header === "geometric") {
    c.headerBg = c.headerBg ?? c.accent
    c.headerText = c.headerText ?? "ffffff"
    c.name = c.headerText
  }
  if (preset.layout === "sidebar-left" || preset.layout === "sidebar-right") {
    c.sidebarBg = c.sidebarBg ?? c.heading
    c.sidebarText = c.sidebarText ?? "d1d5db"
    c.sidebarHeading = c.sidebarHeading ?? "ffffff"
    c.sidebarAccent = c.sidebarAccent ?? c.accent
  }
  return c
}

function build(row: Row, index: number): ResumeDesign {
  const [id, name, categoryId, presetKey, paletteKey, atsScore, popularityScore, isPremium, tags] = row
  const preset = PRESETS[presetKey]
  const colors = buildColors(preset, PALETTES[paletteKey])
  return {
    id,
    name,
    description: describe(name, categoryId, atsScore),
    category: CATEGORY_LABEL[categoryId],
    categoryId,
    suggestedFor: tags,
    isAtsFriendly: atsScore >= 92,
    image: thumbUrl(id, index),
    layout: preset.layout,
    header: preset.header,
    font: preset.font,
    sizes: preset.sizes,
    colors,
    sectionTitle: preset.sectionTitle,
    uppercaseTitles: preset.uppercaseTitles,
    uppercaseName: preset.uppercaseName,
    letterSpacingTitles: preset.letterSpacingTitles,
    accentStripe: preset.accentStripe,
    timeline: preset.timeline,
    skillStyle: preset.skillStyle,
    monogram: preset.monogram,
    sidebarNameBlock: preset.sidebarNameBlock,
    showRole: preset.showRole,
    pdfOnly: preset.pdfOnly,
    tags,
    atsScore,
    popularityScore,
    isPremium,
    family: presetKey,
    familyName: FAMILY_LABEL[presetKey] ?? presetKey,
    colorName: PALETTE_LABEL[paletteKey] ?? paletteKey,
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * Catalog — 60+ unique, fully-downloadable designs across all 20 categories.
 *
 * The first 10 ids are preserved from the original release so any existing
 * links / references keep working.
 * ──────────────────────────────────────────────────────────────────────── */

const CATALOG: Row[] = [
  // ── Original 10 (ids preserved) ─────────────────────────────────────────
  ["exec-serif", "Executive Serif", "executive", "execSerif", "ink", 97, 91, false, ["Executive", "Serif", "Leadership"]],
  ["minimal-slate", "Minimalist Slate", "minimalist", "minimal", "slate", 96, 88, false, ["Minimalist", "Clean", "Modern"]],
  ["corporate-navy", "Corporate Navy", "corporate", "band", "navy", 95, 90, false, ["Corporate", "Professional", "Header"]],
  ["tech-teal", "Tech Teal", "developer", "pills", "teal", 96, 95, false, ["Developer", "ATS", "Modern"]],
  ["accent-stripe-indigo", "Indigo Accent", "creative", "stripe", "indigo", 90, 86, true, ["Creative", "Accent", "Bold"]],
  ["timeline-pro", "Timeline Pro", "modern", "timeline", "blue", 94, 89, false, ["Modern", "Timeline", "Career"]],
  ["sidebar-maroon", "Maroon Sidebar", "designer", "sidebar", "maroon", 87, 84, true, ["Designer", "Two Column", "Editorial"]],
  ["sidebar-emerald", "Emerald Sidebar", "designer", "sidebar", "emerald", 88, 92, true, ["Designer", "Two Column", "Sidebar"]],
  ["header-burgundy", "Burgundy Banner", "executive", "bandSerif", "burgundy", 93, 84, true, ["Executive", "Banner", "Serif"]],
  ["compact-pro", "Compact Pro", "professional", "compact", "steel", 97, 87, false, ["Professional", "Compact", "Dense"]],

  // ── Professional ────────────────────────────────────────────────────────
  ["classic-professional", "Classic Professional", "professional", "classicSerif", "ink", 98, 94, false, ["Professional", "ATS", "Single Column"]],
  ["bold-impact", "Bold Impact", "professional", "band", "charcoal", 91, 90, false, ["Professional", "Bold", "Header"]],
  ["refined-steel", "Refined Steel", "professional", "modernLeft", "steel", 96, 86, false, ["Professional", "Clean", "Blue"]],
  ["polished-navy", "Polished Navy", "professional", "modernLeft", "navy", 96, 88, false, ["Professional", "Navy", "Modern"]],

  // ── Modern ───────────────────────────────────────────────────────────────
  ["modern-teal", "Modern Teal", "modern", "pills", "teal", 95, 86, false, ["Modern", "Teal", "Pills"]],
  ["modern-cobalt", "Modern Cobalt", "modern", "modernLeft", "blue", 94, 89, false, ["Modern", "Cobalt", "Clean"]],
  ["modern-ocean", "Modern Ocean", "modern", "bandPills", "ocean", 92, 87, true, ["Modern", "Ocean", "Header"]],
  ["startup-modern", "Startup Modern", "modern", "stripeGrouped", "sky", 93, 88, false, ["Modern", "Startup", "Accent"]],
  ["modern-timeline-violet", "Violet Timeline", "modern", "timeline", "plum", 91, 83, true, ["Modern", "Timeline", "Violet"]],

  // ── Minimalist ─────────────────────────────────────────────────────────
  ["minimal-mono", "Minimal Mono", "minimalist", "minimal", "graphite", 96, 84, false, ["Minimalist", "Mono", "Clean"]],
  ["quiet-compact", "Quiet Compact", "minimalist", "compact", "slate", 97, 77, false, ["Minimalist", "Compact", "Dense"]],

  // ── Executive ────────────────────────────────────────────────────────────
  ["senior-leadership", "Senior Leadership CV", "executive", "execSerif", "ink", 96, 85, true, ["Executive", "Leadership", "Serif"]],
  ["director-profile", "Director Profile", "executive", "bandSerif", "graphite", 93, 80, true, ["Executive", "Director", "Banner"]],
  ["chief-officer", "Chief Officer", "executive", "classicSerif", "navy", 95, 82, true, ["Executive", "C-Suite", "Serif"]],

  // ── Corporate ────────────────────────────────────────────────────────────
  ["consulting-sharp", "Consulting Sharp", "corporate", "modernLeft", "navy", 95, 81, false, ["Corporate", "Consulting", "Navy"]],
  ["operations-clean", "Operations Clean", "corporate", "classicSerif", "ink", 97, 76, false, ["Corporate", "Operations", "ATS"]],

  // ── Creative ─────────────────────────────────────────────────────────────
  ["creative-indigo", "Creative Indigo", "creative", "stripe", "indigo", 89, 82, true, ["Creative", "Indigo", "Stripe"]],
  ["art-director", "Art Director", "creative", "sidebar", "plum", 85, 80, true, ["Creative", "Art", "Two Column"]],
  ["creative-rose", "Creative Rose", "creative", "bandPills", "rose", 87, 84, true, ["Creative", "Rose", "Bold"]],
  ["editorial-maroon", "Editorial Maroon", "creative", "sidebar", "maroon", 86, 78, true, ["Creative", "Editorial", "Sidebar"]],

  // ── Designer ─────────────────────────────────────────────────────────────
  ["ux-designer", "UX Designer", "designer", "sidebar", "ocean", 86, 90, true, ["Designer", "UX", "Portfolio"]],
  ["graphic-designer", "Graphic Designer", "designer", "stripe", "plum", 85, 83, true, ["Designer", "Creative", "Accent"]],
  ["product-designer", "Product Designer", "designer", "sidebar", "charcoal", 87, 85, true, ["Designer", "Product", "Sidebar"]],

  // ── Developer ────────────────────────────────────────────────────────────
  ["frontend-engineer", "Frontend Engineer", "developer", "pills", "teal", 96, 91, false, ["Developer", "Frontend", "Modern"]],
  ["backend-engineer", "Backend Engineer", "developer", "compact", "steel", 97, 85, false, ["Developer", "Backend", "Compact"]],
  ["fullstack-dev", "Full-Stack Dev", "developer", "sidebar", "charcoal", 89, 89, true, ["Developer", "Full Stack", "Two Column"]],
  ["data-engineer", "Data Engineer", "developer", "modernLeft", "ocean", 95, 84, false, ["Developer", "Data", "Modern"]],

  // ── ATS Friendly ─────────────────────────────────────────────────────────
  ["ats-pure", "ATS Pure", "ats-friendly", "minimal", "ink", 99, 92, false, ["ATS", "Safe", "Minimal"]],
  ["ats-structured", "ATS Structured", "ats-friendly", "classicSerif", "ink", 99, 90, false, ["ATS", "Structured", "Serif"]],
  ["ats-modern-safe", "ATS Modern Safe", "ats-friendly", "modernLeft", "slate", 98, 88, false, ["ATS", "Modern", "Clean"]],
  ["ats-compact-safe", "ATS Compact Safe", "ats-friendly", "compact", "graphite", 98, 81, false, ["ATS", "Compact", "Dense"]],
  ["ats-headers", "ATS Headers", "ats-friendly", "leftbar", "forest", 98, 80, false, ["ATS", "Headers", "Clean"]],

  // ── Academic ─────────────────────────────────────────────────────────────
  ["research-academic", "Research Academic CV", "academic", "classicSerif", "ink", 96, 72, false, ["Academic", "Research", "CV"]],
  ["phd-candidate", "PhD Candidate CV", "academic", "execSerif", "navy", 97, 70, false, ["Academic", "PhD", "Serif"]],

  // ── Student ──────────────────────────────────────────────────────────────
  ["graduate-fresh", "Graduate Fresh", "student", "minimal", "blue", 95, 82, false, ["Student", "Graduate", "Clean"]],
  ["first-resume", "First Resume", "student", "modernLeft", "teal", 96, 75, false, ["Student", "Entry", "Modern"]],

  // ── Internship ───────────────────────────────────────────────────────────
  ["internship-ready", "Internship Ready", "internship", "minimal", "sky", 96, 80, false, ["Internship", "Entry", "Minimal"]],
  ["campus-career", "Campus to Career", "internship", "leftbar", "forest", 97, 71, false, ["Internship", "Headers", "Clean"]],

  // ── Marketing ────────────────────────────────────────────────────────────
  ["growth-marketer", "Growth Marketer", "marketing", "stripe", "rose", 90, 88, true, ["Marketing", "Growth", "Accent"]],
  ["brand-storyteller", "Brand Storyteller", "marketing", "bandPills", "plum", 89, 80, false, ["Marketing", "Brand", "Bold"]],
  ["content-strategist", "Content Strategist", "marketing", "modernLeft", "ocean", 92, 82, false, ["Marketing", "Content", "Modern"]],

  // ── Sales ────────────────────────────────────────────────────────────────
  ["sales-closer", "Sales Closer", "sales", "band", "navy", 94, 86, false, ["Sales", "Results", "Navy"]],
  ["account-executive", "Account Executive", "sales", "bandPills", "crimson", 89, 79, false, ["Sales", "Bold", "Quota"]],

  // ── Product Management ───────────────────────────────────────────────────
  ["product-builder", "Product Builder", "product", "sidebar", "ocean", 89, 90, true, ["Product", "Modern", "Outcomes"]],
  ["product-strategist", "Product Strategist", "product", "stripeGrouped", "indigo", 90, 84, true, ["Product", "Strategy", "Accent"]],
  ["product-lead", "Product Lead", "product", "modernLeft", "blue", 93, 86, false, ["Product", "Leadership", "Modern"]],

  // ── Finance ──────────────────────────────────────────────────────────────
  ["finance-analyst", "Finance Analyst", "finance", "classicSerif", "navy", 96, 84, false, ["Finance", "Analyst", "Navy"]],
  ["investment-banker", "Investment Banker", "finance", "execSerif", "ink", 95, 81, true, ["Finance", "Banking", "Serif"]],

  // ── Healthcare ───────────────────────────────────────────────────────────
  ["registered-nurse", "Registered Nurse", "healthcare", "classicSerif", "ocean", 98, 86, false, ["Healthcare", "Nursing", "ATS"]],
  ["clinical-specialist", "Clinical Specialist", "healthcare", "sidebar", "ocean", 87, 73, true, ["Healthcare", "Clinical", "Two Column"]],

  // ── Engineering ──────────────────────────────────────────────────────────
  ["mechanical-engineer", "Mechanical Engineer", "engineering", "compact", "steel", 98, 74, false, ["Engineering", "ATS", "Technical"]],
  ["devops-engineer", "DevOps Engineer", "engineering", "compact", "graphite", 97, 78, false, ["Engineering", "DevOps", "Dense"]],

  // ── Legal ────────────────────────────────────────────────────────────────
  ["attorney-formal", "Attorney Formal", "legal", "execSerif", "ink", 96, 76, false, ["Legal", "Attorney", "Serif"]],

  // ── Government ───────────────────────────────────────────────────────────
  ["federal-resume", "Federal Resume", "government", "classicSerif", "navy", 99, 74, false, ["Government", "Federal", "ATS"]],

  // ── New design families (appended so existing numbering stays stable) ──────
  ["boxed-cobalt", "Cobalt Boxed", "modern", "boxedModern", "blue", 93, 89, false, ["Modern", "Bold", "Headers"]],
  ["boxed-teal-dev", "Teal Boxed", "developer", "boxedPills", "teal", 92, 87, false, ["Developer", "Pills", "Bold"]],
  ["right-sidebar-navy", "Navy Right Sidebar", "professional", "rightSidebar", "navy", 87, 85, false, ["Professional", "Two Column", "Right Sidebar"]],
  ["right-sidebar-emerald", "Emerald Right Sidebar", "designer", "rightSidebarBoxed", "emerald", 86, 84, true, ["Designer", "Two Column", "Bold"]],
  ["centered-slate", "Centered Slate", "minimalist", "centeredModern", "slate", 95, 83, false, ["Minimalist", "Centered", "Clean"]],
  ["centered-executive", "Centered Executive", "executive", "centeredSerifP", "ink", 96, 85, false, ["Executive", "Centered", "Serif"]],
  ["serif-sidebar-charcoal", "Charcoal Serif Sidebar", "academic", "sidebarSerif", "charcoal", 88, 76, true, ["Academic", "Serif", "Sidebar"]],
  ["serif-timeline-burgundy", "Burgundy Serif Timeline", "executive", "timelineSerifP", "burgundy", 91, 80, true, ["Executive", "Timeline", "Serif"]],
  ["boxed-sidebar-plum", "Plum Boxed Sidebar", "creative", "boxedSidebar", "plum", 85, 82, true, ["Creative", "Boxed", "Sidebar"]],
  ["centered-pills-indigo", "Indigo Centered Pills", "marketing", "centeredPillsP", "indigo", 90, 84, true, ["Marketing", "Centered", "Pills"]],

  // ── Graphic-designer templates (visual-first; PDF-only; atsScore < 92 ⇒ non-ATS) ─────
  // Studio Mono — one sidebar layout offered in three colours (Lime / Teal / Ocean).
  // The three rows share the `studioMono` family so they club into one card with swatches.
  ["studio-mono", "Studio Mono", "designer", "studioMono", "lime", 86, 93, true, ["Designer", "Two Column", "Skill Bars"]],
  ["designer-cascade", "Studio Mono", "designer", "studioMono", "tealVivid", 87, 95, true, ["Designer", "Sidebar", "Skill Bars"]],
  ["two-tone-studio", "Studio Mono", "designer", "studioMono", "ocean", 86, 88, true, ["Designer", "Two Column", "Bold"]],
  // Portfolio Coral — right sidebar, skill dots.
  ["portfolio-coral", "Portfolio Coral", "designer", "portfolioRight", "coral", 86, 90, true, ["Designer", "Right Sidebar", "Skill Dots"]],
  // Creative Prism — geometric two-tone header offered in two colours (Amber / Gold).
  ["creative-prism", "Creative Prism", "creative", "creativePrism", "amberIndigo", 85, 86, true, ["Creative", "Geometric", "Bold"]],
  ["bold-prism", "Creative Prism", "creative", "creativePrism", "goldPlum", 85, 84, true, ["Creative", "Geometric", "Dark"]],
  // Vivid Pills — band header, pills.
  ["vivid-pills", "Vivid Pills", "creative", "vividPills", "rose", 86, 85, true, ["Creative", "Pills", "Header"]],
]

export const RESUME_DESIGNS: ResumeDesign[] = CATALOG.map(build)

export const RESUME_DESIGN_MAP: Record<string, ResumeDesign> = RESUME_DESIGNS.reduce(
  (acc, d) => {
    acc[d.id] = d
    return acc
  },
  {} as Record<string, ResumeDesign>,
)

/* ────────────────────────────────────────────────────────────────────────
 * Legacy templates — bridged onto the design engine.
 *
 * The original hand-rolled templates (classic-blue, ats-classic, …) each had
 * their own bespoke PDF/DOCX generator and React preview, every one with its
 * own ad-hoc spacing + pagination logic (and the bugs that come with that).
 * We express each as a `ResumeDesign` here so the PDF engine, DOCX engine and
 * `ConfigurableResume` preview all render them through the single, properly
 * paginated design pipeline.
 *
 * These live in a SEPARATE map (not `RESUME_DESIGNS`) so they remain resolvable
 * by `getResumeDesign(id)` WITHOUT appearing as extra cards in the marketplace
 * gallery — the legacy templates keep their existing `availableTemplates`
 * descriptors.
 * ──────────────────────────────────────────────────────────────────────── */

interface LegacySpec {
  id: string
  name: string
  presetKey: PresetKey
  colors: DesignColors
  /** Per-template overrides on top of the chosen preset. */
  font?: DesignFont
  sizes?: DesignSizes
  sectionTitle?: SectionTitleStyle
  header?: DesignHeader
  isAtsFriendly?: boolean
}

function legacyDesign(spec: LegacySpec): ResumeDesign {
  const preset = PRESETS[spec.presetKey]
  return {
    id: spec.id,
    name: spec.name,
    description: spec.name,
    category: CATEGORY_LABEL.professional,
    categoryId: "professional",
    suggestedFor: [],
    isAtsFriendly: spec.isAtsFriendly ?? true,
    image: "",
    layout: preset.layout,
    header: spec.header ?? preset.header,
    font: spec.font ?? preset.font,
    sizes: spec.sizes ?? preset.sizes,
    colors: spec.colors,
    sectionTitle: spec.sectionTitle ?? preset.sectionTitle,
    uppercaseTitles: preset.uppercaseTitles,
    uppercaseName: preset.uppercaseName,
    letterSpacingTitles: preset.letterSpacingTitles,
    accentStripe: preset.accentStripe,
    timeline: preset.timeline,
    skillStyle: preset.skillStyle,
    tags: [],
    atsScore: spec.isAtsFriendly === false ? 85 : 96,
    popularityScore: 80,
    isPremium: false,
    family: "legacy",
    familyName: "Legacy",
    colorName: "",
  }
}

const LEGACY_SPECS: LegacySpec[] = [
  // ATS Classic 1 — serif, blue headings, left-aligned header, ruled sections.
  {
    id: "classic-blue",
    name: "ATS Classic 1",
    presetKey: "classicSerif",
    colors: {
      name: "1a4db3",
      heading: "1a4db3",
      accent: "1d4ed8",
      text: "2b2b2b",
      secondary: "595959",
      divider: "dbeafe",
    },
  },
  // ATS Classic 2 — traditional serif, near-black ink, ruled sections.
  {
    id: "ats-classic",
    name: "ATS Classic 2",
    presetKey: "classicSerif",
    colors: {
      name: "1a1a1a",
      heading: "1a1a1a",
      accent: "1a1a1a",
      text: "2b2b2b",
      secondary: "595959",
      divider: "9ca3af",
    },
  },
  // ATS Classic Compact — dense serif, no decorative rules.
  {
    id: "ats-classic-compact",
    name: "ATS Classic Compact",
    presetKey: "compact",
    font: "serif",
    sectionTitle: "plain",
    colors: {
      name: "1a1a1a",
      heading: "1a1a1a",
      accent: "1a1a1a",
      text: "2b2b2b",
      secondary: "595959",
      divider: "9ca3af",
    },
  },
  // ATS Compact Lines — dense serif with crisp black section rules.
  {
    id: "ats-compact-lines",
    name: "ATS Compact Lines",
    presetKey: "compact",
    font: "serif",
    sectionTitle: "rule-full",
    colors: {
      name: "1a1a1a",
      heading: "1a1a1a",
      accent: "1a1a1a",
      text: "2b2b2b",
      secondary: "595959",
      divider: "1a1a1a",
    },
  },
  // ATS Green — boxed green section header bars (light text on deep green).
  {
    id: "ats-green",
    name: "ATS Green",
    presetKey: "boxedModern",
    colors: {
      name: "14532d",
      heading: "166534",
      accent: "166534",
      text: "1f2937",
      secondary: "6b7280",
      divider: "166534",
    },
  },
  // ATS Yellow — boxed amber/gold header bars (light text stays readable).
  {
    id: "ats-yellow",
    name: "ATS Yellow",
    presetKey: "boxedModern",
    colors: {
      name: "7c2d12",
      heading: "9a3412",
      accent: "b45309",
      text: "44403c",
      secondary: "78716c",
      divider: "b45309",
    },
  },
  // Modern Sidebar — slate two-column layout with a dark left sidebar.
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    presetKey: "sidebar",
    isAtsFriendly: false,
    colors: {
      name: "0f172a",
      heading: "1e293b",
      accent: "2563eb",
      text: "334155",
      secondary: "64748b",
      divider: "e2e8f0",
      sidebarBg: "1e293b",
      sidebarText: "cbd5e1",
      sidebarHeading: "ffffff",
      sidebarAccent: "60a5fa",
    },
  },
  // Modern Split — premium two-column with a deep slate-900 sidebar.
  {
    id: "modern-split",
    name: "Modern Split",
    presetKey: "sidebar",
    isAtsFriendly: false,
    sizes: { name: 26, section: 11, item: 10.5, content: 9.5, small: 8.5 },
    colors: {
      name: "0f172a",
      heading: "0f172a",
      accent: "2563eb",
      text: "1e293b",
      secondary: "64748b",
      divider: "e2e8f0",
      sidebarBg: "0f172a",
      sidebarText: "cbd5e1",
      sidebarHeading: "ffffff",
      sidebarAccent: "38bdf8",
    },
  },
  // Bold Professional — dark navy banner header, single column.
  {
    id: "bold-professional",
    name: "Bold Professional",
    presetKey: "band",
    isAtsFriendly: false,
    colors: {
      name: "ffffff",
      heading: "1e293b",
      accent: "334155",
      text: "1f2937",
      secondary: "64748b",
      divider: "cbd5e1",
      headerBg: "1e293b",
      headerText: "ffffff",
    },
  },
]

export const LEGACY_DESIGN_MAP: Record<string, ResumeDesign> = LEGACY_SPECS.reduce(
  (acc, spec) => {
    acc[spec.id] = legacyDesign(spec)
    return acc
  },
  {} as Record<string, ResumeDesign>,
)

/** All legacy designs as an array (for building preview components). */
export const LEGACY_DESIGNS: ResumeDesign[] = Object.values(LEGACY_DESIGN_MAP)

export function getResumeDesign(id: string): ResumeDesign | undefined {
  return RESUME_DESIGN_MAP[id] ?? LEGACY_DESIGN_MAP[id]
}
