import type { Metadata } from 'next';
import { PrivacyContent } from "@/components/legal/privacy-content";
import { pageSocialMetadata } from '@/lib/seo';

const TITLE = 'Privacy Policy | CreateFreeCV.com';
const DESCRIPTION = 'Read the privacy policy for CreateFreeCV.com to understand how we handle your data.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://createfreecv.com/privacy-policy',
  },
  ...pageSocialMetadata({ title: TITLE, description: DESCRIPTION, path: '/privacy-policy' }),
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border-gray-200">
          <PrivacyContent />
        </div>
      </div>
    </div>
  );
}
