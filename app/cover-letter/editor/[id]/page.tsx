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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === 'new') {
      setInitialCoverLetter(undefined);
      setIsLoading(false);
      return;
    }
    
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const fetchCoverLetter = async () => {
      try {
        const response = await fetch(`/api/cover-letters/${id}`, { 
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error(response.status === 404 
            ? 'Cover letter not found' 
            : 'Failed to fetch cover letter');
        }
        const data = await response.json();
        setInitialCoverLetter(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error fetching cover letter:', err);
          setError(err instanceof Error ? err.message : 'Failed to load cover letter');
          setInitialCoverLetter(undefined);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchCoverLetter();
    return () => controller.abort();
  }, [id]);





  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-var(--header-height))]">
        <div className="p-6 space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-40 w-full bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="hidden lg:block bg-gray-100 p-6">
          <div className="h-full w-full bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-var(--header-height))]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
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
