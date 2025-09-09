
import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"

interface TemplateProps {
  coverLetter: CoverLetter
}

export function ClassicTemplate({ coverLetter }: TemplateProps) {
  const { applicant, recipient, content } = coverLetter
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
    <div className="bg-white text-black font-sans p-8 leading-normal">
      {/* Contact Block */}
      <div className="mb-8">
        <h1 className="text-lg font-bold mb-1">{yourName}</h1>
        <p className="text-sm">{yourAddress}</p>
        <p className="text-sm">{yourPhone}</p>
        <p className="text-sm">{yourEmail}</p>
      </div>

      {/* Date */}
      <div className="mb-6">
        <p className="text-sm">{format(new Date(content.date), "MMMM d, yyyy")}</p>
      </div>

      {/* Recipient Block */}
      <div className="mb-8">
        <p className="font-medium">{recipient.name}</p>
        <p>{recipient.title}</p>
        <p>{recipient.company}</p>
        <p className="text-sm whitespace-pre-line">{recipientAddress}</p>
      </div>

      {/* Salutation */}
      <div className="mb-4">
        <p>Dear Hiring Manager,</p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        <p className="text-justify">{opening}</p>
        <div className="whitespace-pre-line text-justify">{body}</div>
        <p className="text-justify">{closing}</p>
      </div>

      {/* Closing */}
      <div className="mt-6">
        <p>Sincerely,</p>
        <p className="mt-4 font-medium">{yourName}</p>
      </div>
    </div>
  )
}
