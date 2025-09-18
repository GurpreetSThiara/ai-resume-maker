'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TemplateSelector } from '@/components/cover-letters/template-selector/template-selector';

export default function CoverLetterPage() {
  const router = useRouter();

  const handleTemplateSelect = (templateId: string) => {
    // In a real implementation, you would create a new cover letter with this template
    // and then navigate to the editor
    // The new editor page handles creation. Template selection can be a feature later.
    router.push(`/cover-letter/editor/new`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col  items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create a New Cover Letter</h1>
          {/* <p className="text-muted-foreground">Choose a template to get started</p> */}
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/cover-letter/editor/new')}
        >
          Start from Scratch
        </Button>
      </div>

      {/* <TemplateSelector onSelect={handleTemplateSelect} /> */}
    </div>
  );
}
