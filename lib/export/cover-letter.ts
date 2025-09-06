import { CoverLetter } from '@/types/cover-letter'
import { generateCoverLetterPDF } from '@/lib/pdf-generators/cover-letter-generator'
import { generateCoverLetterDOCX } from '@/lib/docx-generators/cover-letter-generator'

function triggerDownload(data: BlobPart, filename: string, mime: string) {
  const blob = new Blob([data], { type: mime })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export async function downloadCoverLetterPDF(coverLetter: CoverLetter) {
  const bytes = await generateCoverLetterPDF(coverLetter)
  triggerDownload(bytes, `${coverLetter.title.replace(/\s/g, '_')}.pdf`, 'application/pdf')
}

export async function downloadCoverLetterDOCX(coverLetter: CoverLetter) {
  const buffer = await generateCoverLetterDOCX(coverLetter)
  triggerDownload(buffer, `${coverLetter.title.replace(/\s/g, '_')}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
}
