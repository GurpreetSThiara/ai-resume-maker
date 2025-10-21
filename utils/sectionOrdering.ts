import { Section } from '@/types/resume'

/**
 * Reorders sections array by moving an item from one index to another
 */
export const reorderSections = (
  sections: Section[],
  fromIndex: number,
  toIndex: number
): Section[] => {
  const result = Array.from(sections)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  
  // Update order field to match new positions
  return result.map((section, index) => ({
    ...section,
    order: index
  }))
}

/**
 * Sorts sections by their order field, with fallback to original array order
 */
export const sortSectionsByOrder = (sections: Section[]): Section[] => {
  return [...sections].sort((a, b) => {
    const orderA = a.order ?? sections.indexOf(a)
    const orderB = b.order ?? sections.indexOf(b)
    return orderA - orderB
  })
}

/**
 * Initializes order field for sections that don't have it
 */
export const initializeSectionOrder = (sections: Section[]): Section[] => {
  return sections.map((section, index) => ({
    ...section,
    order: section.order ?? index
  }))
}

/**
 * Moves a section up in the order
 */
export const moveSectionUp = (sections: Section[], sectionId: string): Section[] => {
  const currentIndex = sections.findIndex(s => s.id === sectionId)
  if (currentIndex <= 0) return sections
  
  return reorderSections(sections, currentIndex, currentIndex - 1)
}

/**
 * Moves a section down in the order
 */
export const moveSectionDown = (sections: Section[], sectionId: string): Section[] => {
  const currentIndex = sections.findIndex(s => s.id === sectionId)
  if (currentIndex < 0 || currentIndex >= sections.length - 1) return sections
  
  return reorderSections(sections, currentIndex, currentIndex + 1)
}

/**
 * Gets section type display name
 */
export const getSectionTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    education: 'Education',
    experience: 'Experience',
    skills: 'Skills',
    languages: 'Languages',
    certifications: 'Certifications',
    custom: 'Custom'
  }
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

/**
 * Gets section type icon
 */
export const getSectionTypeIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    education: '🎓',
    experience: '💼',
    skills: '🛠️',
    languages: '🌐',
    certifications: '🏆',
    custom: '📝'
  }
  return iconMap[type] || '📄'
}
