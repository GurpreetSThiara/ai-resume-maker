// 🔹 Core Resume Data
export interface ResumeData {
  basics: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string
    summary: string

  }

  // Additional links or data (DOB, gender, etc.)
  custom: Record<string, CustomField>

  // Flexible sections (Education, Experience, Skills, Custom, etc.)
  sections: Section[]

  // Per-resume styling overrides applied on top of the selected template's design.
  // Optional + backward compatible (older resumes simply omit it). Edited via the
  // Visual editor's styling toolbar and merged into the design for preview + export.
  style?: ResumeStyleOverrides

  // Per-line formatting overrides, keyed by a stable lineKey() (see utils/lineStyle.ts).
  // Lets the user mark an individual line/field bold/italic/underline/colored/etc.
  // Optional + backward compatible. Honoured identically by the HTML, PDF and DOCX renderers.
  lineStyles?: Record<string, PerLineStyle>
}

// 🔹 Whole-line formatting override (granularity = one line/field, which exports cleanly).
export interface PerLineStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  /** Hex colour, with or without leading '#'. */
  color?: string
  /** Point size override for this line. */
  size?: number
  font?: "sans" | "serif" | "mono"
  /** Letter-case transform applied at render time (data is unchanged). */
  transform?: "upper" | "lower" | "title"
  /** Highlight / background colour (hex, with or without '#'). */
  background?: string
  /** Line-height multiplier (e.g. 1.4). Affects multi-line fields only. */
  lineHeight?: number
  /** Letter spacing / tracking, in points. */
  letterSpacing?: number
  /** Soft drop shadow on the text. */
  shadow?: boolean
}

// 🔹 Per-resume style overrides (document/section level — what pdf-lib can render).
export interface ResumeStyleOverrides {
  /** Accent colour as a hex string (with or without leading '#'). */
  accent?: string
  /** Name colour override (hex). */
  nameColor?: string
  /** Heading colour override (hex). */
  headingColor?: string
  /** Body text colour override (hex). */
  textColor?: string
  font?: "serif" | "sans"
  /** Scales font sizes AND the vertical spacing between sections/entries/lines: compact / normal / relaxed. */
  density?: "compact" | "normal" | "relaxed"
  /** When true, education entries render as a tight 1–2 line block (no bullet highlights). */
  condensedEducation?: boolean
  /** Page margin preset — scales the page's outer margins. Default normal. */
  pageMargin?: "compact" | "normal" | "wide"
  /** Explicit point-size overrides (win over density) for the name / section headings / body. */
  nameSize?: number
  headingSize?: number
  bodySize?: number
  sectionTitle?: "rule-full" | "underline" | "left-bar" | "plain" | "boxed" | "centered" | "pill"
  skillStyle?: "pills" | "grouped-line" | "bullets" | "bars" | "dots"
  layout?: "single" | "sidebar-left" | "sidebar-right"
  uppercaseName?: boolean
  uppercaseTitles?: boolean
  accentStripe?: boolean
  timeline?: boolean
}

// 🔹 Custom field definition
export interface CustomField {
  title: string
  content: string
  hidden: boolean
  id: string
  link: boolean
  order?: number // Order for reordering additional links or data
  column?: 1 | 2 // 1 for left sidebar, 2 for main content
}

// 🔹 Base Section Type
export interface BaseSection {
  id: string
  title: string
  type: SectionType
  order?: number // Add order field for reordering
  hidden?: boolean
  column?: 1 | 2 // 1 for left sidebar, 2 for main content
}

// 🔹 Centralized Section Type constants
export const SECTION_TYPES = {
  EDUCATION: "education",
  EXPERIENCE: "experience",
  SKILLS: "skills",
  LANGUAGES: "languages",
  CERTIFICATIONS: "certifications",
  PROJECTS: "projects",
  CUSTOM: "custom",
  CUSTOM_FIELDS: "custom-fields", // All additional links or data grouped together
} as const

// 🔹 Allowed Section Types (derived from constants)
export type SectionType = typeof SECTION_TYPES[keyof typeof SECTION_TYPES]

// 🔹 Specialized Sections
export interface EducationSection extends BaseSection {
  type: typeof SECTION_TYPES.EDUCATION
  items: Education[]
}

export interface ExperienceSection extends BaseSection {
  type: typeof SECTION_TYPES.EXPERIENCE
  items: Experience[]
}

// 🔹 Skills grouping model
export interface SkillGroup {
  id: string
  title: string
  skills: string[]
}

export interface SkillsSection extends BaseSection {
  type: typeof SECTION_TYPES.SKILLS
  /**
   * Flat list of skills kept for backward compatibility.
   * All renderers (templates, PDF/DOCX, summary, review, etc.) can continue
   * to rely on this field.
   */
  items: string[]
  /**
   * Whether visual templates draw proficiency bars/dots for skills (and language
   * dots). Users can switch this off to render plain pills/tags instead.
   * Undefined = on (default).
   */
  showLevels?: boolean
  /**
   * User-set proficiency per skill, keyed by skill name, on a 1–5 scale.
   * Skills not present here fall back to an auto starting value (by list order).
   * Kept as a side map so `items`/`groups` stay plain string lists.
   */
  skillLevels?: Record<string, number>
  /**
   * New grouped skills structure used by the Skills editor UI.
   * When absent, the editor will automatically treat `items` as a single
   * "General" group so existing resumes still work seamlessly.
   */
  groups?: SkillGroup[]
}

export interface LanguagesSection extends BaseSection {
  type: typeof SECTION_TYPES.LANGUAGES
  items: string[]
}

export interface CertificationsSection extends BaseSection {
  type: typeof SECTION_TYPES.CERTIFICATIONS
  items: string[]
}

export interface Project {
  name: string
  link?: string
  repo?: string
  description?: string[]
  startDate?: string
  endDate?: string
}

export interface ProjectsSection extends BaseSection {
  type: typeof SECTION_TYPES.PROJECTS
  items: Project[]
}

export interface CustomSection extends BaseSection {
  type: typeof SECTION_TYPES.CUSTOM
  content: string[]
}

export interface CustomFieldsSection extends BaseSection {
  type: typeof SECTION_TYPES.CUSTOM_FIELDS
  // This section represents all additional links or data as a group
}

// 🔹 Specific Data Models
export interface Education {
  institution: string
  degree: string
  startDate?: string
  endDate?: string
  location?: string
  /** CGPA / GPA / percentage, e.g. "8.6 CGPA" or "3.8/4.0". */
  gpa?: string
  highlights?: string[]
}

export interface Experience {
  company: string
  role: string
  startDate: string
  endDate: string
  location?: string
  achievements?: string[]
}

// 🔹 Union Type for All Sections
export type Section =
  | EducationSection
  | ExperienceSection
  | SkillsSection
  | LanguagesSection
  | CertificationsSection
  | ProjectsSection
  | CustomSection
  | CustomFieldsSection

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  preview?: string
  theme: {
    fontSize: {
      name: string
      section: string
      content: string
      small: string
    }
    colors: {
      primary: string
      secondary: string
      text: string
      accent: string
    }
    spacing: {
      section: string
      item: string
      content: string
    }
    layout: {
      container: string
      header: string
      content: string
    }
  }
  pdfConfig: {
    fonts: {
      regular: string
      bold: string
    }
    sizes: {
      name: number
      section: number
      content: number
      small: number
    }
    colors: {
      text: { r: number; g: number; b: number }
      heading: { r: number; g: number; b: number }
      secondary: { r: number; g: number; b: number }
      linkColor: { r: number; g: number; b: number }
    }
    spacing: {
      page: number
      section: number
      item: number
    }
  }
  isAtsFriendly?: boolean
}

export interface PDFGenerationOptions {
  resumeData: ResumeData
  template: ResumeTemplate
  filename?: string
  linkDisplay?: 'short' | 'full'
}
