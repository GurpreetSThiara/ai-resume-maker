'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Step } from './step-wizard';

export interface StepSidebarProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepChange: (stepIndex: number) => void;
  className?: string;
}

export function StepSidebar({
  steps,
  currentStep,
  completedSteps,
  onStepChange,
  className = '',
}: StepSidebarProps) {
  return (
    <div className={`hidden lg:block ${className}`}>
      <Card className="sticky top-32">
        <CardHeader>
          <CardTitle className="text-lg">
            Step {currentStep + 1} of {steps.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepChange(index)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentStep === index
                  ? 'bg-primary text-primary-foreground'
                  : completedSteps.has(index)
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{step.icon}</span>
                <div>
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default StepSidebar;
