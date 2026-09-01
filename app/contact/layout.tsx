import type { Metadata } from 'next'
import { pageSocialMetadata } from '@/lib/seo'

const TITLE = 'Contact Us | CreateFreeCV.com'
const DESCRIPTION = 'Get in touch with the CreateFreeCV team. We love to hear your feedback and answer your questions.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://createfreecv.com/contact',
  },
  ...pageSocialMetadata({ title: TITLE, description: DESCRIPTION, path: '/contact' }),
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
