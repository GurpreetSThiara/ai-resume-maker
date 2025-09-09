'use client';

import { use, useEffect, useState } from 'react';
import { CoverLetterEditor } from '@/components/cover-letters/editor/editor';
import { CoverLetterPreview } from '@/components/cover-letters/preview/preview';
import { CoverLetterProvider } from '@/contexts/CoverLetterContext';
import { CoverLetter } from '@/types/cover-letter';
import { Loader2 } from 'lucide-react';

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default function CoverLetterEditorPage({ params }: EditorPageProps) {
  const { id } = params;
  const [initialCoverLetter, setInitialCoverLetter] = useState<CoverLetter | undefined>(undefined);

  useEffect(() => {
    
    if (id === 'new') return;
    const controller = new AbortController();

    const fetchCoverLetter = async () => {
      const response = await fetch(`/api/cover-letters/${id}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Failed to fetch cover letter.');
      const data = await response.json();
      setInitialCoverLetter(data);
    };

    fetchCoverLetter().catch((err) => {
      throw err; 
    });

    return () => controller.abort();
  }, [id]);





  return (
    <CoverLetterProvider initialCoverLetter={initialCoverLetter}>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-var(--header-height))]">
        <div className="overflow-y-auto h-full bg-white">
          <CoverLetterEditor />
        </div>
        <div className="hidden lg:block overflow-y-auto h-full bg-gray-50 p-4">
          <div className="scale-90 transform origin-top">
            <CoverLetterPreview />
          </div>
        </div>
      </div>
    </CoverLetterProvider>
  );
}
