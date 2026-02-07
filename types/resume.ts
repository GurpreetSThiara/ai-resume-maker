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
}

// 🔹 Custom field definition
export interface CustomField {
  title: string
  content: string
  hidden: boolean
  id: string
  link: boolean
  order?: number // Order for reordering additional links or data
}

// 🔹 Base Section Type
export interface BaseSection {
  id: string
  title: string
  type: SectionType
  order?: number // Add order field for reordering
  hidden?: boolean
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
}

export interface PDFGenerationOptions {
  resumeData: ResumeData
  template: ResumeTemplate
  filename?: string
  linkDisplay?: 'short' | 'full'
}
