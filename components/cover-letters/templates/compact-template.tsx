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
 * Compact — space-efficient ATS-friendly layout with tight spacing and a
 * single contact line. Accent: green (#15803d).
 */
export function CompactTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="p-6 font-sans text-gray-900 text-sm">
      {/* Compact header */}
      <div>
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-lg font-bold inline-block border-b-2 border-[#15803d] pb-0.5"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-xs text-gray-600 mt-1"
          />
        )}
        <div className="flex flex-wrap gap-x-2 text-xs text-gray-600 mt-1">
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
          {contact.linkedin && contact.address && <span className="text-gray-400">|</span>}
          {contact.address && (
            <EditableText
              as="span"
              value={contact.address}
              onCommit={(v) => setContactField('address', v)}
            />
          )}
        </div>
      </div>

      <EditableDate className="text-xs mt-4 mb-3" />

      <RecipientBlock className="mb-4" lineClassName="text-xs leading-snug" />

      <LetterBody className="space-y-2" paragraphClassName="text-[13px] leading-snug" />

      <SignatureBlock className="mt-4" />
    </div>
  );
}
