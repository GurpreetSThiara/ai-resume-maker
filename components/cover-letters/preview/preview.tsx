'use client';

import { useCoverLetter } from '@/contexts/CoverLetterContext';
import {
  ClassicTemplate,
  ModernTemplate,
  ElegantTemplate,
  CreativeTemplate,
  MinimalistTemplate,
} from '@/components/cover-letters/templates';
import { CoverLetter } from '@/types/cover-letter';

type Layout = 'traditional' | 'modern' | 'creative' | 'minimalist';

const templateMap: Record<Layout, React.ComponentType<{ coverLetter: CoverLetter }>> = {
  traditional: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  minimalist: MinimalistTemplate,
};

export function CoverLetterPreview() {
  const { state } = useCoverLetter();
  const { coverLetter } = state;

  if (!coverLetter) {
    return <div className="p-8">Loading preview...</div>;
  }

  const layout = coverLetter.formatting?.layout ?? 'traditional';
  const SelectedTemplate = templateMap[layout] || ClassicTemplate;

  return <SelectedTemplate coverLetter={coverLetter} />;
}
