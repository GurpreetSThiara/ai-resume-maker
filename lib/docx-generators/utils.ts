import { ExternalHyperlink, TextRun } from 'docx';
import { SECTION_TYPES } from '@/types/resume';

export const normalizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export const createLink = (text: string, url: string, size: number, color: string = "0000FF") => {
  return new ExternalHyperlink({
    children: [
      new TextRun({
        text,
        size,
        color,
      }),
    ],
    link: normalizeUrl(url),
  });
};

export const hasSectionContent = (section: any): boolean => {
  if (!section || section.hidden) return false;
  if (section.type === 'custom-fields') {
      return true; // We handle custom-fields visibility inside the generator by checking entries
  }
  if ('items' in section && Array.isArray(section.items)) {
    if ([SECTION_TYPES.EDUCATION, SECTION_TYPES.EXPERIENCE, SECTION_TYPES.PROJECTS].includes(section.type as any)) {
      return section.items.length > 0;
    } else if ([SECTION_TYPES.SKILLS, SECTION_TYPES.LANGUAGES, SECTION_TYPES.CERTIFICATIONS].includes(section.type as any)) {
      return section.items.filter((s: string) => s && s.trim()).length > 0;
    }
  } else if ('content' in section && Array.isArray(section.content)) {
    return section.content.some((t: string) => t && t.trim() !== '');
  }
  return false;
};
