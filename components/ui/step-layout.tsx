'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Step } from './step-wizard';
import { StepWizard } from './step-wizard';
import { StepSidebar } from './step-sidebar';
import { StepBreadcrumb } from './step-breadcrumb';

export interface StepLayoutProps {
  steps: Step[];
  currentStep: number;
  showPreview: boolean;
  children: React.ReactNode;
  reviewComponent?: React.ReactNode;
  previewComponent?: React.ReactNode;
  onStepChange: (stepIndex: number) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  className?: string;
  showBreadcrumb?: boolean;
  previewTitle?: string;
  completedSteps?: Set<number>;
}

export function StepLayout({
  steps,
  currentStep,
  showPreview,
  children,
  reviewComponent,
  previewComponent,
  onStepChange,
  onNextStep,
  onPreviousStep,
  className = '',
  showBreadcrumb = true,
  previewTitle = 'Preview',
  completedSteps = new Set(),
}: StepLayoutProps) {
  return (
    <div className={`grid gap-4 md:gap-6 mt-6 mobile-full-screen md:mt-6 ${className}`}>
      {/* Better UX Breadcrumb - Show when preview is enabled */}
      {showPreview && showBreadcrumb && (
        <StepBreadcrumb
          steps={steps}
          currentStep={currentStep}
          onStepChange={onStepChange}
          completedSteps={completedSteps}
        />
      )}
      
      <div className={`grid gap-6 mobile-grid-stack ${
        showPreview && currentStep < steps.length - 1 
          ? 'lg:grid-cols-2' 
          : 'lg:grid-cols-1'
      }`}>
      <div className="flex gap-4">
          {/* Step Sidebar - Show when preview is disabled */}
        {!showPreview && (
         <div className="md:w-[25%] w-[0px]]">
           <StepSidebar
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepChange={onStepChange}
          />
         </div>
        )}

        {/* Main Step Wizard */}
        <StepWizard
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          showPreview={showPreview}
          onStepChange={onStepChange}
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          reviewComponent={reviewComponent}
        >
          {children}
        </StepWizard>
      </div>

        {/* Preview Panel - Show when preview is enabled and not on last step */}
        {showPreview && previewComponent && currentStep < steps.length - 1 && (
          <div className="lg:col-span-1 desktop-only hidden md:flex">
            <Card className="sticky top-32 max-h-[calc(100vh-8rem)] overflow-auto mobile-card">
              <CardHeader>
                <CardTitle className="text-lg text-center">{previewTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {previewComponent}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default StepLayout;
