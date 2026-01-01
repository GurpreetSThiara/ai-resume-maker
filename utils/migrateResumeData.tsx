import { ResumeData, CustomField } from "@/types/resume"

/**
 * Migrates legacy resume data to new separated structure
 * - Splits custom fields into additionalLinks and personalData
 * - Maintains backward compatibility
 * - Preserves original data structure
 */
export function migrateResumeData(data: any): ResumeData {
  // If data already has new structure, return as-is
  if (data.additionalLinks || data.personalData) {
    return data as ResumeData
  }

  // Initialize new separated fields
  const additionalLinks: Record<string, CustomField> = {}
  const personalData: Record<string, CustomField> = {}

  // Migrate existing custom fields
  if (data.custom && typeof data.custom === 'object') {
    Object.entries(data.custom).forEach(([key, field]: [string, any]) => {
      // Validate field structure
      if (field && typeof field === 'object' && typeof field.link === 'boolean') {
        if (field.link) {
          additionalLinks[key] = field
        } else {
          personalData[key] = field
        }
      }
    })
  }

  // Return migrated data with new structure
  return {
    ...data,
    additionalLinks,
    personalData,
    // Keep original custom field for backward compatibility
    custom: data.custom || {}
  }
}

/**
 * Checks if resume data needs migration
 */
export function needsMigration(data: any): boolean {
  return !!(data.custom && !data.additionalLinks && !data.personalData)
}

/**
 * Gets the effective custom fields for rendering
 * - Prioritizes new separated structure
 * - Falls back to legacy structure if migration hasn't occurred
 */
export function getEffectiveCustomFields(data: ResumeData): {
  additionalLinks: Record<string, CustomField>
  personalData: Record<string, CustomField>
} {
  // If new structure exists, use it
  if (data.additionalLinks || data.personalData) {
    return {
      additionalLinks: data.additionalLinks || {},
      personalData: data.personalData || {}
    }
  }

  // Fall back to legacy structure
  const additionalLinks: Record<string, CustomField> = {}
  const personalData: Record<string, CustomField> = {}

  if (data.custom) {
    Object.entries(data.custom).forEach(([key, field]) => {
      if (field.link) {
        additionalLinks[key] = field
      } else {
        personalData[key] = field
      }
    })
  }

  return { additionalLinks, personalData }
}

/**
 * Updates custom fields in the correct structure
 * - Works with both legacy and new structures
 * - Maintains consistency
 */
export function updateCustomFields(
  data: ResumeData,
  type: 'additionalLinks' | 'personalData' | 'legacy',
  fieldId: string,
  fieldData: CustomField
): ResumeData {
  // If new structure exists, update it
  if (data.additionalLinks || data.personalData) {
    const updatedData = { ...data }
    
    if (type === 'additionalLinks') {
      updatedData.additionalLinks = {
        ...data.additionalLinks,
        [fieldId]: fieldData
      }
    } else if (type === 'personalData') {
      updatedData.personalData = {
        ...data.personalData,
        [fieldId]: fieldData
      }
    }
    
    // Also update legacy custom for compatibility
    updatedData.custom = {
      ...data.custom,
      [fieldId]: fieldData
    }
    
    return updatedData
  }

  // Fall back to legacy structure
  return {
    ...data,
    custom: {
      ...data.custom,
      [fieldId]: fieldData
    }
  }
}

/**
 * Removes custom fields from the correct structure
 */
export function removeCustomField(
  data: ResumeData,
  fieldId: string
): ResumeData {
  const updatedData = { ...data }
  
  // Remove from new structure if it exists
  if (updatedData.additionalLinks) {
    const { [fieldId]: removed, ...rest } = updatedData.additionalLinks
    updatedData.additionalLinks = rest
  }
  
  if (updatedData.personalData) {
    const { [fieldId]: removed, ...rest } = updatedData.personalData
    updatedData.personalData = rest
  }
  
  // Always remove from legacy custom
  if (updatedData.custom) {
    const { [fieldId]: removed, ...rest } = updatedData.custom
    updatedData.custom = rest
  }
  
  return updatedData
}
