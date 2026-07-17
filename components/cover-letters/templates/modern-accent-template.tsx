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
 * Modern Accent — clean sans-serif layout with a bold vertical accent bar
 * down the left edge of the page. Accent: teal (#0d9488).
 */
export function ModernAccentTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="flex h-full text-gray-900 font-sans">
      {/* Vertical accent bar */}
      <div className="w-2 bg-[#0d9488] shrink-0" />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <EditableText
            as="h1"
            value={fullName}
            onCommit={setFullName}
            className="text-3xl font-bold tracking-tight inline-block"
          />
          {applicant.professionalTitle && (
            <EditableText
              value={applicant.professionalTitle}
              onCommit={(v) => setApplicantField('professionalTitle', v)}
              className="text-[#0d9488] font-medium mt-1"
            />
          )}
          <div className="flex flex-wrap gap-x-3 text-sm text-gray-600 mt-2">
            {contact.phone && (
              <EditableText
                as="span"
                value={contact.phone}
                onCommit={(v) => setContactField('phone', v)}
              />
            )}
            {contact.phone && contact.email && <span className="text-gray-400">·</span>}
            {contact.email && (
              <EditableText
                as="span"
                value={contact.email}
                onCommit={(v) => setContactField('email', v)}
              />
            )}
            {contact.email && contact.linkedin && <span className="text-gray-400">·</span>}
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

        <EditableDate className="text-sm mb-6" />

        <RecipientBlock className="mb-8" lineClassName="text-sm" />

        <LetterBody paragraphClassName="text-[15px] leading-relaxed" />

        <SignatureBlock className="mt-8" nameClassName="text-[#0d9488] font-semibold" />
      </div>
    </div>
  );
}
