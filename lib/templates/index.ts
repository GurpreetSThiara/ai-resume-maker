import type { ResumeTemplate } from "@/types/resume"

export const googleTemplate: ResumeTemplate = {
  id: "google",
  name: "ATS Classic 1",
  description: "Clean, professional template inspired by Google's design principles",
  theme: {
    fontSize: {
      name: "text-3xl",
      section: "text-xl",
      content: "text-base",
      small: "text-sm",
    },
    colors: {
      primary: "text-blue-700",
      secondary: "text-gray-600",
      text: "text-gray-800",
      accent: "text-blue-600",
    },
    spacing: {
      section: "mb-8",
      item: "mb-4",
      content: "mb-2",
    },
    layout: {
      container: "max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden",
      header: "border-b border-gray-200 p-4",
      content: "p-6",
    },
  },
  pdfConfig: {
    fonts: {
      regular: "TimesRoman",
      bold: "TimesRomanBold",
    },
    sizes: {
      name: 20,
      section: 14,
      content: 12,
      small: 10,
    },
    colors: {
      text: { r: 0.2, g: 0.2, b: 0.2 },
      heading: { r: 0.1, g: 0.3, b: 0.7 },
      secondary: { r: 0.4, g: 0.4, b: 0.4 },
      linkColor: { r: 0, g: 0, b: 1 },
    },
    spacing: {
      page: 15,
      section: 20,
      item: 10,
    },
  },
}

// Future templates can be added here
export const modernTemplate: ResumeTemplate = {
  id: "modern",
  name: "Modern Professional",
  description: "Contemporary design with clean lines and modern typography",
  // ... template configuration
  theme: {
    fontSize: {
      name: "text-4xl",
      section: "text-2xl",
      content: "text-lg",
      small: "text-base",
    },
    colors: {
      primary: "text-purple-700",
      secondary: "text-gray-500",
      text: "text-gray-900",
      accent: "text-purple-600",
    },
    spacing: {
      section: "mb-10",
      item: "mb-6",
      content: "mb-3",
    },
    layout: {
      container: "max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl overflow-hidden",
      header: "bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6",
      content: "p-8",
    },
  },
  pdfConfig: {
    fonts: {
      regular: "Helvetica",
      bold: "HelveticaBold",
    },
    sizes: {
      name: 24,
      section: 16,
      content: 14,
      small: 12,
    },
    colors: {
      text: { r: 0.1, g: 0.1, b: 0.1 },
      heading: { r: 0.4, g: 0.2, b: 0.8 },
      secondary: { r: 0.3, g: 0.3, b: 0.3 },
      linkColor: { r: 0.4, g: 0.2, b: 0.8 },
    },
    spacing: {
      page: 18,
      section: 24,
      item: 12,
    },
  },
}

export const classicATSTemplate: ResumeTemplate = {
  id: "ats-classic",
  name: "ATS Classic 2",
  description: "Traditional, single-column layout optimized for parsers",
  theme: {
    fontSize: { name: "text-3xl", section: "text-xl", content: "text-base", small: "text-sm" },
    colors: { primary: "text-gray-800", secondary: "text-gray-500", text: "text-gray-900", accent: "text-gray-700" },
    spacing: { section: "mb-8", item: "mb-4", content: "mb-2" },
    layout: { container: "max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden", header: "border-b p-4", content: "p-6" },
  },
  pdfConfig: {
    fonts: { regular: "TimesRoman", bold: "TimesRomanBold" },
    sizes: { name: 20, section: 14, content: 12, small: 10 },
    colors: { text: { r: 0.1, g: 0.1, b: 0.1 }, heading: { r: 0.2, g: 0.2, b: 0.2 }, secondary: { r: 0.4, g: 0.4, b: 0.4 }, linkColor: { r: 0, g: 0, b: 1 } },
    spacing: { page: 15, section: 18, item: 10 },
  },
}

export const elegantATSTemplate: ResumeTemplate = {
  id: "ats-elegant",
  name: "ATS Elegant",
  description: "Clean Helvetica type with subtle accents for clarity",
  theme: {
    fontSize: { name: "text-4xl", section: "text-xl", content: "text-base", small: "text-sm" },
    colors: { primary: "text-indigo-700", secondary: "text-gray-500", text: "text-gray-900", accent: "text-indigo-600" },
    spacing: { section: "mb-9", item: "mb-5", content: "mb-3" },
    layout: { container: "max-w-4xl mx-auto bg-white shadow rounded-xl overflow-hidden", header: "bg-indigo-50 p-5", content: "p-7" },
  },
  pdfConfig: {
    fonts: { regular: "Helvetica", bold: "HelveticaBold" },
    sizes: { name: 22, section: 14, content: 12, small: 10 },
    colors: { text: { r: 0.12, g: 0.12, b: 0.12 }, heading: { r: 0.36, g: 0.2, b: 0.8 }, secondary: { r: 0.45, g: 0.45, b: 0.45 }, linkColor: { r: 0, g: 0, b: 1 } },
    spacing: { page: 16, section: 20, item: 10 },
  },
}

export const compactATSTemplate: ResumeTemplate = {
  id: "ats-compact",
  name: "ATS Compact",
  description: "Space-efficient layout for dense experience profiles",
  theme: {
    fontSize: { name: "text-2xl", section: "text-lg", content: "text-sm", small: "text-xs" },
    colors: { primary: "text-gray-800", secondary: "text-gray-500", text: "text-gray-900", accent: "text-gray-700" },
    spacing: { section: "mb-6", item: "mb-3", content: "mb-2" },
    layout: { container: "max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden", header: "border-b p-4", content: "p-6" },
  },
  pdfConfig: {
    fonts: { regular: "Helvetica", bold: "HelveticaBold" },
    sizes: { name: 18, section: 12, content: 10, small: 8 },
    colors: { text: { r: 0.1, g: 0.1, b: 0.1 }, heading: { r: 0.2, g: 0.2, b: 0.2 }, secondary: { r: 0.38, g: 0.38, b: 0.38 }, linkColor: { r: 0, g: 0, b: 1 } },
    spacing: { page: 14, section: 16, item: 8 },
  },
}

export const creativeATSTemplate: ResumeTemplate = {
  id: "ats-creative",
  name: "ATS Creative",
  description: "Subtle accent styling while keeping ATS compliance",
  theme: {
    fontSize: { name: "text-3xl", section: "text-xl", content: "text-base", small: "text-sm" },
    colors: { primary: "text-sky-700", secondary: "text-gray-500", text: "text-gray-900", accent: "text-sky-600" },
    spacing: { section: "mb-8", item: "mb-4", content: "mb-2" },
    layout: { container: "max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden", header: "border-b p-4", content: "p-6" },
  },
  pdfConfig: {
    fonts: { regular: "Helvetica", bold: "HelveticaBold" },
    sizes: { name: 20, section: 14, content: 12, small: 10 },
    colors: { text: { r: 0.1, g: 0.1, b: 0.1 }, heading: { r: 0.2, g: 0.5, b: 0.85 }, secondary: { r: 0.42, g: 0.42, b: 0.42 }, linkColor: { r: 0, g: 0, b: 1 } },
    spacing: { page: 16, section: 20, item: 10 },
  },
}

export const availableTemplates: ResumeTemplate[] = [
  googleTemplate,
 // modernTemplate,
  classicATSTemplate,
 // elegantATSTemplate,
 // compactATSTemplate,
  //creativeATSTemplate,
]

export function getTemplateById(id: string): ResumeTemplate | undefined {
  return availableTemplates.find((template) => template.id === id)
}
