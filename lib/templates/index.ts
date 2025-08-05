import type { ResumeTemplate } from "@/types/resume"

export const googleTemplate: ResumeTemplate = {
  id: "google",
  name: "Google Style",
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

export const availableTemplates: ResumeTemplate[] = [googleTemplate, modernTemplate]

export function getTemplateById(id: string): ResumeTemplate | undefined {
  return availableTemplates.find((template) => template.id === id)
}
