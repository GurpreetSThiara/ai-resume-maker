'use client';

import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { TEMPLATE_OPTIONS, getDefaultTemplate, isValidTemplate } from '@/lib/config/cover-letter-templates';
import { useRouter, useSearchParams } from 'next/navigation';

export function CoverLetterTemplateSwitch() {
  const { state, updateCoverLetter } = useCoverLetter();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLayout = state.coverLetter.formatting?.layout || getDefaultTemplate().value;
  
  // Fallback to classic if current layout is not valid
  const layout = isValidTemplate(currentLayout) ? currentLayout : getDefaultTemplate().value;
  
  // Update URL when template changes
  const updateUrlWithTemplate = (templateValue: string) => {
    console.log('Updating URL with template:', templateValue);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('template', templateValue);
      const newUrl = `?${params.toString()}`;
      console.log('New URL:', newUrl);
      router.push(newUrl, { scroll: false });
    } catch (error) {
      console.error('Error updating URL:', error);
      // Fallback: update window location directly
      const url = new URL(window.location.href);
      url.searchParams.set('template', templateValue);
      window.history.replaceState({}, '', url.toString());
    }
  };
  
  // Read template from URL on mount and when search params change
  useEffect(() => {
    const urlTemplate = searchParams.get('template');
    console.log('URL template from params:', urlTemplate, 'Current layout:', currentLayout);
    
    if (urlTemplate && isValidTemplate(urlTemplate)) {
      if (urlTemplate !== currentLayout) {
        console.log('Updating layout from URL:', urlTemplate);
        updateCoverLetter({
          formatting: {
            ...state.coverLetter.formatting,
            layout: urlTemplate,
          },
        });
      }
    } else if (urlTemplate && !isValidTemplate(urlTemplate)) {
      // Invalid template in URL, redirect to default
      console.log('Invalid template in URL, redirecting to default:', urlTemplate);
      updateUrlWithTemplate(getDefaultTemplate().value);
    }
  }, [searchParams]);
  
  // Auto-migrate invalid layouts to classic
  useEffect(() => {
    if (!isValidTemplate(currentLayout)) {
      console.log('Migrating invalid layout to classic:', currentLayout);
      updateCoverLetter({
        formatting: {
          ...state.coverLetter.formatting,
          layout: getDefaultTemplate().value,
        },
      });
      updateUrlWithTemplate(getDefaultTemplate().value);
    }
  }, [currentLayout, state.coverLetter.formatting, updateCoverLetter]);
  
  console.log('CoverLetterTemplateSwitch render:', { currentLayout, layout, state: state.coverLetter.formatting });
  console.log('TEMPLATE_OPTIONS:', TEMPLATE_OPTIONS);

  const handleChange = (value: typeof TEMPLATE_OPTIONS[number]['value']) => {
    console.log('Template switch change called with:', value);
    console.log('Current layout before change:', currentLayout);
    updateCoverLetter({
      formatting: {
        ...state.coverLetter.formatting,
        layout: value,
      },
    });
    console.log('Calling updateUrlWithTemplate with:', value);
    updateUrlWithTemplate(value);
  };

  return (
    <div className="flex flex-col min-w-[140px] sm:min-w-[180px] border rounded-sm border-primary">
      <Select value={layout} onValueChange={handleChange}>
        <SelectTrigger className="w-full mobile-input">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="mobile-button">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
