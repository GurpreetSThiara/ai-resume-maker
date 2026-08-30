import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | CreateFreeCV.com',
  description: 'Get in touch with the CreateFreeCV team. We love to hear your feedback and answer your questions.',
  alternates: {
    canonical: 'https://createfreecv.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
