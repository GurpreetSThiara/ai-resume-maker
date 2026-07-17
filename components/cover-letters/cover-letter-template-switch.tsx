'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';
import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { Button } from '@/components/ui/button';
import { TemplateGalleryDialog } from '@/components/cover-letters/template-gallery';
import {
  TemplateLayout,
  getDefaultTemplate,
  getTemplateConfig,
  isValidTemplate,
} from '@/lib/config/cover-letter-templates';

export function CoverLetterTemplateSwitch() {
  const { state, updateCoverLetter } = useCoverLetter();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [galleryOpen, setGalleryOpen] = useState(false);

  const currentLayout = state.coverLetter.formatting?.layout || getDefaultTemplate().value;
  const layout = isValidTemplate(currentLayout) ? currentLayout : getDefaultTemplate().value;
  const config = getTemplateConfig(layout) ?? getDefaultTemplate();

  const updateUrlWithTemplate = (templateValue: string) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('template', templateValue);
      router.push(`?${params.toString()}`, { scroll: false });
    } catch {
      const url = new URL(window.location.href);
      url.searchParams.set('template', templateValue);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const applyTemplate = (value: TemplateLayout) => {
    updateCoverLetter({
      formatting: { ...state.coverLetter.formatting, layout: value },
    });
    updateUrlWithTemplate(value);
    setGalleryOpen(false);
  };

  // Keep state in sync with the ?template= URL parameter
  useEffect(() => {
    const urlTemplate = searchParams.get('template');
    if (urlTemplate && isValidTemplate(urlTemplate)) {
      if (urlTemplate !== currentLayout) {
        updateCoverLetter({
          formatting: { ...state.coverLetter.formatting, layout: urlTemplate },
        });
      }
    } else if (urlTemplate && !isValidTemplate(urlTemplate)) {
      updateUrlWithTemplate(getDefaultTemplate().value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Migrate letters saved with a layout that no longer exists
  useEffect(() => {
    if (!isValidTemplate(currentLayout)) {
      updateCoverLetter({
        formatting: { ...state.coverLetter.formatting, layout: getDefaultTemplate().value },
      });
      updateUrlWithTemplate(getDefaultTemplate().value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLayout]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setGalleryOpen(true)}
        className="flex items-center gap-2 mobile-button btn-mobile"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Template:</span>
        <span className="font-semibold">{config.label}</span>
      </Button>
      <TemplateGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        selected={layout}
        onSelect={applyTemplate}
      />
    </>
  );
}
