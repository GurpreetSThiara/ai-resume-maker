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

export async function downloadCoverLetterPDF({coverLetter,templateName}: {coverLetter: CoverLetter, templateName: string}) {

  let downloadFunction;
  if (templateName === 'modern') {
    downloadFunction = (await import('@/lib/pdf-generators/cover-letter-modern-minimal-generator')).generateModernMinimalPDF;
  } else if (templateName === 'professional') {
    downloadFunction = (await import('@/lib/pdf-generators/cover-letter-professional-standard-generator')).generateProfessionalStandardPDF;
  } else {
    downloadFunction = generateCoverLetterPDF;
  }

  const bytes = await downloadFunction(coverLetter);
  
  triggerDownload(bytes, `sample.pdf`, 'application/pdf');

  //triggerDownload(bytes, `${coverLetter.title.replace(/\s/g, '_')}.pdf`, 'application/pdf')
}


export async function downloadCoverLetterDOCX({coverLetter, templateName}: {coverLetter: CoverLetter, templateName: string}) {
  let downloadFunction;
  if (templateName === 'modern') {
    downloadFunction = (await import('@/lib/docx-generators/cover-letter-modern-minimal-docx-generator')).generateModernMinimalDOCX;
  } else if (templateName === 'professional') {
    downloadFunction = (await import('@/lib/docx-generators/cover-letter-professional-docx')).generateProfessionalStandardDOCX;
  } else {
    downloadFunction = generateCoverLetterDOCX;
  }

  const buffer = await downloadFunction(coverLetter);
  // Ensure buffer is a Uint8Array for Blob compatibility
  const blobData = buffer instanceof Uint8Array ? new Uint8Array(buffer) : buffer;
  triggerDownload(blobData, `sample.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  //triggerDownload(buffer, `${coverLetter.title.replace(/\s/g, '_')}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
}
