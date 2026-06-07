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
import { RESUME_IMAGES } from "@/constants/resumeConstants"
import { RESUME_DESIGNS, type DesignCategory } from "@/lib/resume-designs"

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

// A rotating pool of preview images. Missing/broken images fall back to a
// graceful placeholder in the UI (see TemplateThumb), so this only needs to
// give cards visual variety.
const THUMB_POOL: string[] = [
  RESUME_IMAGES.CLASSIC,
  RESUME_IMAGES.MODERN,
  RESUME_IMAGES.CREATIVE,
  RESUME_IMAGES.ELEGANT,
  RESUME_IMAGES.GOOGLE_STYLE,
  RESUME_IMAGES.CLASSIC_BLUE,
  RESUME_IMAGES.ATS_GREEN,
  RESUME_IMAGES.ATS_YELLOW,
  RESUME_IMAGES.COMPACT_LINES,
  RESUME_IMAGES.ATS_COMPACT,
  RESUME_IMAGES.TIMELINE_1,
  RESUME_IMAGES.MODERN_SPLIT,
].filter(Boolean) as string[]

const total = RESUME_DESIGNS.length

export const TEMPLATES: MarketplaceTemplate[] = RESUME_DESIGNS.map((d, i) => {
  const downloads = Math.round(
    d.popularityScore * 137 + d.atsScore * 19 + (total - i) * 53 + 1840,
  )
  return {
    id: d.id,
    slug: d.id,
    name: d.name,
    category: d.categoryId,
    templateId: d.id,
    thumbnail: THUMB_POOL.length ? THUMB_POOL[i % THUMB_POOL.length] : "",
    description: d.description,
    tags: d.tags,
    atsScore: d.atsScore,
    popularityScore: d.popularityScore,
    downloads,
    isPremium: d.isPremium,
    isNew: i >= total - 8,
    recency: total - i,
  }
})

/* ────────────────────────────────────────────────────────────────────────
 * Stats + helpers
 * ──────────────────────────────────────────────────────────────────────── */

export const STATS = {
  templates: TEMPLATES.length,
  categories: CATEGORIES.length,
  resumesCreated: 124000,
}

export const ALL_TAGS: string[] = Array.from(new Set(TEMPLATES.flatMap((t) => t.tags))).sort()

export function categoryCounts(): Record<string, number> {
  const counts: Record<string, number> = { all: TEMPLATES.length }
  for (const t of TEMPLATES) counts[t.category] = (counts[t.category] || 0) + 1
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
export const previewTemplateHref = (templateId: string) => `${CREATE_BASE}/preview?template=${templateId}`
