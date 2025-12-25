import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"
import { useCoverLetter } from "@/contexts/CoverLetterContext"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface SplitHeaderTemplateProps {
  coverLetter: CoverLetter
  editable?: boolean
}

export default function SplitHeaderTemplate({ coverLetter }: SplitHeaderTemplateProps) {
  const { updateCoverLetter, updateContent } = useCoverLetter()
  const { applicant, recipient, content } = coverLetter
  const [isEditingDate, setIsEditingDate] = useState(false)
  
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const yourTitle = applicant.professionalTitle
  const yourEmail = applicant.contactInfo.email
  const yourPhone = applicant.contactInfo.phone
  const yourAddress = applicant.contactInfo.address
  const yourLinkedin = applicant.contactInfo.linkedin

  const opening = content.openingParagraph.text
  const bodyParagraphs = content.bodyParagraphs
  const closing = content.closingParagraph.text
  const recipientAddress = recipient.address

  const handleApplicantChange = (field: string, value: string) => {
    if (field === 'firstName' || field === 'lastName' || field === 'professionalTitle') {
      updateCoverLetter({ applicant: { ...applicant, [field]: value } })
    } else if (field === 'address' || field === 'phone' || field === 'email' || field === 'linkedin') {
      updateCoverLetter({
        applicant: {
          ...applicant,
          contactInfo: { ...applicant.contactInfo, [field]: value }
        }
      })
    }
  }

  const handleRecipientChange = (field: string, value: string) => {
    updateCoverLetter({ recipient: { ...recipient, [field]: value } })
  }

  const handleContentChange = (field: string, value: string) => {
    if (field === 'opening') {
      updateContent({ openingParagraph: { ...content.openingParagraph, text: value } })
    } else if (field === 'closing') {
      updateContent({ closingParagraph: { ...content.closingParagraph, text: value } })
    }
  }

  const handleBodyUpdate = (index: number, value: string) => {
    const updated = [...content.bodyParagraphs]
    updated[index] = { ...updated[index], text: value }
    updateContent({ bodyParagraphs: updated })
  }

  const handleNameUpdate = (value: string) => {
    const names = value.split(' ')
    updateCoverLetter({
      applicant: {
        ...applicant,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || ''
      }
    })
  }

  return (
    <div className="text-gray-900 font-helvetica p-8">
      {/* Split Header Layout */}
      <div className="flex justify-between items-start mb-8">
        {/* Left Side - Name */}
        <div className="flex-1">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleNameUpdate(e.currentTarget.textContent || '')}
            className="text-2xl font-bold text-gray-900 mb-2 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 inline-block"
          >
            {yourName}
          </span>
          {yourTitle && (
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleApplicantChange('professionalTitle', e.currentTarget.textContent || '')}
              className="text-sm text-gray-600 mb-1 block outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {yourTitle}
            </span>
          )}
        </div>

        {/* Right Side - Contact Info */}
        <div className="flex-1 text-right">
          <div className="text-sm text-gray-600 space-y-1">
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleApplicantChange('address', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 whitespace-pre-line"
            >
              {yourAddress}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleApplicantChange('phone', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {yourPhone}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleApplicantChange('email', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {yourEmail}
            </p>
            {(yourLinkedin) && (
              <div className="pt-1 space-y-1">
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleApplicantChange('linkedin', e.currentTarget.textContent || '')}
                  className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                >
                  {yourLinkedin}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="mb-6">
        {isEditingDate ? (
          <Input
            type="date"
            defaultValue={format(new Date(content.date), "yyyy-MM-dd")}
            onBlur={(e) => {
              const newDate = e.target.value
              if (newDate) {
                updateContent({ date: new Date(newDate) })
              }
              setIsEditingDate(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newDate = e.currentTarget.value
                if (newDate) {
                  updateContent({ date: new Date(newDate) })
                }
                setIsEditingDate(false)
              }
            }}
            className="text-sm"
            autoFocus
          />
        ) : (
          <p
            onClick={() => setIsEditingDate(true)}
            className="text-sm cursor-pointer hover:bg-gray-50 rounded px-1 outline-none focus:ring-2 focus:ring-blue-300"
          >
            {format(new Date(content.date), "MMMM d, yyyy")}
          </p>
        )}
      </div>

      {/* Recipient Information */}
      <div className="mb-6">
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleRecipientChange('name', e.currentTarget.textContent || '')}
          className="text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {recipient.name}
        </p>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleRecipientChange('title', e.currentTarget.textContent || '')}
          className="text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {recipient.title}
        </p>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleRecipientChange('company', e.currentTarget.textContent || '')}
          className="text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {recipient.company}
        </p>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleRecipientChange('address', e.currentTarget.textContent || '')}
          className="text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 whitespace-pre-line"
        >
          {recipientAddress}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-6">
        <div className="text-sm leading-relaxed">
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('opening', e.currentTarget.textContent || '')}
            className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 whitespace-pre-wrap"
          >
            {opening}
          </p>
        </div>
        <div className="whitespace-pre-line text-sm leading-relaxed">
          {bodyParagraphs.map((para, idx) => (
            <p
              key={para.id}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBodyUpdate(idx, e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 mb-4"
            >
              {para.text}
            </p>
          ))}
        </div>
        <div className="text-sm leading-relaxed">
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('closing', e.currentTarget.textContent || '')}
            className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 whitespace-pre-wrap"
          >
            {closing}
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-2">Sincerely,</p>
        <p className="text-sm font-bold text-gray-900">{yourName}</p>
      </div>
    </div>
  )
}
