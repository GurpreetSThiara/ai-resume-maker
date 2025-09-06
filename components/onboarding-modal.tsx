import React, { useState } from "react";

const steps = [
  {
    title: "Welcome to AI Resume Builder!",
    description: "Let’s help you create a professional resume with AI-powered features."
  },
  {
    title: "Add Your Info",
    description: "Fill in your personal, education, and experience details."
  },
  {
    title: "AI Assistance",
    description: "Use our AI tools to enhance your resume content and get suggestions."
  },
  {
    title: "Preview & Download",
    description: "Preview your resume and download it in multiple formats."
  }
];

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
      tabIndex={-1}
      onKeyDown={e => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transition-all duration-500" tabIndex={0}>
        <h2 id="onboarding-title" className="text-xl font-bold mb-2">{steps[step].title}</h2>
        <p className="mb-4">{steps[step].description}</p>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-disabled={step === 0}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setStep(s => s + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={onClose}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
