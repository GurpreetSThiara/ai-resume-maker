import { CoverLetter } from '@/types/cover-letter'
import { generateCoverLetterPDF } from '@/lib/pdf-generators/cover-letter-generator'
import { generateCoverLetterDOCX } from '@/lib/docx-generators/cover-letter-generator'
import { getDefaultTemplate, COVER_LETTER_TEMPLATES } from '@/lib/config/cover-letter-templates'

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

export async function downloadCoverLetterPDF({coverLetter, templateName}: {coverLetter: CoverLetter, templateName: string}) {

  let downloadFunction;
  if (templateName === COVER_LETTER_TEMPLATES['split-header'].value) {
    downloadFunction = (await import('@/lib/pdf-generators/cover-letter-split-header-generator')).generateSplitHeaderPDF;
  } else {
    // Default to classic template
    downloadFunction = generateCoverLetterPDF;
  }

  const bytes = await downloadFunction(coverLetter);
  
  triggerDownload(new Uint8Array(bytes), `sample.pdf`, 'application/pdf');

  //triggerDownload(bytes, `${coverLetter.title.replace(/\s/g, '_')}.pdf`, 'application/pdf')
}


export async function downloadCoverLetterDOCX({coverLetter, templateName}: {coverLetter: CoverLetter, templateName: string}) {
  let downloadFunction;
  if (templateName === COVER_LETTER_TEMPLATES['split-header'].value) {
    downloadFunction = (await import('@/lib/docx-generators/cover-letter-split-header-docx')).generateSplitHeaderDOCX;
  } else {
    // Default to classic template
    downloadFunction = generateCoverLetterDOCX;
  }

  const buffer = await downloadFunction(coverLetter);
  // Ensure buffer is a Uint8Array for Blob compatibility
  const blobData = buffer instanceof Uint8Array ? new Uint8Array(buffer) : buffer;
  triggerDownload(blobData, `sample.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  //triggerDownload(buffer, `${coverLetter.title.replace(/\s/g, '_')}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
}
