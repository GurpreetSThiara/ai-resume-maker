# Step Wizard Components

This directory contains reusable step wizard components for creating multi-step forms and wizards.

## Components

### StepWizard

The main wizard component that handles step navigation and content display.

**Props:**
- `steps: Step[]` - Array of step objects with id, title, icon, and description
- `currentStep: number` - Current active step index
- `completedSteps: Set<number>` - Set of completed step indices
- `showPreview?: boolean` - Whether preview mode is enabled (affects layout)
- `children: React.ReactNode` - Content for the current step
- `reviewComponent?: React.ReactNode` - Content to show on the final step
- `onStepChange: (stepIndex: number) => void` - Callback when step changes
- `onNextStep?: () => void` - Optional callback for next step action
- `onPreviousStep?: () => void` - Optional callback for previous step action
- `className?: string` - Additional CSS classes

### StepSidebar

Sidebar component that shows all steps when preview is disabled.

**Props:**
- `steps: Step[]` - Array of step objects
- `currentStep: number` - Current active step index
- `completedSteps: Set<number>` - Set of completed step indices
- `onStepChange: (stepIndex: number) => void` - Callback when step changes
- `className?: string` - Additional CSS classes

### StepBreadcrumb

Breadcrumb component that shows step progress when preview is enabled.

**Props:**
- `steps: Step[]` - Array of step objects
- `currentStep: number` - Current active step index
- `completedSteps: Set<number>` - Set of completed step indices
- `onStepChange: (stepIndex: number) => void` - Callback when step changes
- `className?: string` - Additional CSS classes

## Usage Example

```tsx
import { StepWizard, StepSidebar, StepBreadcrumb } from '@/components/ui/step-wizard';

const steps = [
  { id: 0, title: "Personal Info", icon: "👤", description: "Tell us about yourself" },
  { id: 1, title: "Experience", icon: "💼", description: "Your work history" },
  { id: 2, title: "Review", icon: "✨", description: "Final review" },
];

function MyWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());
  const [showPreview, setShowPreview] = useState(false);

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });
  };

  return (
    <div className="grid gap-6">
      {showPreview && (
        <StepBreadcrumb
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepChange={handleStepChange}
        />
      )}
      
      <div className="grid gap-6">
        {!showPreview && (
          <StepSidebar
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepChange={handleStepChange}
          />
        )}

        <StepWizard
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          showPreview={showPreview}
          onStepChange={handleStepChange}
          reviewComponent={<div>Review content here</div>}
        >
          <div>Step content here</div>
        </StepWizard>
      </div>
    </div>
  );
}
```

## Features

- **Responsive Design**: Adapts layout based on preview mode
- **Step Tracking**: Visual indicators for completed and current steps
- **Keyboard Navigation**: Built-in previous/next navigation
- **Customizable**: Flexible props for different use cases
- **TypeScript**: Full TypeScript support with proper interfaces
