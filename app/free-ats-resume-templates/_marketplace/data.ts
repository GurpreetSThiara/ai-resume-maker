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
import { RESUME_IMAGES } from "@/constants/resumeConstants"

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
  downloads: number
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
}

/** A design family: one layout recipe with one or more colour variants. */
export interface FamilyGroup {
  familyId: string
  familyName: string
  variants: MarketplaceTemplate[]
}

export type SortKey = "popular" | "ats" | "recent" | "downloads" | "az" | "za"

export type AccessFilter = "all" | "free" | "premium"

export interface Filters {
  query: string
  category: CategoryId | "all"
  access: AccessFilter
  minAts: 0 | 90 | 95 | 98
  tags: string[]
  sort: SortKey
}

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

const designTemplates: MarketplaceTemplate[] = RESUME_DESIGNS.map((d, i) => {
  const downloads = Math.round(
    d.popularityScore * 137 + d.atsScore * 19 + (total - i) * 53 + 1840,
  )
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
    downloads,
    isPremium: d.isPremium,
    isNew: i >= total - 8,
    recency: total - i,
    familyId: d.family,
    familyName: d.familyName,
    colorName: d.colorName,
    accentHex: `#${d.colors.accent}`,
  }
})

/* ────────────────────────────────────────────────────────────────────────
 * Original / legacy templates — the hand-built renderers that predate the
 * config-driven design engine. They have their own PDF + DOCX generators and
 * editable previews, so they remain fully usable; we list them here so they
 * keep appearing in the gallery. Each is its own single-variant family.
 * ──────────────────────────────────────────────────────────────────────── */
interface LegacyDef {
  id: string
  name: string
  category: CategoryId
  thumb: string
  ats: number
  pop: number
  premium: boolean
  accent: string
  tags: string[]
}

const LEGACY_DEFS: LegacyDef[] = [
  { id: "ats-classic", name: "ATS Classic", category: "ats-friendly", thumb: RESUME_IMAGES.CLASSIC, ats: 99, pop: 97, premium: false, accent: "374151", tags: ["ATS", "Classic", "Single Column"] },
  { id: "ats-classic-compact", name: "ATS Classic Compact", category: "ats-friendly", thumb: RESUME_IMAGES.ATS_COMPACT, ats: 99, pop: 92, premium: false, accent: "374151", tags: ["ATS", "Compact", "Dense"] },
  { id: "classic-blue", name: "Classic Blue", category: "professional", thumb: RESUME_IMAGES.CLASSIC_BLUE, ats: 96, pop: 94, premium: false, accent: "1d4ed8", tags: ["Professional", "Blue", "Classic"] },
  { id: "ats-green", name: "ATS Friendly Green", category: "ats-friendly", thumb: RESUME_IMAGES.ATS_GREEN, ats: 98, pop: 88, premium: false, accent: "15803d", tags: ["ATS", "Headers", "Green"] },
  { id: "ats-yellow", name: "Classic Yellow", category: "ats-friendly", thumb: RESUME_IMAGES.ATS_YELLOW, ats: 98, pop: 84, premium: false, accent: "b45309", tags: ["ATS", "Accent", "Yellow"] },
  { id: "ats-compact-lines", name: "ATS Classic Lines", category: "ats-friendly", thumb: RESUME_IMAGES.COMPACT_LINES, ats: 98, pop: 86, premium: false, accent: "111827", tags: ["ATS", "Classic", "Lines"] },
  { id: "modern-sidebar", name: "Modern Sidebar", category: "designer", thumb: RESUME_IMAGES.MODERN_SIDEBAR, ats: 87, pop: 89, premium: false, accent: "1e293b", tags: ["Designer", "Sidebar", "Two Column"] },
  { id: "bold-professional", name: "Bold Professional", category: "professional", thumb: RESUME_IMAGES.BOLD_PROFESSIONAL, ats: 89, pop: 90, premium: false, accent: "1e293b", tags: ["Professional", "Bold", "Header"] },
  { id: "modern-split", name: "Modern Split", category: "modern", thumb: RESUME_IMAGES.MODERN_SPLIT, ats: 88, pop: 93, premium: true, accent: "0f172a", tags: ["Modern", "Two Column", "Premium"] },
]

const LEGACY_TEMPLATES: MarketplaceTemplate[] = LEGACY_DEFS.map((d) => ({
  id: d.id,
  slug: d.id,
  name: d.name,
  category: d.category,
  templateId: d.id,
  thumbnail: d.thumb || "",
  description: `${d.name} — a proven, recruiter-tested resume template with reliable ATS parsing.`,
  tags: d.tags,
  atsScore: d.ats,
  popularityScore: d.pop,
  downloads: Math.round(d.pop * 150 + d.ats * 20 + 4200),
  isPremium: d.premium,
  isNew: false,
  recency: -1,
  familyId: `legacy-${d.id}`,
  familyName: d.name,
  colorName: "Default",
  accentHex: `#${d.accent}`,
}))

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
  resumesCreated: 124000,
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
  access: "all",
  minAts: 0,
  tags: [],
  sort: "popular",
}

const SORTERS: Record<SortKey, (a: MarketplaceTemplate, b: MarketplaceTemplate) => number> = {
  popular: (a, b) => b.popularityScore - a.popularityScore,
  ats: (a, b) => b.atsScore - a.atsScore,
  recent: (a, b) => b.recency - a.recency,
  downloads: (a, b) => b.downloads - a.downloads,
  az: (a, b) => a.name.localeCompare(b.name),
  za: (a, b) => b.name.localeCompare(a.name),
}

export function filterAndSort(templates: MarketplaceTemplate[], f: Filters): MarketplaceTemplate[] {
  const q = f.query.trim().toLowerCase()
  const result = templates.filter((t) => {
    if (f.category !== "all" && t.category !== f.category) return false
    if (f.access === "free" && t.isPremium) return false
    if (f.access === "premium" && !t.isPremium) return false
    if (f.minAts && t.atsScore < f.minAts) return false
    if (f.tags.length && !f.tags.every((tag) => t.tags.includes(tag))) return false
    if (q) {
      const haystack = `${t.name} ${t.description} ${CATEGORY_MAP[t.category]?.name ?? ""} ${t.tags.join(" ")}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
  return result.sort(SORTERS[f.sort])
}

export const TRENDING = [...TEMPLATES].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 6)
export const ATS_CHAMPIONS = [...TEMPLATES]
  .sort((a, b) => b.atsScore - a.atsScore || b.popularityScore - a.popularityScore)
  .slice(0, 8)
export const MOST_DOWNLOADED = [...TEMPLATES].sort((a, b) => b.downloads - a.downloads).slice(0, 8)

export function formatDownloads(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(n)
}

export const CREATE_BASE = "/free-ats-resume-templates"
export const useTemplateHref = (templateId: string) => `${CREATE_BASE}/create?template=${templateId}`
