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
 * Bold Header — oversized name typography with a short accent rule.
 * Accent: warm orange (#ea580c).
 */
export function BoldHeaderTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="p-8 font-sans text-gray-900">
      {/* Oversized header */}
      <div>
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-5xl font-extrabold tracking-tight leading-none inline-block"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-lg font-medium text-[#ea580c] mt-2"
          />
        )}
        <div className="flex flex-wrap gap-x-3 text-sm text-gray-600 mt-3">
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
        {contact.address && (
          <EditableText
            value={contact.address}
            onCommit={(v) => setContactField('address', v)}
            className="text-sm text-gray-600 mt-1 whitespace-pre-line"
          />
        )}
      </div>

      {/* Short accent rule */}
      <div className="border-t-4 border-[#ea580c] mt-6 mb-8 w-24" />

      <EditableDate className="text-sm mb-6" />

      <RecipientBlock className="mb-8" lineClassName="text-sm" />

      <LetterBody paragraphClassName="text-[15px] leading-relaxed" />

      <SignatureBlock nameClassName="text-[#ea580c] font-semibold" />
    </div>
  );
}
