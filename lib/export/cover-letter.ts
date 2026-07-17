import { CoverLetter } from '@/types/cover-letter'
import { generateCoverLetterPDF } from '@/lib/pdf-generators/cover-letter-generator'
import { generateCoverLetterDOCX } from '@/lib/docx-generators/cover-letter-generator'
import { COVER_LETTER_TEMPLATES, getTemplateStyle } from '@/lib/config/cover-letter-templates'

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

function exportFilename(coverLetter: CoverLetter, ext: string) {
  const name = `${coverLetter.applicant.firstName} ${coverLetter.applicant.lastName}`.trim()
  const base = name ? `${name} - Cover Letter` : 'Cover Letter'
  return `${base.replace(/\s+/g, '_')}.${ext}`
}

export async function downloadCoverLetterPDF({ coverLetter, templateName }: { coverLetter: CoverLetter, templateName: string }) {
  let bytes: Uint8Array
  if (templateName === COVER_LETTER_TEMPLATES['split-header'].value) {
    const { generateSplitHeaderPDF } = await import('@/lib/pdf-generators/cover-letter-split-header-generator')
    bytes = await generateSplitHeaderPDF(coverLetter)
  } else if (templateName === COVER_LETTER_TEMPLATES.classic.value) {
    bytes = await generateCoverLetterPDF(coverLetter)
  } else {
    // All other templates share the config-driven generator
    const { generateConfigCoverLetterPDF } = await import('@/lib/pdf-generators/cover-letter-config-generator')
    bytes = await generateConfigCoverLetterPDF(coverLetter, getTemplateStyle(templateName))
  }

  triggerDownload(new Uint8Array(bytes), exportFilename(coverLetter, 'pdf'), 'application/pdf')
}

export async function downloadCoverLetterDOCX({ coverLetter, templateName }: { coverLetter: CoverLetter, templateName: string }) {
  let buffer: Uint8Array
  if (templateName === COVER_LETTER_TEMPLATES['split-header'].value) {
    const { generateSplitHeaderDOCX } = await import('@/lib/docx-generators/cover-letter-split-header-docx')
    buffer = await generateSplitHeaderDOCX(coverLetter)
  } else if (templateName === COVER_LETTER_TEMPLATES.classic.value) {
    buffer = await generateCoverLetterDOCX(coverLetter)
  } else {
    const { generateConfigCoverLetterDOCX } = await import('@/lib/docx-generators/cover-letter-config-docx')
    buffer = await generateConfigCoverLetterDOCX(coverLetter, getTemplateStyle(templateName))
  }

  // Ensure buffer is a Uint8Array for Blob compatibility
  const blobData = buffer instanceof Uint8Array ? new Uint8Array(buffer) : buffer
  triggerDownload(blobData, exportFilename(coverLetter, 'docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
}
