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
 * Letterhead — classic stationery layout with a centered uppercase header
 * and a full-width rule. Accent: charcoal (#111827).
 */
export function LetterheadTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="p-10 pt-12 font-serif text-gray-900">
      {/* Centered letterhead */}
      <div className="text-center">
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-2xl font-bold tracking-[0.15em] uppercase inline-block"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-sm text-gray-600 tracking-widest uppercase mt-1"
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
          {contact.email && contact.address && <span className="text-gray-400">•</span>}
          {contact.address && (
            <EditableText
              as="span"
              value={contact.address}
              onCommit={(v) => setContactField('address', v)}
            />
          )}
        </div>
      </div>

      {/* Full-width single rule */}
      <div className="border-t border-gray-900 mt-5 mb-10" />

      <EditableDate className="text-sm mb-6" />

      <RecipientBlock className="mb-8" lineClassName="text-sm" />

      <LetterBody paragraphClassName="text-[15px] leading-relaxed" />

      <SignatureBlock className="mt-8" />
    </div>
  );
}
