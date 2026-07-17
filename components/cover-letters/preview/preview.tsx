'use client';

import { useCoverLetter } from '@/contexts/CoverLetterContext';
import {
  ClassicTemplate,
  SplitHeaderTemplate,
  ExecutiveTemplate,
  ModernAccentTemplate,
  BannerTemplate,
  SidebarTemplate,
  MonogramTemplate,
  MinimalTemplate,
  BoldHeaderTemplate,
  CorporateTemplate,
  CompactTemplate,
  LetterheadTemplate,
} from '@/components/cover-letters/templates';
import { CoverLetter } from '@/types/cover-letter';
import { A4Page } from '@/components/ui/a4-page';
import { TemplateLayout, getDefaultTemplate } from '@/lib/config/cover-letter-templates';

export const templateMap: Record<
  TemplateLayout,
  React.ComponentType<{ coverLetter: CoverLetter; editable?: boolean }>
> = {
  classic: ClassicTemplate,
  'split-header': SplitHeaderTemplate,
  executive: ExecutiveTemplate,
  'modern-accent': ModernAccentTemplate,
  banner: BannerTemplate,
  sidebar: SidebarTemplate,
  monogram: MonogramTemplate,
  minimal: MinimalTemplate,
  'bold-header': BoldHeaderTemplate,
  corporate: CorporateTemplate,
  compact: CompactTemplate,
  letterhead: LetterheadTemplate,
};

export function CoverLetterPreview({ editable = false }: { editable?: boolean }) {
  const { state } = useCoverLetter();
  const { coverLetter } = state;

  if (!coverLetter) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No preview available</div>
      </div>
    );
  }

  const layout = coverLetter.formatting?.layout ?? getDefaultTemplate().value;
  const SelectedTemplate = templateMap[layout] || ClassicTemplate;

  return (
    <div className="flex flex-col gap-4">
      <A4Page withOuterWrapper>
        <SelectedTemplate coverLetter={coverLetter} editable={editable} />
      </A4Page>
    </div>
  );
}
