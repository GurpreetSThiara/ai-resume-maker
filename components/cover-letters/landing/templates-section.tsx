'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TemplateThumbnail } from '@/components/cover-letters/template-gallery';
import { TEMPLATE_OPTIONS, TemplateLayout } from '@/lib/config/cover-letter-templates';
import { CoverLetterProvider } from '@/contexts/CoverLetterContext';
import { coverLetterExample } from '@/lib/examples/cover-letter';

export function TemplatesSection() {
  const handleTemplateSelect = (templateId: string) => {
    window.open(`/cover-letter/editor/new?template=${templateId}`, '_blank');
  };

  return (
    <section id="templates" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {TEMPLATE_OPTIONS.length} Professional Cover Letter Templates
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose from our collection of ATS-optimized templates designed for every industry
          </p>
        </div>

        {/* Own provider so thumbnails preview a fully written example letter */}
        <CoverLetterProvider initialCoverLetter={coverLetterExample}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {TEMPLATE_OPTIONS.map((template) => (
            <Card
              key={template.value}
              className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-xl py-0 gap-0"
              onClick={() => handleTemplateSelect(template.value)}
            >
              <div className="bg-linear-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                <TemplateThumbnail
                  layout={template.value as TemplateLayout}
                  className="group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: `#${template.style.accentHex}` }}
                  />
                  {template.label}
                </CardTitle>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template.value);
                  }}
                >
                  Use This Template
                </Button>
              </CardContent>
              </Card>
            ))}
          </div>
        </CoverLetterProvider>
      </div>
    </section>
  );
}
