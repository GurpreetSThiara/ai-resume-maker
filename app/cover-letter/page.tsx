import type { Metadata } from 'next';
import { pageSocialMetadata } from '@/lib/seo';
import {
  HeroSection,
  FeaturesSection,
  TemplatesSection,
  BenefitsSection,
  CtaSection,
  FaqSection,
  ComboSection,
} from '@/components/cover-letters/landing';

const TITLE = 'Free Cover Letter Builder | CreateFreeCV.com';
const DESCRIPTION =
  'Write a cover letter that matches your resume. Free templates, no sign-up needed, and instant PDF and DOCX download.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://createfreecv.com/cover-letter',
  },
  ...pageSocialMetadata({ title: TITLE, description: DESCRIPTION, path: '/cover-letter' }),
};

/**
 * Server component so the page ships metadata. It was marked 'use client'
 * only to host these sections, each of which already declares its own client
 * boundary — so the page itself never needed to be one, and paid for it with
 * no title or description in search results.
 */
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
