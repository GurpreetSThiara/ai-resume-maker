import type { Metadata } from 'next';
import { TermsContent } from "@/components/legal/terms-content";
import { pageSocialMetadata } from '@/lib/seo';

const TITLE = 'Terms of Service | CreateFreeCV.com';
const DESCRIPTION = 'Read the Terms of Service for CreateFreeCV.com to understand the rules and guidelines for using our resume builder service.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://createfreecv.com/terms-of-service',
  },
  ...pageSocialMetadata({ title: TITLE, description: DESCRIPTION, path: '/terms-of-service' }),
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border-gray-200">
          <TermsContent />
        </div>
      </div>
    </div>
  );
}
