import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile - CreateFreeCV',
  description: 'Manage your profile and resume settings',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
