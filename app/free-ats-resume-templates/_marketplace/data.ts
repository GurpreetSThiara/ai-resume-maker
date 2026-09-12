import {
  Briefcase,
  Sparkles,
  Minus,
  Crown,
  Building2,
  Palette,
  PenTool,
  Code2,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Rocket,
  Megaphone,
  TrendingUp,
  Boxes,
  Landmark,
  HeartPulse,
  Cog,
  Scale,
  Flag,
  type LucideIcon,
} from "lucide-react"
import { RESUME_DESIGNS, type DesignCategory } from "@/lib/resume-designs"
import { LEGACY_RESUME_TEMPLATES } from "@/constants/resumeConstants"
import { getResumeDesign, type DesignFont, type DesignHeader, type DesignLayout, type SkillStyle } from "@/lib/resume-designs"
import {
  colorFamilyOf,
  ATS_THRESHOLDS,
  COLOR_VALUES,
  FEATURE_VALUES,
  FONT_VALUES,
  FORMAT_VALUES,
  HEADER_VALUES,
  LAYOUT_VALUES,
  PRICE_VALUES,
  SKILL_STYLE_VALUES,
  type ColorFamily,
  type FeatureFacet,
  type FormatFacet,
  type PriceFacet,
} from "./facets"

/* ────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────── */

export type CategoryId = DesignCategory

export interface MarketplaceCategory {
  id: CategoryId
  name: string
  description: string
  icon: LucideIcon
}

export interface MarketplaceTemplate {
  id: string
  slug: string
  name: string
  category: CategoryId
  /** Real renderer id used for routing to the editor/preview + downloads. */
  templateId: string
  thumbnail: string
  description: string
  tags: string[]
  atsScore: number
  popularityScore: number
  isPremium: boolean
  isNew: boolean
  /** Higher = more recently added (used for "Recently Added" sort). */
  recency: number
  /** Design family — color variants of the same layout share this id. */
  familyId: string
  familyName: string
  colorName: string
  /** Accent colour (hex with #) used for the colour swatch. */
  accentHex: string

  // ── derived design facets, read off the ResumeDesign this card renders ──
  // Kept on the card so filtering never has to re-resolve the design per
  // keystroke, and so a facet can never describe something the design does not
  // actually do.
  layout: DesignLayout
  font: DesignFont
  headerStyle: DesignHeader
  skillStyle: SkillStyle
  colorFamily: ColorFamily
  /** False when the design's DOCX approximation is too poor to offer. */
  hasDocx: boolean
  monogram: boolean
  timeline: boolean
  accentStripe: boolean
  showRole: boolean
}

/** A design family: one layout recipe with one or more colour variants. */
export interface FamilyGroup {
  familyId: string
  familyName: string
  variants: MarketplaceTemplate[]
}

export type SortKey = "popular" | "ats" | "recent" | "az" | "za"

export interface Filters {
  query: string
  category: CategoryId | "all"
  minAts: 0 | 90 | 95 | 98
  tags: string[]
  sort: SortKey
  layouts: DesignLayout[]
  fonts: DesignFont[]
  headers: DesignHeader[]
  skillStyles: SkillStyle[]
  colors: ColorFamily[]
  prices: PriceFacet[]
  formats: FormatFacet[]
  features: FeatureFacet[]
}

/** Every filter key whose value is a multi-select array. */
export const MULTI_FILTER_KEYS = [
  "tags",
  "layouts",
  "fonts",
  "headers",
  "skillStyles",
  "colors",
  "prices",
  "formats",
  "features",
] as const

export type MultiFilterKey = (typeof MULTI_FILTER_KEYS)[number]

/** Per-option result counts, so a facet can show what selecting it would give. */
export type FacetCounts = Record<string, number>

/* ────────────────────────────────────────────────────────────────────────
 * Categories
 * ──────────────────────────────────────────────────────────────────────── */

export const CATEGORIES: MarketplaceCategory[] = [
  { id: "professional", name: "Professional", description: "Clean, trustworthy layouts that work across every industry.", icon: Briefcase },
  { id: "modern", name: "Modern", description: "Contemporary designs with bold type and confident spacing.", icon: Sparkles },
  { id: "minimalist", name: "Minimalist", description: "Distraction-free resumes that let your content lead.", icon: Minus },
  { id: "executive", name: "Executive", description: "Refined, authoritative formats for senior leadership.", icon: Crown },
  { id: "corporate", name: "Corporate", description: "Polished structures tuned for large organizations.", icon: Building2 },
  { id: "creative", name: "Creative", description: "Expressive layouts with personality and color.", icon: Palette },
  { id: "designer", name: "Designer", description: "Portfolio-grade resumes for visual professionals.", icon: PenTool },
  { id: "developer", name: "Developer", description: "Engineer-friendly templates with room for the stack.", icon: Code2 },
  { id: "ats-friendly", name: "ATS Friendly", description: "Parser-perfect resumes engineered to beat screening bots.", icon: ShieldCheck },
  { id: "academic", name: "Academic", description: "Structured CVs for research, teaching, and publications.", icon: GraduationCap },
  { id: "student", name: "Student", description: "First-resume formats that highlight potential.", icon: BookOpen },
  { id: "internship", name: "Internship", description: "Entry-level layouts built to land the first role.", icon: Rocket },
  { id: "marketing", name: "Marketing", description: "Persuasive resumes for brand and growth talent.", icon: Megaphone },
  { id: "sales", name: "Sales", description: "Results-forward formats that put numbers up front.", icon: TrendingUp },
  { id: "product", name: "Product Management", description: "Outcome-driven layouts for product leaders.", icon: Boxes },
  { id: "finance", name: "Finance", description: "Precise, conservative designs for finance roles.", icon: Landmark },
  { id: "healthcare", name: "Healthcare", description: "Credential-focused resumes for clinical careers.", icon: HeartPulse },
  { id: "engineering", name: "Engineering", description: "Technical templates for every engineering discipline.", icon: Cog },
  { id: "legal", name: "Legal", description: "Formal, exacting formats for legal professionals.", icon: Scale },
  { id: "government", name: "Government", description: "Standards-compliant resumes for public sector roles.", icon: Flag },
]

/** Category ids, derived from CATEGORIES so a new category is counted automatically. */
export const CATEGORY_VALUES: CategoryId[] = CATEGORIES.map((c) => c.id)

export const CATEGORY_MAP: Record<CategoryId, MarketplaceCategory> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c
    return acc
  },
  {} as Record<CategoryId, MarketplaceCategory>,
)

/* ────────────────────────────────────────────────────────────────────────
 * Template catalog — derived from the single design source of truth.
 *
 * Every entry maps 1:1 to a real config-driven design (`templateId === id`),
 * so EVERY template here is selectable in the editor and downloadable as both
 * a PDF and a DOCX. No reused renderers, no dead cards.
 * ──────────────────────────────────────────────────────────────────────── */

// Each design already carries its per-template preview screenshot URL
// (`d.image`, hosted on jsdelivr). Missing images fall back to a graceful
// placeholder in the UI (see TemplateThumb).
const total = RESUME_DESIGNS.length

/**
 * Reads the design facets off whichever ResumeDesign a card renders.
 *
 * Both catalogs resolve through getResumeDesign, so legacy and config-driven
 * templates are described identically — no second metadata table to drift.
 */
function designFacets(templateId: string, accentHex: string) {
  const d = getResumeDesign(templateId)
  return {
    layout: d?.layout ?? "single",
    font: d?.font ?? "sans",
    headerStyle: d?.header ?? "left",
    skillStyle: d?.skillStyle ?? "bullets",
    colorFamily: colorFamilyOf(accentHex),
    hasDocx: !d?.pdfOnly,
    monogram: !!d?.monogram,
    timeline: !!d?.timeline,
    accentStripe: !!d?.accentStripe,
    showRole: !!d?.showRole,
  } as const
}

const designTemplates: MarketplaceTemplate[] = RESUME_DESIGNS.map((d, i) => {
  return {
    id: d.id,
    slug: d.id,
    name: d.name,
    category: d.categoryId,
    templateId: d.id,
    thumbnail: d.image,
    description: d.description,
    tags: d.tags,
    atsScore: d.atsScore,
    popularityScore: d.popularityScore,
    isPremium: d.isPremium,
    isNew: i >= total - 8,
    recency: total - i,
    familyId: d.family,
    familyName: d.familyName,
    colorName: d.colorName,
    accentHex: `#${d.colors.accent}`,
    ...designFacets(d.id, `#${d.colors.accent}`),
  }
})

/* ────────────────────────────────────────────────────────────────────────
 * Original / legacy templates — the hand-built renderers that predate the
 * config-driven design engine. They have their own PDF + DOCX generators and
 * editable previews, so they remain fully usable; we list them here so they
 * keep appearing in the gallery. Each is its own single-variant family.
 * ──────────────────────────────────────────────────────────────────────── */
// Per-id marketplace-specific metadata for the legacy templates. `id`/`name`/
// `thumb` come from LEGACY_RESUME_TEMPLATES (constants/resumeConstants.ts) —
// the single source shared with the non-marketplace template list, so the two
// can't drift on id spelling or display name.
const LEGACY_META: Record<
  string,
  { category: CategoryId; ats: number; pop: number; premium: boolean; accent: string; tags: string[] }
> = {
  "ats-classic": { category: "ats-friendly", ats: 99, pop: 97, premium: false, accent: "374151", tags: ["ATS", "Classic", "Single Column"] },
  "ats-classic-compact": { category: "ats-friendly", ats: 99, pop: 92, premium: false, accent: "374151", tags: ["ATS", "Compact", "Dense"] },
  "classic-blue": { category: "professional", ats: 96, pop: 94, premium: false, accent: "1d4ed8", tags: ["Professional", "Blue", "Classic"] },
  "ats-green": { category: "ats-friendly", ats: 98, pop: 88, premium: false, accent: "15803d", tags: ["ATS", "Headers", "Green"] },
  "ats-yellow": { category: "ats-friendly", ats: 98, pop: 84, premium: false, accent: "b45309", tags: ["ATS", "Accent", "Yellow"] },
  "ats-compact-lines": { category: "ats-friendly", ats: 98, pop: 86, premium: false, accent: "111827", tags: ["ATS", "Classic", "Lines"] },
  "modern-sidebar": { category: "designer", ats: 87, pop: 89, premium: false, accent: "1e293b", tags: ["Designer", "Sidebar", "Two Column"] },
  "bold-professional": { category: "professional", ats: 89, pop: 90, premium: false, accent: "1e293b", tags: ["Professional", "Bold", "Header"] },
  "modern-split": { category: "modern", ats: 88, pop: 93, premium: true, accent: "0f172a", tags: ["Modern", "Two Column", "Split"] },
}

const LEGACY_TEMPLATES: MarketplaceTemplate[] = LEGACY_RESUME_TEMPLATES.map((t) => {
  const meta = LEGACY_META[t.id]
  return {
    id: t.id,
    slug: t.id,
    name: t.name,
    category: meta.category,
    templateId: t.id,
    thumbnail: t.image || "",
    description: `${t.name} — a proven, recruiter-tested resume template with reliable ATS parsing.`,
    tags: meta.tags,
    atsScore: meta.ats,
    popularityScore: meta.pop,
    isPremium: meta.premium,
    isNew: false,
    recency: -1,
    familyId: `legacy-${t.id}`,
    familyName: t.name,
    colorName: "Default",
    accentHex: `#${meta.accent}`,
    ...designFacets(t.id, `#${meta.accent}`),
  }
})

// Original templates first, then the config-driven design catalog.
export const TEMPLATES: MarketplaceTemplate[] = [...LEGACY_TEMPLATES, ...designTemplates]

/**
 * Groups templates into design families, clubbing color-only variants of the
 * same layout together. Within a family, duplicate colours are de-duplicated so
 * each swatch is unique. Family order follows the (already sorted) input order.
 */
export function groupFamilies(templates: MarketplaceTemplate[]): FamilyGroup[] {
  const map = new Map<string, FamilyGroup>()
  for (const t of templates) {
    let g = map.get(t.familyId)
    if (!g) {
      g = { familyId: t.familyId, familyName: t.familyName, variants: [] }
      map.set(t.familyId, g)
    }
    if (!g.variants.some((v) => v.colorName === t.colorName)) g.variants.push(t)
  }
  return Array.from(map.values())
}

/* ────────────────────────────────────────────────────────────────────────
 * Stats + helpers
 * ──────────────────────────────────────────────────────────────────────── */

export const STATS = {
  templates: TEMPLATES.length,
  categories: CATEGORIES.length,
}

export const ALL_TAGS: string[] = Array.from(new Set(TEMPLATES.flatMap((t) => t.tags))).sort()

// Counts reflect the number of distinct DESIGN FAMILIES (what the grid shows),
// since color-only variants are clubbed into a single card.
export function categoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  counts.all = new Set(TEMPLATES.map((t) => t.familyId)).size
  const perCat: Record<string, Set<string>> = {}
  for (const t of TEMPLATES) {
    ;(perCat[t.category] ||= new Set()).add(t.familyId)
  }
  for (const k in perCat) counts[k] = perCat[k].size
  return counts
}

export const DEFAULT_FILTERS: Filters = {
  query: "",
  category: "all",
  minAts: 0,
  tags: [],
  sort: "popular",
  layouts: [],
  fonts: [],
  headers: [],
  skillStyles: [],
  colors: [],
  prices: [],
  formats: [],
  features: [],
}

/**
 * Does a template satisfy one facet group?
 *
 * An empty selection means "no opinion", so it matches everything. Within a
 * group the options are OR'd (blue OR green), which is what shoppers expect;
 * across groups they are AND'd. Tags are the deliberate exception — they stay
 * AND'd, because tags narrow rather than widen.
 */
function matchesFacets(t: MarketplaceTemplate, f: Filters): boolean {
  if (f.layouts.length && !f.layouts.includes(t.layout)) return false
  if (f.fonts.length && !f.fonts.includes(t.font)) return false
  if (f.headers.length && !f.headers.includes(t.headerStyle)) return false
  if (f.skillStyles.length && !f.skillStyles.includes(t.skillStyle)) return false
  if (f.colors.length && !f.colors.includes(t.colorFamily)) return false

  if (f.prices.length) {
    const price: PriceFacet = t.isPremium ? "premium" : "free"
    if (!f.prices.includes(price)) return false
  }

  if (f.formats.length) {
    const format: FormatFacet = t.hasDocx ? "pdf-docx" : "pdf-only"
    if (!f.formats.includes(format)) return false
  }

  if (f.features.length) {
    const has: Record<FeatureFacet, boolean> = {
      monogram: t.monogram,
      timeline: t.timeline,
      accentStripe: t.accentStripe,
      showRole: t.showRole,
      isNew: t.isNew,
    }
    // Features are AND'd: asking for a monogram AND a timeline means both.
    if (!f.features.every((key) => has[key])) return false
  }

  return true
}

const SORTERS: Record<SortKey, (a: MarketplaceTemplate, b: MarketplaceTemplate) => number> = {
  popular: (a, b) => b.popularityScore - a.popularityScore,
  ats: (a, b) => b.atsScore - a.atsScore,
  recent: (a, b) => b.recency - a.recency,
  az: (a, b) => a.name.localeCompare(b.name),
  za: (a, b) => b.name.localeCompare(a.name),
}

export function matchesFilters(t: MarketplaceTemplate, f: Filters): boolean {
  if (f.category !== "all" && t.category !== f.category) return false
  if (f.minAts && t.atsScore < f.minAts) return false
  if (f.tags.length && !f.tags.every((tag) => t.tags.includes(tag))) return false

  const q = f.query.trim().toLowerCase()
  if (q) {
    const haystack =
      `${t.name} ${t.description} ${CATEGORY_MAP[t.category]?.name ?? ""} ${t.tags.join(" ")}`.toLowerCase()
    if (!haystack.includes(q)) return false
  }

  return matchesFacets(t, f)
}

export function filterAndSort(templates: MarketplaceTemplate[], f: Filters): MarketplaceTemplate[] {
  return templates.filter((t) => matchesFilters(t, f)).sort(SORTERS[f.sort])
}

/**
 * How many design families each facet option would yield.
 *
 * Counted with that option's OWN group relaxed, so the numbers answer "what do
 * I get if I add this?" rather than collapsing to zero the moment one option in
 * the group is picked. Counts families, not variants, because a family is what
 * the grid renders as a card.
 */
export function facetCounts(f: Filters): Record<string, FacetCounts> {
  const familiesMatching = (predicate: (t: MarketplaceTemplate) => boolean) => {
    const seen = new Set<string>()
    for (const t of TEMPLATES) if (predicate(t)) seen.add(t.familyId)
    return seen.size
  }

  const countGroup = <T extends string>(
    key: MultiFilterKey,
    options: readonly T[],
    valueOf: (t: MarketplaceTemplate) => T | T[],
  ): FacetCounts => {
    const relaxed = { ...f, [key]: [] } as Filters
    const counts: FacetCounts = {}
    for (const option of options) {
      counts[option] = familiesMatching((t) => {
        if (!matchesFilters(t, relaxed)) return false
        const value = valueOf(t)
        return Array.isArray(value) ? value.includes(option) : value === option
      })
    }
    return counts
  }

  return {
    layouts: countGroup("layouts", LAYOUT_VALUES, (t) => t.layout),
    fonts: countGroup("fonts", FONT_VALUES, (t) => t.font),
    headers: countGroup("headers", HEADER_VALUES, (t) => t.headerStyle),
    skillStyles: countGroup("skillStyles", SKILL_STYLE_VALUES, (t) => t.skillStyle),
    colors: countGroup("colors", COLOR_VALUES, (t) => t.colorFamily),
    prices: countGroup("prices", PRICE_VALUES, (t) => (t.isPremium ? "premium" : "free")),
    formats: countGroup("formats", FORMAT_VALUES, (t) => (t.hasDocx ? "pdf-docx" : "pdf-only")),
    features: countGroup("features", FEATURE_VALUES, (t) =>
      FEATURE_VALUES.filter((key) =>
        key === "isNew" ? t.isNew : key === "monogram" ? t.monogram : key === "timeline" ? t.timeline : key === "accentStripe" ? t.accentStripe : t.showRole,
      ),
    ),
    tags: countGroup("tags", ALL_TAGS, (t) => t.tags),
    minAts: ATS_THRESHOLDS.reduce<FacetCounts>((acc, threshold) => {
      const relaxed = { ...f, minAts: 0 } as Filters
      acc[threshold] = familiesMatching((t) => matchesFilters(t, relaxed) && t.atsScore >= threshold)
      return acc
    }, {}),
    category: CATEGORY_VALUES.reduce<FacetCounts>((acc, id) => {
      const relaxed = { ...f, category: "all" } as Filters
      acc[id] = familiesMatching((t) => matchesFilters(t, relaxed) && t.category === id)
      return acc
    }, {
      all: familiesMatching((t) => matchesFilters(t, { ...f, category: "all" } as Filters)),
    }),
  }
}

/**
 * Counts over the unfiltered catalog.
 *
 * An option that is zero here can never match anything, so the sidebar drops it
 * rather than showing a permanently disabled row — "Yellow" and "Pink" have no
 * templates at all, and a filter that can never do anything is just clutter.
 * Computed once: the catalog is static.
 */
export const BASE_FACET_COUNTS: Record<string, FacetCounts> = facetCounts(DEFAULT_FILTERS)

/** Options within a group that at least one template can match. */
export function availableOptions<T extends { value: string }>(
  group: string,
  options: T[],
): T[] {
  const base = BASE_FACET_COUNTS[group]
  if (!base) return options
  return options.filter((o) => (base[o.value] ?? 0) > 0)
}

/** How many facet groups are narrowing the results right now. */
export function countActiveFilters(f: Filters): number {
  const multi = MULTI_FILTER_KEYS.reduce((n, key) => n + (f[key] as string[]).length, 0)
  return multi + (f.minAts !== 0 ? 1 : 0)
}

export const TRENDING = [...TEMPLATES].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 6)
export const ATS_CHAMPIONS = [...TEMPLATES]
  .sort((a, b) => b.atsScore - a.atsScore || b.popularityScore - a.popularityScore)
  .slice(0, 8)

export const CREATE_BASE = "/free-ats-resume-templates"
// Not a hook — a pure path builder. It was named useTemplateHref, which made
// ESLint treat it as one and flag TemplatePreviewModal for calling a hook
// after an early return.
export const templateHref = (templateId: string) => `${CREATE_BASE}/create?template=${templateId}`
