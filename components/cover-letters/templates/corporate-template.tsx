'use client';

import {
  CoverLetterTemplateProps,
  EditableText,
  EditableDate,
  RecipientBlock,
  LetterBody,
  SignatureBlock,
  useTemplateFields,
} from './shared';

/**
 * Corporate — traditional serif letter with a left-aligned header and a
 * single rule. Accent: corporate blue (#1d4ed8).
 */
export function CorporateTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="p-10 font-serif text-gray-900">
      {/* Left-aligned header */}
      <div>
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-2xl font-bold text-[#1d4ed8]"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-sm text-gray-600"
          />
        )}
        {contact.address && (
          <EditableText
            value={contact.address}
            onCommit={(v) => setContactField('address', v)}
            className="text-sm text-gray-600 mt-1 whitespace-pre-line"
          />
        )}
        <div className="flex flex-wrap gap-x-3 text-sm text-gray-600 mt-1">
          {contact.phone && (
            <EditableText
              as="span"
              value={contact.phone}
              onCommit={(v) => setContactField('phone', v)}
            />
          )}
          {contact.phone && contact.email && <span className="text-gray-400">|</span>}
          {contact.email && (
            <EditableText
              as="span"
              value={contact.email}
              onCommit={(v) => setContactField('email', v)}
            />
          )}
          {contact.email && contact.linkedin && <span className="text-gray-400">|</span>}
          {contact.linkedin && (
            <EditableText
              as="span"
              value={contact.linkedin}
              onCommit={(v) => setContactField('linkedin', v)}
            />
          )}
        </div>
      </div>

      {/* Single rule */}
      <div className="border-t-2 border-[#1d4ed8] mt-4 mb-8" />

      <EditableDate className="text-sm mb-6" />

      <RecipientBlock className="mb-8" lineClassName="text-sm" />

      <LetterBody paragraphClassName="text-[15px] leading-relaxed text-justify" />

      <SignatureBlock nameClassName="text-[#1d4ed8] font-semibold" />
    </div>
  );
}
