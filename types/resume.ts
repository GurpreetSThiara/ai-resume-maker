export interface ResumeData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  custom: Record<
    string,
    {
      title: string
      content: string
      hidden: boolean
      id: string
      link: boolean
    }
  >
  sections: Array<{
    id: string
    title: string
    content: Record<string, string[]>
  }>
}

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
