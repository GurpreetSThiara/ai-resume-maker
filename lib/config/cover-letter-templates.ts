// Cover letter template configuration
export const COVER_LETTER_TEMPLATES = {
  classic: {
    value: 'classic' as const,
    label: 'Classic',
    name: 'Classic Template',
    description: 'Traditional professional cover letter layout',
  },
  'split-header': {
    value: 'split-header' as const,
    label: 'Split Header',
    name: 'Split Header Template',
    description: 'Modern layout with split header design',
  },
} as const;

// Array of template options for dropdowns
export const TEMPLATE_OPTIONS = Object.values(COVER_LETTER_TEMPLATES);

// Template value type
export type TemplateLayout = typeof COVER_LETTER_TEMPLATES[keyof typeof COVER_LETTER_TEMPLATES]['value'];

// Helper functions
export function getTemplateConfig(value: string) {
  return Object.values(COVER_LETTER_TEMPLATES).find(template => template.value === value);
}

export function getDefaultTemplate() {
  return COVER_LETTER_TEMPLATES.classic;
}

export function isValidTemplate(value: string): value is TemplateLayout {
  return Object.values(COVER_LETTER_TEMPLATES).some(template => template.value === value);
}
