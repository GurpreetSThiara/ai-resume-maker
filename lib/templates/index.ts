import type { ResumeTemplate } from "@/types/resume"

export const googleTemplate: ResumeTemplate = {
  id: "classic-blue",
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

export const ATS_GREEN: ResumeTemplate = {
  id: "ats-green",
  name: "ATS Green",
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

export const ATS_YELLOW: ResumeTemplate = {
  id: "ats-yellow",
  name: "ATS Yellow",
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

export const atsCompactLinesTemplate: ResumeTemplate = {
  id: "ats-compact-lines",
  name: "ATS Compact Lines",
  description: "A compact ATS-friendly resume template with black lines and titles for maximum content density.",
  theme: {
    fontSize: {
      name: "text-3xl",
      section: "text-xl",
      content: "text-base",
      small: "text-sm",
    },
    colors: {
      primary: "text-black",
      secondary: "text-gray-600",
      text: "text-gray-800",
      accent: "text-black",
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
      heading: { r: 0, g: 0, b: 0 },
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

export const ATS_TIMELINE: ResumeTemplate = {
  id: "ats-timeline",
  name: "Timeline",
  description: "Modern single-column layout with visual timeline for experience and education",
  theme: {
    fontSize: { name: "text-3xl", section: "text-xl", content: "text-base", small: "text-sm" },
    colors: { primary: "text-gray-800", secondary: "text-gray-500", text: "text-gray-900", accent: "text-blue-500" },
    spacing: { section: "mb-8", item: "mb-4", content: "mb-2" },
    layout: { container: "max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden", header: "border-b p-4", content: "p-6" },
  },
  pdfConfig: {
    fonts: { regular: "Arial", bold: "ArialBold" },
    sizes: { name: 28, section: 14, content: 12, small: 11 },
    colors: { text: { r: 0.176, g: 0.216, b: 0.282 }, heading: { r: 0.102, g: 0.125, b: 0.173 }, secondary: { r: 0.29, g: 0.333, b: 0.408 }, linkColor: { r: 0.259, g: 0.6, b: 0.882 } },
    spacing: { page: 15, section: 18, item: 12 },
  },
}






export const availableTemplates: ResumeTemplate[] = [
  googleTemplate,
 // modernTemplate,
  classicATSTemplate,
  ATS_GREEN,
  ATS_YELLOW,
  ATS_TIMELINE,
  atsCompactLinesTemplate
 // elegantATSTemplate,
 // compactATSTemplate,
  //creativeATSTemplate,
]

export function getTemplateById(id: string): ResumeTemplate | undefined {
  return availableTemplates.find((template) => template.id === id)
}
