import type { Metadata } from 'next';
import { PrivacyContent } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: 'Privacy Policy | CreateFreeCV.com',
  description: 'Read the privacy policy for CreateFreeCV.com to understand how we handle your data.',
  alternates: {
    canonical: 'https://createfreecv.com/privacy-policy',
  },
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
