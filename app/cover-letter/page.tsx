'use client';

import { HeroSection, FeaturesSection, TemplatesSection, BenefitsSection, CtaSection, FaqSection, ComboSection } from '@/components/cover-letters/landing';

export default function CoverLetterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <HeroSection />
      <FeaturesSection />
      <TemplatesSection />
      <BenefitsSection />
      <ComboSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
