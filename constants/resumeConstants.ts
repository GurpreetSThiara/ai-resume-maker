import { RESUME_DESIGNS } from "@/lib/resume-designs"

export const DEFAULT_EDUCATION = {
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
  location: "",
  highlights: []
}

export const DEFAULT_EXPERIENCE = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  location: "",
  achievements: [] as string[],
}

export const DEFAULT_PROJECT = {
  name: "",
  link: "",
  repo: "",
  description: [] as string[],
  startDate: "",
  endDate: "",
}

// Default/sentinel title for an unnamed skill group — also used as the
// comparison that decides whether to render a group heading at all (see
// utils/skills.ts, components/skills-section.tsx, and
// components/resumes/shared/ConfigurableResume.tsx).
export const DEFAULT_SKILL_GROUP_TITLE = "General"

export const RESUME_IMAGES = {
  CLASSIC: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/classic.png",
  ATS_GREEN: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/atsgreen.png",
  ATS_YELLOW: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/atsyellow.png",
  ATS_TIMELINE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/timeline.png",
  COMPACT_LINES: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/compact-lines.png",
  ATS_COMPACT: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/ats-compact.png",



  CLASSIC_BLUE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/classic-blue.png",
  MODERN: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/modern.png",
  MODERN_SIDEBAR: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/modern-sidebar.png",
  BOLD_PROFESSIONAL: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/bold-professional.png",
  CREATIVE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/creative.png",
  ELEGANT: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/elegant.png",
  GOOGLE_STYLE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/google-resume.png",
  TIMELINE_1: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/timeline_1.png",
  MODERN_SPLIT: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/modern-split.png",
}

// Canonical id/name/image for the hand-built ("legacy") templates — the single
// source of truth shared with the marketplace catalog (see
// app/free-ats-resume-templates/_marketplace/data.ts), so the two never drift
// apart on id or display name.
export const LEGACY_RESUME_TEMPLATES = [
  { id: "ats-classic-compact", name: "ATS Classic Compact", image: RESUME_IMAGES.ATS_COMPACT },
  { id: "ats-classic", name: "ATS Classic", image: RESUME_IMAGES.CLASSIC },
  { id: "ats-compact-lines", name: "ATS Classic Lines", image: RESUME_IMAGES.COMPACT_LINES },
  { id: "classic-blue", name: "Classic Blue", image: RESUME_IMAGES.CLASSIC_BLUE },
  { id: "ats-green", name: "ATS Friendly (Green)", image: RESUME_IMAGES.ATS_GREEN },
  { id: "ats-yellow", name: "Classic Yellow", image: RESUME_IMAGES.ATS_YELLOW },
  { id: "modern-sidebar", name: "Modern Sidebar", image: RESUME_IMAGES.MODERN_SIDEBAR },
  { id: "bold-professional", name: "Bold Professional", image: RESUME_IMAGES.BOLD_PROFESSIONAL },
  { id: "modern-split", name: "Modern Split", image: RESUME_IMAGES.MODERN_SPLIT },
] as const

const LEGACY_TEMPLATE_META: Record<
  string,
  {
    category: string
    description: string
    suggestedFor: string[]
    isAtsFriendly: boolean
    isBestForAts?: boolean
  }
> = {
  "ats-classic-compact": {
    category: "ATS",
    description: "Compact version of ATS Classic with reduced spacing and no decorative lines for maximum content density.",
    suggestedFor: ["Experienced professionals", "Technical roles", "Dense resumes"],
    isAtsFriendly: true,
    isBestForAts: true,
  },
  "ats-classic": {
    category: "Professional",
    description: "Clean, minimal and highly readable, with plain section headings (no rules).",
    suggestedFor: ["Engineering", "Finance", "Operations"],
    isAtsFriendly: true,
  },
  "ats-compact-lines": {
    category: "ATS",
    description: "ATS Classic with black rule lines under each section heading.",
    suggestedFor: ["Experienced professionals", "Technical roles", "Dense resumes"],
    isAtsFriendly: true,
  },
  "classic-blue": {
    category: "Contemporary",
    description: "A modern layout with subtle accents and clear sectioning for creative and product roles.",
    suggestedFor: ["Product", "Design", "Marketing"],
    isAtsFriendly: true,
  },
  "ats-green": {
    category: "ATS",
    description: "Optimized for Applicant Tracking Systems — simple structure and semantic headings.",
    suggestedFor: ["All industries - ATS aware"],
    isAtsFriendly: true,
  },
  "ats-yellow": {
    category: "Contemporary",
    description: "A modern layout with subtle accents and clear sectioning for creative and product roles.",
    suggestedFor: ["Product", "Design", "Marketing"],
    isAtsFriendly: true,
  },
  "modern-sidebar": {
    category: "Modern",
    description: "Two-column layout with sidebar for skills and contact info. Stylish and professional.",
    suggestedFor: ["Designers", "Developers", "Creative roles"],
    isAtsFriendly: false,
  },
  "bold-professional": {
    category: "Professional",
    description: "Impactful design with a dark navy header and clean single-column layout. High preview fidelity.",
    suggestedFor: ["Executive", "Management", "Professional"],
    isAtsFriendly: false,
  },
  "modern-split": {
    category: "Modern",
    description: "Premium two-column layout with a dark sidebar and clean typography. Perfect for a modern, professional look.",
    suggestedFor: ["Executives", "Product Managers", "Senior Professionals"],
    isAtsFriendly: false,
  },
}

export const RESUME_TEMPLATES = [
  ...LEGACY_RESUME_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    url: t.image,
    ...LEGACY_TEMPLATE_META[t.id],
  })),
  // ── Premium config-driven designs ──────────────────────────────────────
  ...RESUME_DESIGNS.map((d) => ({
    id: d.id,
    name: d.name,
    url: d.image,
    category: d.category,
    description: d.description,
    suggestedFor: d.suggestedFor,
    isAtsFriendly: d.isAtsFriendly,
  })),
  // {
  //   id: "ats-timeline",  // Temporarily disabled
  //   name: "Timeline",
  //   url: RESUME_IMAGES.TIMELINE_1,
  //   category: "Modern",
  //   description: "Visual timeline design with blue accents. Perfect for showcasing career progression clearly.",
  //   suggestedFor: ["All industries", "Career progression focused"]
  // },

  // },
  // {
  //   id: "elegant",
  //   name: "Elegant",
  //   url: RESUME_IMAGES.ELEGANT,
  //   category: "Executive",
  //   description: "Sophisticated layout with refined typography for senior and executive roles.",
  //   suggestedFor: ["Management", "Executive"]
  // },
  // {
  //   id: "google",
  //   name: "Google-Style",
  //   url: RESUME_IMAGES.GOOGLE_STYLE,
  //   category: "Professional",
  //   description: "Inspired by modern tech company resumes: dense but structured for technical applicants.",
  //   suggestedFor: ["Software Engineering", "Data Science"]
  // }
]