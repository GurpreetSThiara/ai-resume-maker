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
 * Monogram — centered layout crowned by a circular initials monogram and a
 * thin single rule. Accent: rose (#9f1239).
 */
export function MonogramTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, initials, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="p-10 font-sans text-gray-900">
      {/* Centered monogram header */}
      <div className="text-center mb-2">
        <div className="w-16 h-16 rounded-full bg-[#9f1239] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          {initials}
        </div>
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-2xl font-bold tracking-wide inline-block"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-sm text-gray-600 mt-1"
          />
        )}
        <div className="flex flex-wrap justify-center gap-x-3 text-sm text-gray-600 mt-2">
          {contact.phone && (
            <EditableText
              as="span"
              value={contact.phone}
              onCommit={(v) => setContactField('phone', v)}
            />
          )}
          {contact.phone && contact.email && <span className="text-gray-400">•</span>}
          {contact.email && (
            <EditableText
              as="span"
              value={contact.email}
              onCommit={(v) => setContactField('email', v)}
            />
          )}
          {contact.email && contact.linkedin && <span className="text-gray-400">•</span>}
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

      {/* Thin single rule */}
      <div className="border-t border-[#9f1239] my-8" />

      <EditableDate className="text-sm mb-6" />

      <RecipientBlock className="mb-8" lineClassName="text-sm" />

      <LetterBody paragraphClassName="text-[15px] leading-relaxed" />

      <SignatureBlock className="mt-8" nameClassName="text-[#9f1239] font-semibold" />
    </div>
  );
}
