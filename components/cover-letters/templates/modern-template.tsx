import type { CoverLetter } from "@/types/cover-letter"
import { format } from "date-fns"
import { useCoverLetter } from "@/contexts/CoverLetterContext"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function ModernMinimalTemplate() {
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
    <div className="bg-white text-gray-900 font-helvetica p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-x-2">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleApplicantUpdate('firstName', e.currentTarget.textContent || '')}
            className="text-3xl font-light text-gray-900 mb-2 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {applicant.firstName}
          </span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleApplicantUpdate('lastName', e.currentTarget.textContent || '')}
            className="text-3xl font-light text-gray-900 mb-2 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {applicant.lastName}
          </span>
        </div>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleApplicantUpdate('professionalTitle', e.currentTarget.textContent || '')}
          className="text-lg text-gray-600 mb-4 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
        >
          {applicant.professionalTitle}
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          {applicant.contactInfo.email && (
            <div className="flex flex-wrap gap-x-3">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleApplicantContactUpdate('email', e.currentTarget.textContent || '')}
                className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
              >
                {applicant.contactInfo.email}
              </span>
              {applicant.contactInfo.phone && (
                <>
                  <span className="text-gray-400">|</span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleApplicantContactUpdate('phone', e.currentTarget.textContent || '')}
                    className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                  >
                    {applicant.contactInfo.phone}
                  </span>
                </>
              )}
            </div>
          )}
          {applicant.contactInfo.address && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleApplicantContactUpdate('address', e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {applicant.contactInfo.address}
            </p>
          )}
          {(applicant.contactInfo.linkedin /* || applicant.contactInfo.portfolio || applicant.contactInfo.github */) && (
            <div className="flex flex-wrap gap-x-3">
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
            className="text-sm text-gray-600 cursor-pointer hover:bg-gray-50 rounded px-1 outline-none focus:ring-2 focus:ring-blue-300"
          >
            {format(new Date(content.date), "MMMM d, yyyy")}
          </p>
        )}
      </div>

      {/* Recipient */}
      {(recipient.name || recipient.title || recipient.company || recipient.address) && (
        <div className="mb-8">
          {recipient.name && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('name', e.currentTarget.textContent || '')}
              className="font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.name}
            </p>
          )}
          {recipient.title && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('title', e.currentTarget.textContent || '')}
              className="text-gray-700 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.title}
            </p>
          )}
          {recipient.company && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('company', e.currentTarget.textContent || '')}
              className="text-gray-700 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.company}
            </p>
          )}
          {recipient.address && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleRecipientUpdate('address', e.currentTarget.textContent || '')}
              className="whitespace-pre-line text-gray-700 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            >
              {recipient.address}
            </p>
          )}
        </div>
      )}

      {/* Salutation */}
      <div className="mb-6">
        {content.salutation && (
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentUpdate('salutation', e.currentTarget.textContent || '')}
            className="text-gray-900 outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
          >
            {content.salutation}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentUpdate('openingParagraph', { ...content.openingParagraph, text: e.currentTarget.textContent || '' })}
          className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 text-gray-900 leading-relaxed"
        >
          {opening}
        </p>
        <div className="whitespace-pre-line text-gray-900 leading-relaxed">
          {content.bodyParagraphs.map((para, idx) => (
            <p
              key={para.id}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBodyUpdate(idx, e.currentTarget.textContent || '')}
              className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 mb-6"
            >
              {para.text}
            </p>
          ))}
        </div>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentUpdate('closingParagraph', { ...content.closingParagraph, text: e.currentTarget.textContent || '' })}
          className="outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 text-gray-900 leading-relaxed"
        >
          {closing}
        </p>
      </div>

      {/* Signature */}
      <div className="mt-8">
        <div className="font-semibold text-gray-900">
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
