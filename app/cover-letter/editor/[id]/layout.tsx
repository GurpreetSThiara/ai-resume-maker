import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cover Letter Editor - CreateFreeCV',
  description: 'Create and edit your professional cover letter',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CoverLetterEditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
