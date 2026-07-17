// Cover letter template configuration
//
// Each template carries a `style` config that drives the shared PDF/DOCX
// generators (lib/pdf-generators/cover-letter-config-generator.ts and
// lib/docx-generators/cover-letter-config-docx.ts), so adding a template
// here is enough to get export support — no per-template generator needed.

export type TemplateFont = 'helvetica' | 'times';

export type TemplateHeaderLayout =
  | 'left' // name + contact stacked left (classic block)
  | 'centered' // name + contact centered (letterhead style)
  | 'banner' // full-width filled banner with light text
  | 'accent-bar' // vertical accent bar on the left edge
  | 'sidebar' // colored left column holding contact info
  | 'split'; // name left, contact right

export interface TemplateStyle {
  font: TemplateFont;
  headerLayout: TemplateHeaderLayout;
  /** Accent color as hex without '#', used by DOCX + UI */
  accentHex: string;
  /** Accent color as 0-1 RGB, used by pdf-lib */
  accentRgb: { r: number; g: number; b: number };
  /** Render the applicant name in uppercase */
  nameUppercase?: boolean;
  /** Horizontal rule below the header */
  rule?: 'none' | 'single' | 'double';
  /** Show a circular monogram with the applicant's initials */
  monogram?: boolean;
  /** Tighter spacing for one-page-dense letters */
  compact?: boolean;
}

export interface CoverLetterTemplateConfig {
  value: string;
  label: string;
  name: string;
  description: string;
  style: TemplateStyle;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
  };
}

function style(
  font: TemplateFont,
  headerLayout: TemplateHeaderLayout,
  accentHex: string,
  extra: Partial<TemplateStyle> = {}
): TemplateStyle {
  return { font, headerLayout, accentHex, accentRgb: hexToRgb(accentHex), rule: 'none', ...extra };
}

export const COVER_LETTER_TEMPLATES = {
  classic: {
    value: 'classic' as const,
    label: 'Classic',
    name: 'Classic Template',
    description: 'Traditional professional cover letter layout',
    style: style('helvetica', 'left', '111827'),
  },
  'split-header': {
    value: 'split-header' as const,
    label: 'Split Header',
    name: 'Split Header Template',
    description: 'Modern layout with split header design',
    style: style('helvetica', 'split', '111827'),
  },
  executive: {
    value: 'executive' as const,
    label: 'Executive',
    name: 'Executive Template',
    description: 'Formal serif layout with a centered header and double rule — suited to senior roles',
    style: style('times', 'centered', '1e3a5f', { nameUppercase: true, rule: 'double' }),
  },
  'modern-accent': {
    value: 'modern-accent' as const,
    label: 'Modern Accent',
    name: 'Modern Accent Template',
    description: 'Clean sans-serif design with a bold teal accent bar down the left edge',
    style: style('helvetica', 'accent-bar', '0d9488'),
  },
  banner: {
    value: 'banner' as const,
    label: 'Banner',
    name: 'Banner Template',
    description: 'Striking full-width dark header banner with light text',
    style: style('helvetica', 'banner', '334155'),
  },
  sidebar: {
    value: 'sidebar' as const,
    label: 'Sidebar',
    name: 'Sidebar Template',
    description: 'Two-column layout with contact details in a colored left sidebar',
    style: style('helvetica', 'sidebar', '1e40af'),
  },
  monogram: {
    value: 'monogram' as const,
    label: 'Monogram',
    name: 'Monogram Template',
    description: 'Centered layout crowned by a circular initials monogram',
    style: style('helvetica', 'centered', '9f1239', { monogram: true, rule: 'single' }),
  },
  minimal: {
    value: 'minimal' as const,
    label: 'Minimal',
    name: 'Minimal Template',
    description: 'Understated grayscale design with generous whitespace',
    style: style('helvetica', 'left', '525252', { rule: 'single' }),
  },
  'bold-header': {
    value: 'bold-header' as const,
    label: 'Bold Header',
    name: 'Bold Header Template',
    description: 'Oversized name typography with a warm orange accent',
    style: style('helvetica', 'left', 'ea580c'),
  },
  corporate: {
    value: 'corporate' as const,
    label: 'Corporate',
    name: 'Corporate Template',
    description: 'Traditional serif letter with corporate blue accents',
    style: style('times', 'left', '1d4ed8', { rule: 'single' }),
  },
  compact: {
    value: 'compact' as const,
    label: 'Compact',
    name: 'Compact Template',
    description: 'Space-efficient ATS-friendly layout that fits more on one page',
    style: style('helvetica', 'left', '15803d', { compact: true }),
  },
  letterhead: {
    value: 'letterhead' as const,
    label: 'Letterhead',
    name: 'Letterhead Template',
    description: 'Classic stationery look with a centered letterhead and rule lines',
    style: style('times', 'centered', '111827', { rule: 'single' }),
  },
} as const;

// Array of template options for dropdowns / galleries
export const TEMPLATE_OPTIONS = Object.values(COVER_LETTER_TEMPLATES);

// Template value type
export type TemplateLayout = typeof COVER_LETTER_TEMPLATES[keyof typeof COVER_LETTER_TEMPLATES]['value'];

// Helper functions
export function getTemplateConfig(value: string) {
  return Object.values(COVER_LETTER_TEMPLATES).find(template => template.value === value);
}

export function getTemplateStyle(value: string): TemplateStyle {
  return getTemplateConfig(value)?.style ?? COVER_LETTER_TEMPLATES.classic.style;
}

export function getDefaultTemplate() {
  return COVER_LETTER_TEMPLATES.classic;
}

export function isValidTemplate(value: string): value is TemplateLayout {
  return Object.values(COVER_LETTER_TEMPLATES).some(template => template.value === value);
}
