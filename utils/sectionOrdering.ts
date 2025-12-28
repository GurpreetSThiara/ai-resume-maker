import { Section, CustomField, CustomFieldsSection, SECTION_TYPES } from '@/types/resume'

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
 * Creates a single Custom Fields section if there are any custom fields
 */
export const createCustomFieldsSection = (
  customFields: Record<string, CustomField>,
  startOrder: number = 0
): CustomFieldsSection | null => {
  const hasCustomFields = Object.keys(customFields).length > 0
  
  if (!hasCustomFields) {
    return null
  }
  
  return {
    id: 'custom-fields',
    title: 'Custom Fields',
    type: SECTION_TYPES.CUSTOM_FIELDS as any,
    order: startOrder,
    hidden: false
  }
}

/**
 * Combines regular sections with a single Custom Fields section for reordering
 */
export const getSectionsWithCustomFields = (
  sections: Section[], 
  customFields: Record<string, CustomField>
): Section[] => {
  // Check if custom fields section already exists
  const existingIndex = sections.findIndex(s => s.id === 'custom-fields')
  
  // Create or update custom fields section
  const customFieldsSection = createCustomFieldsSection(
    customFields,
    existingIndex >= 0 ? sections[existingIndex].order : sections.length
  )
  
  if (!customFieldsSection) {
    // No custom fields, remove existing custom fields section if present
    return sections.filter(s => s.id !== 'custom-fields')
  }
  
  if (existingIndex >= 0) {
    // Update existing section order if needed
    const updatedSections = [...sections]
    updatedSections[existingIndex] = {
      ...updatedSections[existingIndex],
      ...customFieldsSection
    }
    return updatedSections
  }
  
  // Add custom fields section to the end
  return [...sections, customFieldsSection]
}

/**
 * Separates sections and removes the custom fields section
 * Custom fields themselves are not modified, only the section position
 */
export const separateSectionsAndCustomFields = (
  combinedSections: Section[],
  originalCustomFields: Record<string, CustomField>
): {
  sections: Section[]
  customFields: Record<string, CustomField>
} => {
  // Filter out the custom fields section, keep all other sections
  const sections = combinedSections.filter(s => s.id !== 'custom-fields')
  
  // Custom fields themselves don't need order updates since they're grouped
  return { sections, customFields: originalCustomFields }
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
 * Preserves existing order values
 */
export const initializeSectionOrder = (sections: Section[]): Section[] => {
  return sections.map((section, index) => ({
    ...section,
    order: section.order !== undefined ? section.order : index
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
    projects: 'Projects',
    certifications: 'Certifications',
    custom: 'Custom Section',
    'custom-fields': 'Custom Fields'
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
    projects: '📦',
    certifications: '🏆',
    custom: '📝',
    'custom-fields': '🔗'
  }
  return iconMap[type] || '📄'
}

/**
 * Gets sections with custom fields for rendering
 * This includes the custom-fields section at its correct order position
 * The custom-fields section order is determined by checking if it exists in sections,
 * or defaults to the end (sections.length)
 */
export const getSectionsForRendering = (
  sections: Section[],
  customFields: Record<string, CustomField>
): Section[] => {
  // First, ensure all sections have an order
  const sectionsWithOrder = initializeSectionOrder(sections)
  
  const hasCustomFields = Object.keys(customFields).length > 0
  if (!hasCustomFields) {
    return sortSectionsByOrder(sectionsWithOrder)
  }

  // Check if custom-fields section already exists in sections (from previous reordering)
  const existingCustomFieldsSection = sectionsWithOrder.find(s => s.id === 'custom-fields')
  
  // Determine the order for custom fields section
  // If it exists, use its order. Otherwise, use the max order + 1 (to place at end)
  const maxOrder = sectionsWithOrder.length > 0 
    ? Math.max(...sectionsWithOrder.map(s => s.order ?? 0), sectionsWithOrder.length - 1)
    : 0
  
  // Create custom fields section with its order
  const customFieldsSection = createCustomFieldsSection(
    customFields,
    existingCustomFieldsSection?.order ?? (maxOrder + 1)
  )

  if (!customFieldsSection) {
    return sortSectionsByOrder(sectionsWithOrder)
  }

  // Combine sections (filtering out any existing custom-fields section) with the new one
  const sectionsWithoutCustomFields = sectionsWithOrder.filter(s => s.id !== 'custom-fields')
  const allSections = [...sectionsWithoutCustomFields, customFieldsSection]
  
  return sortSectionsByOrder(allSections)
}
