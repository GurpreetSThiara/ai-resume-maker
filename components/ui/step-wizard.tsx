'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Step {
  id: number | string;
  title: string;
  icon: string | React.ReactNode;
  description: string;
}

export interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  showPreview?: boolean;
  children: React.ReactNode;
  reviewComponent?: React.ReactNode;
  onStepChange: (stepIndex: number) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  className?: string;
}

export function StepWizard({
  steps,
  currentStep,
  completedSteps,
  showPreview = false,
  children,
  reviewComponent,
  onStepChange,
  onNextStep,
  onPreviousStep,
  className = '',
}: StepWizardProps) {
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
    onNextStep?.();
  };

  const handlePreviousStep = () => {
    const newStep = Math.max(currentStep - 1, 0);
    if (newStep !== currentStep) {
      onStepChange(newStep);
    }
    onPreviousStep?.();
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={`w-full`}>
      <Card className="min-h-[600px] mobile-card md:min-h-[600px]">
        <CardHeader className="mobile-header">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl">{steps[currentStep].icon}</span>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg md:text-xl truncate">{steps[currentStep].title}</CardTitle>
              <CardDescription className="text-sm md:text-base truncate">{steps[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mobile-content mobile-scrollable pb-6 md:pb-6">
          {isLastStep && reviewComponent ? (
            reviewComponent
          ) : (
            children
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4 md:mt-6 mobile-footer">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={isFirstStep}
          className="flex items-center gap-2 mobile-button btn-mobile"
          size={typeof window !== 'undefined' && window.innerWidth < 768 ? 'sm' : 'default'}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Step</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <Button
          onClick={handleNextStep}
          disabled={isLastStep}
          className={`flex items-center gap-2 mobile-button btn-mobile ${
            isLastStep ? 'invisible' : ''
          }`}
          size={typeof window !== 'undefined' && window.innerWidth < 768 ? 'sm' : 'default'}
        >
          <span className="hidden sm:inline">Next Step</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default StepWizard;
