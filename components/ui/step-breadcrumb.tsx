'use client';

import React from 'react';
import { ChevronRight as ArrowRight } from 'lucide-react';
import { Step } from './step-wizard';

export interface StepBreadcrumbProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  className?: string;
  completedSteps?: Set<number>;
}

export function StepBreadcrumb({
  steps,
  currentStep,
  onStepChange,
  className = '',
  completedSteps = new Set(),
}: StepBreadcrumbProps) {
  return (
    <nav className="w-[90vw] md:w-auto flex items-center space-x-1 sm:space-x-2 py-2 px-4 bg-card border border-border mobile-header overflow-auto" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <li className="flex items-center">
              {index > 0 && (
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mr-1 sm:mr-2" />
              )}
              <button
                onClick={() => onStepChange(index)}
                className={`border p-1 px-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  currentStep === index
                    ? 'border-primary shadow-lg shadow-primary/30 bg-primary/5 text-primary font-semibold'
                    : completedSteps.has(index)
                    ? 'border-success text-success hover:border-success/60 hover:bg-success/5'
                    : index < currentStep
                    ? 'border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/30'
                    : 'border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40 hover:bg-muted/20'
                }`}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
                aria-current={currentStep === index ? 'step' : undefined}
              >
                <span className="flex items-center">
                  <span className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs font-medium mr-2 ${
                    currentStep === index
                      ? 'bg-primary text-primary-foreground'
                      : completedSteps.has(index)
                      ? 'bg-success text-success-foreground'
                      : index < currentStep
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-muted/50 text-muted-foreground/50'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.title.slice(0, 8)}</span>
                </span>
              </button>
            </li>
          </React.Fragment>
        ))}
      </ol>
      <div className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
        <span className="hidden sm:inline">{currentStep + 1}/{steps.length}</span>
        <span className="sm:hidden">{currentStep + 1}/{steps.length}</span>
      </div>
    </nav>
  );
}

export default StepBreadcrumb;
