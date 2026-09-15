import type { Metadata } from 'next';
import { pageSocialMetadata } from '@/lib/seo';
import { ContactPageContent } from '@/components/appUI/ContactPageContent';

const TITLE = 'Contact Us | CreateFreeCV.com';
const DESCRIPTION =
  'Questions about building your resume? Send the CreateFreeCV team a message and we will get back to you within 24 hours.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://createfreecv.com/contact',
  },
  ...pageSocialMetadata({ title: TITLE, description: DESCRIPTION, path: '/contact' }),
};

/**
 * Server shell so the page ships metadata. The whole page was 'use client'
 * for the sake of the form's four useState calls, which cost it a title and
 * description in search results — it is listed in the sitemap.
 */
export default function ContactPage() {
  return <ContactPageContent />;
}
