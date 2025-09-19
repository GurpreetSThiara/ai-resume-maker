'use client';

import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCoverLetterPDF, downloadCoverLetterDOCX } from '@/lib/export/cover-letter';
import {
  ClassicTemplate,
  ModernMinimalTemplate,
  ElegantTemplate,
  CreativeTemplate,
  MinimalistTemplate,
} from '@/components/cover-letters/templates';
import { CoverLetter } from '@/types/cover-letter';
import { coverLetterExample } from '@/lib/examples/cover-letter';
import { CoverLetterTemplateSwitch } from '@/components/cover-letters/cover-letter-template-switch';
import { ProfessionalStandardTemplate } from '../templates/professional-standard';

type Layout = 'traditional' | 'modern' | 'creative' | 'minimalist' |'professional';

const templateMap: Record<Layout, React.ComponentType<{ coverLetter: CoverLetter }>> = {
  traditional: ClassicTemplate,
  modern: ModernMinimalTemplate,
  creative: CreativeTemplate,
  minimalist: MinimalistTemplate,
  professional:ProfessionalStandardTemplate
};

export function CoverLetterPreview() {
  const { state } = useCoverLetter();
  const { coverLetter } = state;

  // Derived helpers
  const title: string | undefined = (coverLetter as any)?.title ?? "sample";
  const canExport = Boolean(title && title.trim().length > 0);

  const handleDownloadPDF = async () => {
    if (!canExport) return;
    try {
      await downloadCoverLetterPDF({coverLetter: coverLetter, templateName: coverLetter?.formatting?.layout || 'traditional' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!canExport) return;
    try {
      await downloadCoverLetterDOCX({coverLetter: coverLetter, templateName: coverLetter?.formatting?.layout || 'traditional' });
    } catch (e) {
      console.error(e);
    }
  };

  if (!coverLetter) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No preview available</div>
      </div>
    );
  }

  const layout = coverLetter.formatting?.layout ?? 'traditional';
  const SelectedTemplate = templateMap[layout] || ClassicTemplate;

  return (
    <div className="flex flex-col gap-4">
     
      <div className="flex items-center gap-2 self-end">
         <div className="self-end mb-2">
        <CoverLetterTemplateSwitch />
      </div>
        <Button variant="outline" disabled={!canExport} onClick={handleDownloadPDF}>
          <FileText className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Button variant="outline" disabled={!canExport} onClick={handleDownloadDOCX}>
          <Download className="mr-2 h-4 w-4" /> Download DOCX
        </Button>
      </div>
      <SelectedTemplate coverLetter={coverLetter} />
    </div>
  );
}
