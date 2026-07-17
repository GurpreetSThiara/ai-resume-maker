'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { templateMap } from '@/components/cover-letters/preview/preview';
import { ClassicTemplate } from '@/components/cover-letters/templates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TEMPLATE_OPTIONS,
  TemplateLayout,
  type CoverLetterTemplateConfig,
} from '@/lib/config/cover-letter-templates';
import { cn } from '@/lib/utils';

// A4 canvas dimensions used by A4Page (~96 DPI)
const A4_W = 794;
const A4_H = 1123;

/**
 * Live, non-interactive miniature of a cover letter template rendered with
 * the current letter data and scaled to fit its container width.
 */
export function TemplateThumbnail({
  layout,
  className,
}: {
  layout: TemplateLayout;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const { state } = useCoverLetter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / A4_W);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Template = templateMap[layout] ?? ClassicTemplate;

  return (
    <div
      ref={ref}
      className={cn('relative w-full overflow-hidden bg-white', className)}
      style={{ aspectRatio: `${A4_W} / ${A4_H}` }}
      aria-hidden
    >
      {scale > 0 && (
        <div
          className="pointer-events-none select-none absolute top-0 left-0 origin-top-left"
          style={{ transform: `scale(${scale})`, width: A4_W, height: A4_H }}
        >
          <Template coverLetter={state.coverLetter} />
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: CoverLetterTemplateConfig;
  selected: boolean;
  onSelect: (value: TemplateLayout) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.value as TemplateLayout)}
      className={cn(
        'group relative flex flex-col rounded-lg border-2 bg-white text-left overflow-hidden transition-all',
        'hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
      )}
      aria-pressed={selected}
    >
      <TemplateThumbnail layout={template.value as TemplateLayout} className="border-b" />
      {selected && (
        <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
          <Check className="h-4 w-4" />
        </span>
      )}
      <div className="flex items-center gap-2 p-3">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: `#${template.style.accentHex}` }}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{template.label}</p>
          <p className="text-xs text-muted-foreground truncate">{template.description}</p>
        </div>
      </div>
    </button>
  );
}

/** Grid of all registered templates with live previews. */
export function TemplateGalleryGrid({
  selected,
  onSelect,
  className,
}: {
  selected: TemplateLayout;
  onSelect: (value: TemplateLayout) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {TEMPLATE_OPTIONS.map((template) => (
        <TemplateCard
          key={template.value}
          template={template}
          selected={template.value === selected}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/** Modal template picker used from the editor toolbar. */
export function TemplateGalleryDialog({
  open,
  onOpenChange,
  selected,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: TemplateLayout;
  onSelect: (value: TemplateLayout) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Previews use your letter content — pick a design and keep editing.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-1 -mr-1">
          <TemplateGalleryGrid selected={selected} onSelect={onSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
