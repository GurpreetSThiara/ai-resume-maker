'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { COVER_LETTER_TEMPLATES } from '@/lib/templates/cover-letters';

type TemplateSelectorProps = {
  onSelect?: (templateId: string) => void;
};

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (onSelect) {
      onSelect(templateId);
    }
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      // In a real implementation, you would create a new cover letter with this template
      // and then navigate to the editor
      router.push(`/cover-letter/editor/new?template=${selectedTemplate}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose a Template</h2>
        <p className="text-muted-foreground">Select a template to get started with your cover letter</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COVER_LETTER_TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={() => handleSelect(template.id)}
          >
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="h-40 bg-muted/20 rounded-md flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-2">✉️</div>
                <div>{template.name} Preview</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={!selectedTemplate}
        >
          Continue with Selected Template
        </Button>
      </div>
    </div>
  );
}
