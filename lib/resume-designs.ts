/**
 * Central design specifications for the premium resume formats.
 *
 * A single `ResumeDesign` object drives all three renderers for a format:
 *   - the editable preview  (components/resumes/shared/ConfigurableResume.tsx)
 *   - the PDF generator     (lib/pdf-generators/design-pdf-engine.ts)
 *   - the DOCX generator    (lib/docx-generators/design-docx-engine.ts)
 *
 * Colours are stored as 6-digit hex strings WITHOUT a leading "#".
 */

export type DesignLayout = "single" | "sidebar-left"
export type DesignHeader = "centered" | "left" | "band"
export type DesignFont = "serif" | "sans"
export type SectionTitleStyle = "rule-full" | "underline" | "left-bar" | "plain"
export type SkillStyle = "pills" | "grouped-line" | "bullets"

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
}

const PLACEHOLDER_IMG =
  "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/modern.png"

export const RESUME_DESIGNS: ResumeDesign[] = [
  // 1 ─────────────────────────────────────────────────────────────────────
  {
    id: "exec-serif",
    name: "Executive Serif",
    description:
      "Timeless single-column executive layout with classic serif type, centered header and refined section rules.",
    category: "Executive",
    suggestedFor: ["Executives", "Finance", "Legal", "Consulting"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "centered",
    font: "serif",
    sizes: { name: 26, section: 12, item: 11.5, content: 10.5, small: 9.5 },
    colors: {
      name: "1a1a1a",
      heading: "1a1a1a",
      accent: "1a1a1a",
      text: "2b2b2b",
      secondary: "595959",
      divider: "1a1a1a",
    },
    sectionTitle: "rule-full",
    uppercaseTitles: true,
    uppercaseName: true,
    letterSpacingTitles: true,
    skillStyle: "grouped-line",
  },
  // 2 ─────────────────────────────────────────────────────────────────────
  {
    id: "minimal-slate",
    name: "Minimalist Slate",
    description:
      "Clean, airy single-column design with generous whitespace, quiet slate tones and understated section labels.",
    category: "Modern",
    suggestedFor: ["Product", "Design", "Engineering", "Startups"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "left",
    font: "sans",
    sizes: { name: 24, section: 11, item: 11, content: 10, small: 9 },
    colors: {
      name: "0f172a",
      heading: "334155",
      accent: "475569",
      text: "334155",
      secondary: "64748b",
      divider: "e2e8f0",
    },
    sectionTitle: "plain",
    uppercaseTitles: true,
    uppercaseName: false,
    letterSpacingTitles: true,
    skillStyle: "grouped-line",
  },
  // 3 ─────────────────────────────────────────────────────────────────────
  {
    id: "corporate-navy",
    name: "Corporate Navy",
    description:
      "Confident corporate layout with a deep navy header band and crisp navy-accented section headings.",
    category: "Professional",
    suggestedFor: ["Corporate", "Management", "Sales", "Operations"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "band",
    font: "sans",
    sizes: { name: 24, section: 11.5, item: 11, content: 10, small: 9 },
    colors: {
      name: "ffffff",
      heading: "1e3a5f",
      accent: "1e3a5f",
      text: "1f2937",
      secondary: "6b7280",
      divider: "cbd5e1",
      headerBg: "1e3a5f",
      headerText: "ffffff",
    },
    sectionTitle: "left-bar",
    uppercaseTitles: true,
    uppercaseName: true,
    letterSpacingTitles: true,
    skillStyle: "grouped-line",
  },
  // 4 ─────────────────────────────────────────────────────────────────────
  {
    id: "tech-teal",
    name: "Tech Teal",
    description:
      "Modern technologist resume with teal accents, underlined headings and skill pills for a sharp contemporary feel.",
    category: "Modern",
    suggestedFor: ["Software Engineering", "Data", "DevOps", "IT"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "left",
    font: "sans",
    sizes: { name: 24, section: 11, item: 11, content: 10, small: 9 },
    colors: {
      name: "0f172a",
      heading: "0f172a",
      accent: "0d9488",
      text: "334155",
      secondary: "64748b",
      divider: "99f6e4",
    },
    sectionTitle: "underline",
    uppercaseTitles: true,
    uppercaseName: false,
    letterSpacingTitles: true,
    skillStyle: "pills",
  },
  // 5 ─────────────────────────────────────────────────────────────────────
  {
    id: "accent-stripe-indigo",
    name: "Indigo Accent",
    description:
      "Distinctive single-column design with an indigo accent stripe down the left edge and bold indigo section markers.",
    category: "Creative",
    suggestedFor: ["Marketing", "Product", "Creative", "Communications"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "left",
    font: "sans",
    sizes: { name: 25, section: 11, item: 11, content: 10, small: 9 },
    colors: {
      name: "1e1b4b",
      heading: "312e81",
      accent: "4f46e5",
      text: "374151",
      secondary: "6b7280",
      divider: "e0e7ff",
    },
    sectionTitle: "left-bar",
    uppercaseTitles: true,
    uppercaseName: false,
    letterSpacingTitles: true,
    accentStripe: true,
    skillStyle: "pills",
  },
  // 6 ─────────────────────────────────────────────────────────────────────
  {
    id: "timeline-pro",
    name: "Timeline Pro",
    description:
      "Career-progression layout that maps experience and education onto a clean vertical timeline with blue accents.",
    category: "Modern",
    suggestedFor: ["All industries", "Career progression", "Generalists"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "left",
    font: "sans",
    sizes: { name: 25, section: 11, item: 11, content: 10, small: 9 },
    colors: {
      name: "0f172a",
      heading: "1e293b",
      accent: "2563eb",
      text: "334155",
      secondary: "64748b",
      divider: "dbeafe",
    },
    sectionTitle: "underline",
    uppercaseTitles: true,
    uppercaseName: false,
    letterSpacingTitles: true,
    timeline: true,
    skillStyle: "grouped-line",
  },
  // 7 ─────────────────────────────────────────────────────────────────────
  {
    id: "sidebar-maroon",
    name: "Maroon Sidebar",
    description:
      "Premium two-column resume with a soft neutral sidebar and warm maroon accents for a polished, editorial look.",
    category: "Modern",
    suggestedFor: ["Senior Professionals", "Academia", "Healthcare"],
    isAtsFriendly: false,
    image: PLACEHOLDER_IMG,
    layout: "sidebar-left",
    header: "left",
    font: "sans",
    sizes: { name: 24, section: 11, item: 10.5, content: 9.5, small: 8.5 },
    colors: {
      name: "7f1d1d",
      heading: "7f1d1d",
      accent: "7f1d1d",
      text: "292524",
      secondary: "78716c",
      divider: "e7e5e4",
      sidebarBg: "f5f0ef",
      sidebarText: "44403c",
      sidebarHeading: "7f1d1d",
      sidebarAccent: "9f1239",
    },
    sectionTitle: "underline",
    uppercaseTitles: true,
    uppercaseName: true,
    letterSpacingTitles: true,
    skillStyle: "bullets",
  },
  // 8 ─────────────────────────────────────────────────────────────────────
  {
    id: "sidebar-emerald",
    name: "Emerald Sidebar",
    description:
      "Striking two-column layout with a deep emerald sidebar, light accents and a confident modern hierarchy.",
    category: "Modern",
    suggestedFor: ["Executives", "Product Managers", "Consultants"],
    isAtsFriendly: false,
    image: PLACEHOLDER_IMG,
    layout: "sidebar-left",
    header: "left",
    font: "sans",
    sizes: { name: 25, section: 11, item: 10.5, content: 9.5, small: 8.5 },
    colors: {
      name: "064e3b",
      heading: "065f46",
      accent: "059669",
      text: "1f2937",
      secondary: "6b7280",
      divider: "d1fae5",
      sidebarBg: "064e3b",
      sidebarText: "d1fae5",
      sidebarHeading: "6ee7b7",
      sidebarAccent: "34d399",
    },
    sectionTitle: "underline",
    uppercaseTitles: true,
    uppercaseName: true,
    letterSpacingTitles: true,
    skillStyle: "bullets",
  },
  // 9 ─────────────────────────────────────────────────────────────────────
  {
    id: "header-burgundy",
    name: "Burgundy Banner",
    description:
      "Editorial single-column resume with a full-width burgundy banner header and elegant serif body type.",
    category: "Executive",
    suggestedFor: ["Executives", "Hospitality", "Branding", "Leadership"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "band",
    font: "serif",
    sizes: { name: 26, section: 12, item: 11.5, content: 10.5, small: 9.5 },
    colors: {
      name: "fdf2f4",
      heading: "6b1f2a",
      accent: "6b1f2a",
      text: "2b2b2b",
      secondary: "6b7280",
      divider: "e5d6d8",
      headerBg: "6b1f2a",
      headerText: "fdf2f4",
    },
    sectionTitle: "rule-full",
    uppercaseTitles: true,
    uppercaseName: true,
    letterSpacingTitles: true,
    skillStyle: "grouped-line",
  },
  // 10 ────────────────────────────────────────────────────────────────────
  {
    id: "compact-pro",
    name: "Compact Pro",
    description:
      "Information-dense single-column layout that fits more content per page while staying clean and highly readable.",
    category: "Professional",
    suggestedFor: ["Experienced professionals", "Technical roles", "Dense resumes"],
    isAtsFriendly: true,
    image: PLACEHOLDER_IMG,
    layout: "single",
    header: "left",
    font: "sans",
    sizes: { name: 21, section: 10, item: 10, content: 9, small: 8 },
    colors: {
      name: "111827",
      heading: "1f2937",
      accent: "1d4ed8",
      text: "374151",
      secondary: "6b7280",
      divider: "e5e7eb",
    },
    sectionTitle: "underline",
    uppercaseTitles: true,
    uppercaseName: false,
    letterSpacingTitles: true,
    skillStyle: "grouped-line",
  },
]

export const RESUME_DESIGN_MAP: Record<string, ResumeDesign> = RESUME_DESIGNS.reduce(
  (acc, d) => {
    acc[d.id] = d
    return acc
  },
  {} as Record<string, ResumeDesign>,
)

export function getResumeDesign(id: string): ResumeDesign | undefined {
  return RESUME_DESIGN_MAP[id]
}
