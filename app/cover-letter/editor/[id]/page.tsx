'use client';

import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === 'new') {
      setInitialCoverLetter(undefined); // Use default from context
      setLoading(false);
      return;
    }

    const fetchCoverLetter = async () => {
      try {
        const response = await fetch(`/api/cover-letters/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cover letter. Please try again later.');
        }
        const data = await response.json();
        setInitialCoverLetter(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverLetter();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold mb-2">Error Loading Cover Letter</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

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
