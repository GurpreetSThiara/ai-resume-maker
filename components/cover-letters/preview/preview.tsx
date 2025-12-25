'use client';

import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { FileText, Download, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCoverLetterPDF, downloadCoverLetterDOCX } from '@/lib/export/cover-letter';
import {
  ClassicTemplate,
} from '@/components/cover-letters/templates';
import { CoverLetter } from '@/types/cover-letter';
import { coverLetterExample } from '@/lib/examples/cover-letter';
import { CoverLetterTemplateSwitch } from '@/components/cover-letters/cover-letter-template-switch';
import SplitHeaderTemplate from '../templates/split-header-template';
import { useState } from 'react';
import { A4Page } from '@/components/ui/a4-page';

import { TemplateLayout } from '@/lib/config/cover-letter-templates';

type Layout = TemplateLayout;

const templateMap: Record<Layout, React.ComponentType<{ coverLetter: CoverLetter; editable?: boolean }>> = {
  classic: ClassicTemplate,
  'split-header': SplitHeaderTemplate
};

import { getDefaultTemplate } from '@/lib/config/cover-letter-templates';

export function CoverLetterPreview({ editable = false }: { editable?: boolean }) {
  const { state } = useCoverLetter();
  const { coverLetter } = state;
  const [isEditing, setIsEditing] = useState(false);

  // Derived helpers
  const title: string | undefined = (coverLetter as any)?.title ?? "sample";
  const canExport = Boolean(title && title.trim().length > 0);


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
        <SelectedTemplate coverLetter={coverLetter} editable={isEditing} />
      </A4Page>
    </div>
  );
}
