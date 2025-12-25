import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"
import { useCoverLetter } from "@/contexts/CoverLetterContext"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function ProfessionalStandardTemplate() {
  const { updateContent, updateCoverLetter, state } = useCoverLetter();
  const { coverLetter } = state;
  const { applicant, recipient, content } = coverLetter;
  const [isEditingDate, setIsEditingDate] = useState(false);

  const handleContentUpdate = (field: keyof CoverLetter['content'], value: any) => {
    updateContent({ [field]: value });
  };

  const handleBodyUpdate = (index: number, value: string) => {
    const updated = [...content.bodyParagraphs];
    updated[index] = { ...updated[index], text: value };
    updateContent({ bodyParagraphs: updated });
  };

  const handleApplicantUpdate = (field: string, value: string) => {
    updateCoverLetter({ applicant: { ...applicant, [field]: value } });
  };

  const handleApplicantContactUpdate = (field: string, value: string) => {
    updateCoverLetter({
      applicant: {
        ...applicant,
        contactInfo: { ...applicant.contactInfo, [field]: value },
      },
    });
  };

  const handleRecipientUpdate = (field: string, value: string) => {
    updateCoverLetter({ recipient: { ...recipient, [field]: value } });
  };

  const opening = content.openingParagraph.text;
  const body = content.bodyParagraphs.map((p) => p.text).join("\n\n");
  const closing = content.closingParagraph.text;

  return (
    <div className="bg-white text-black font-helvetica p-10 leading-normal">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex flex-wrap gap-x-2">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleApplicantUpdate('firstName', e.currentTarget.textContent || '')}
            className="text-xl font-bold uppercase tracking-wide mb-3 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {applicant.firstName}
          </span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleApplicantUpdate('lastName', e.currentTarget.textContent || '')}
            className="text-xl font-bold uppercase tracking-wide mb-3 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {applicant.lastName}
          </span>
        </div>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleApplicantUpdate('professionalTitle', e.currentTarget.textContent || '')}
          className="text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {applicant.professionalTitle}
        </p>
        <div className="text-sm">
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleApplicantContactUpdate('address', e.currentTarget.textContent || '')}
            className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {applicant.contactInfo.address}
          </p>
          <div className="flex flex-wrap gap-x-3">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleApplicantContactUpdate('phone', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {applicant.contactInfo.phone}
            </span>
            <span className="text-gray-400">•</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleApplicantContactUpdate('email', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {applicant.contactInfo.email}
            </span>
          </div>
          {(applicant.contactInfo.linkedin /* || applicant.contactInfo.portfolio || applicant.contactInfo.github */) && (
            <div className="flex flex-wrap gap-x-3 mt-1">
              {applicant.contactInfo.linkedin && (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const text = e.currentTarget.textContent || '';
                    const linkedinMatch = text.match(/^(\S+)/);
                    handleApplicantContactUpdate('linkedin', linkedinMatch?.[1] || '');
                  }}
                  className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                >
                  {applicant.contactInfo.linkedin}
                </span>
              )}
              {/* {applicant.contactInfo.portfolio && (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const text = e.currentTarget.textContent || '';
                    const portfolioMatch = text.match(/Portfolio:\s*(\S+)/);
                    handleApplicantContactUpdate('portfolio', portfolioMatch?.[1] || '');
                  }}
                  className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                >
                  Portfolio: {applicant.contactInfo.portfolio}
                </span>
              )} */}
              {/* {applicant.contactInfo.github && (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const text = e.currentTarget.textContent || '';
                    const githubMatch = text.match(/GitHub:\s*(\S+)/);
                    handleApplicantContactUpdate('github', githubMatch?.[1] || '');
                  }}
                  className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                >
                  GitHub: {applicant.contactInfo.github}
                </span>
              )} */}
            </div>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="mb-6">
        {isEditingDate ? (
          <Input
            type="date"
            defaultValue={format(new Date(content.date), "yyyy-MM-dd")}
            onBlur={(e) => {
              const newDate = e.target.value;
              if (newDate) {
                handleContentUpdate('date', new Date(newDate));
              }
              setIsEditingDate(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            className="text-sm w-40"
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

      {/* Recipient */}
      {(recipient.name || recipient.title || recipient.company || recipient.address) && (
        <div className="mb-6">
          {recipient.name && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('name', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.name}
            </p>
          )}
          {recipient.title && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('title', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.title}
            </p>
          )}
          {recipient.company && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('company', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.company}
            </p>
          )}
          {recipient.address && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('address', e.currentTarget.textContent || '')}
              className="whitespace-pre-line outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.address}
            </p>
          )}
        </div>
      )}

      {/* Subject Line */}
      <div className="mb-6">
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const text = e.currentTarget.textContent || '';
            const match = text.match(/RE:\s*(.+)/);
            // Could store subject in content if needed
          }}
          className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          <strong>RE: Application for Position</strong>
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentUpdate('salutation', e.currentTarget.textContent || '')}
          className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {content.salutation || "Dear Hiring Manager,"}
        </p>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentUpdate('openingParagraph', { ...content.openingParagraph, text: e.currentTarget.textContent || '' })}
          className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {opening}
        </p>
        <div className="whitespace-pre-line">
          {content.bodyParagraphs.map((para, idx) => (
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
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentUpdate('closingParagraph', { ...content.closingParagraph, text: e.currentTarget.textContent || '' })}
          className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {closing}
        </p>
      </div>

      {/* Signature */}
      <div className="mt-8">
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentUpdate('complimentaryClose', e.currentTarget.textContent || '')}
          className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {content.complimentaryClose || "Sincerely,"}
        </p>
        <div className="mt-4 font-semibold">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleApplicantUpdate('firstName', e.currentTarget.textContent || '')}
            className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {applicant.firstName}
          </span>
          {' '}
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleApplicantUpdate('lastName', e.currentTarget.textContent || '')}
            className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {applicant.lastName}
          </span>
        </div>
      </div>
    </div>
  );
}
