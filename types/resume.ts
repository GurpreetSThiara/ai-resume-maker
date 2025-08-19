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

  // Custom fields (DOB, gender, etc.)
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
}

// 🔹 Base Section Type
export interface BaseSection {
  id: string
  title: string
  type: SectionType
}

// 🔹 Allowed Section Types
export type SectionType =
  | "education"
  | "experience"
  | "skills"
  | "languages"
  | "certifications"
  | "custom"

// 🔹 Specialized Sections
export interface EducationSection extends BaseSection {
  type: "education"
  items: Education[]
}

export interface ExperienceSection extends BaseSection {
  type: "experience"
  items: Experience[]
}

export interface SkillsSection extends BaseSection {
  type: "skills"
  items: string[]
}

export interface LanguagesSection extends BaseSection {
  type: "languages"
  items: string[]
}

export interface CertificationsSection extends BaseSection {
  type: "certifications"
  items: string[]
}

export interface CustomSection extends BaseSection {
  type: "custom"
  content: string[]
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
  | CustomSection

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
}
