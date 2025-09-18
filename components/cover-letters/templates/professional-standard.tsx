import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

interface TemplateProps {
  coverLetter: CoverLetter
}

export function ProfessionalStandardTemplate({ coverLetter }: TemplateProps) {
  const { applicant , recipient , content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const yourEmail = applicant.contactInfo.email
  const yourPhone = applicant.contactInfo.phone
  const yourAddress = [
    applicant.contactInfo.address.street,
    `${applicant.contactInfo.address.city}, ${applicant.contactInfo.address.state} ${applicant.contactInfo.address.zipCode}`,
    applicant.contactInfo.address.country,
  ]
    .filter(Boolean)
    .join(", ")
  const opening = content.openingParagraph.text
  const body = content.bodyParagraphs.map((p) => p.text).join("\n\n")
  const closing = content.closingParagraph.text
  const recipientAddress = [
    recipient.address.street,
    `${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`,
  ]
    .filter(Boolean)
    .join("\n")

  return (
    <div className="bg-white text-black font-sans p-10 leading-normal">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase tracking-wide mb-3">{yourName}</h1>
        <div className="text-sm">
          <p>{yourAddress}</p>
          <p>
            {yourPhone} • {yourEmail}
          </p>
        </div>
      </div>

      {/* Date */}
      <div className="mb-6">
        <p>{format(new Date(content.date), "MMMM d, yyyy")}</p>
      </div>

      {/* Recipient */}
      <div className="mb-6">
        <p>{recipient.name}</p>
        <p>{recipient.title}</p>
        <p>{recipient.company}</p>
        <p className="whitespace-pre-line">{recipientAddress}</p>
      </div>

      {/* Subject Line */}
      <div className="mb-6">
        <p>
          <strong>RE: Application for Position</strong>
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <p>{opening}</p>
        <div className="whitespace-pre-line">{body}</div>
        <p>{closing}</p>
      </div>

      {/* Signature */}
      <div className="mt-8">
        <p>Sincerely,</p>
        <p className="mt-4 font-semibold">{yourName}</p>
      </div>
    </div>
  )
}
