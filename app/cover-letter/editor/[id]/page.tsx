'use client';

import React, { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CoverLetterEditor } from '@/components/cover-letters/editor/editor';
import { CoverLetterPreview } from '@/components/cover-letters/preview/preview';
import { CoverLetterPreviewModal } from '@/components/cover-letters/preview/preview-modal';
import { CoverLetterProvider, useCoverLetter } from '@/contexts/CoverLetterContext';
import { CoverLetter } from '@/types/cover-letter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, ChevronRight as ArrowRight } from 'lucide-react';
import { CREATE_COVER_LETTER_STEPS } from '@/app/constants/global';
import { coverLetterExample } from '@/lib/examples/cover-letter';
import { getDefaultTemplate, isValidTemplate } from '@/lib/config/cover-letter-templates';
import { CoverLetterTemplateSwitch } from '@/components/cover-letters/cover-letter-template-switch';
import DownloadDropDown from '@/components/cover-letters/editor/download-dropdown';
import { StepWizard } from '@/components/ui/step-wizard';
import { StepSidebar } from '@/components/ui/step-sidebar';
import { StepBreadcrumb } from '@/components/ui/step-breadcrumb';
import { StepLayout } from '@/components/ui/step-layout';

// Inner component to access live cover letter context for download
function EditorHeader({ onTogglePreview, showPreview }: { onTogglePreview: () => void; showPreview: boolean }) {
  const { state } = useCoverLetter();

  const liveCoverLetter = state.coverLetter;
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      <CoverLetterTemplateSwitch />
      <DownloadDropDown coverLetter={liveCoverLetter} disabled={!liveCoverLetter} />
      <Button
        variant="outline"
        size="sm"
        onClick={onTogglePreview}
        className="flex items-center gap-2 mobile-button btn-mobile"
      >
        <Eye className="w-4 h-4" />
        <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        <span className="sm:hidden">{showPreview ? 'Preview' : 'Show'}</span>
      </Button>
    </div>
  );
}

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CoverLetterEditorPage({ params }: EditorPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [initialCoverLetter, setInitialCoverLetter] = useState<CoverLetter | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0, 1, 2]));

  const steps = CREATE_COVER_LETTER_STEPS;

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Helper to get current cover letter instance for download button
  const getCurrentCoverLetter = () => {
    // Fallback: use initial cover letter; live data will be used inside provider
    return initialCoverLetter;
  };

  useEffect(() => {
    if (id === 'new') {
      // Read template from URL parameter for new cover letters
      const urlTemplate = searchParams.get('template');
      let initialData = { ...coverLetterExample };
      
      if (urlTemplate && isValidTemplate(urlTemplate)) {
        console.log('Setting initial template from URL:', urlTemplate);
        initialData = {
          ...initialData,
          formatting: {
            ...initialData.formatting,
            layout: urlTemplate,
          },
        };
      }
      
      setInitialCoverLetter(initialData);
      setIsLoading(false);
      return;
    }
    

  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-green-50 to-indigo-100 mobile-app-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading your cover letter...</p>
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
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-green-50 to-indigo-100">
        <div className="container mx-auto px-6 py-4 sm:py-6 mobile-safe-area">
          <div className="flex mt-4 flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Create Your Cover Letter</h1>
            </div>
            <EditorHeader
              onTogglePreview={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setShowMobilePreview(true);
                } else {
                  setShowPreview((prev) => !prev);
                }
              }}
              showPreview={showPreview}
            />
          </div>

          <StepLayout
            steps={steps}
            currentStep={currentStep}
            showPreview={showPreview}
            onStepChange={handleStepChange}
            completedSteps={completedSteps}
            reviewComponent={
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-50 to-emerald-100 rounded-full mb-2">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Review Your Cover Letter</h2>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Take a final look at your cover letter. You can edit directly by clicking on any section in the preview.
                  </p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">📝</span>
                      </div>
                      <h3 className="font-medium text-blue-900">Edit Directly</h3>
                    </div>
                    <p className="text-xs text-blue-700">Click any text in the preview to make changes</p>
                  </div>
                  
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">✓</span>
                      </div>
                      <h3 className="font-medium text-green-900">Quality Check</h3>
                    </div>
                    <p className="text-xs text-green-700">Ensure all information is accurate</p>
                  </div>
                  
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">⬇️</span>
                      </div>
                      <h3 className="font-medium text-purple-900">Ready to Export</h3>
                    </div>
                    <p className="text-xs text-purple-700">Download in multiple formats</p>
                  </div>
                </div>

                {/* Download Section */}
                <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-lg font-semibold text-gray-900">Ready to Download?</h3>
                    <p className="text-sm text-gray-600">Choose your preferred format and start applying</p>
                    <div className="flex justify-center">
                      <DownloadDropDown coverLetter={getCurrentCoverLetter()} disabled={!getCurrentCoverLetter()} />
                    </div>
                    {/* Mobile Preview Button */}
                    <div className="sm:hidden mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowMobilePreview(true)}
                        className="flex items-center gap-2 w-full"
                      >
                        <Eye className="w-4 h-4" />
                        View Preview
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preview Section - Hidden on mobile */}
                <div className="hidden sm:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-linear-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Preview</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Interactive</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="scale-100 lg:scale-95 lg:transform lg:origin-top transition-transform duration-200">
                      <CoverLetterPreview />
                    </div>
                  </div>
                </div>

                {/* Footer Tips */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs">💡</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">Pro Tip</h4>
                      <p className="text-sm text-amber-700">
                        Before downloading, double-check the recipient's name, title, and company information for accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
            previewComponent={
              <div className="scale-90 transform origin-top">
                <CoverLetterPreview />
              </div>
            }
            previewTitle="Cover Letter Preview ( edit directly from preview try with click/tap )"
          >
            <CoverLetterEditor activeStep={currentStep} />
          </StepLayout>
        </div>

        <CoverLetterPreviewModal
          open={showMobilePreview}
          onOpenChange={setShowMobilePreview}
        />
      </div>
    </CoverLetterProvider>
  );
}
