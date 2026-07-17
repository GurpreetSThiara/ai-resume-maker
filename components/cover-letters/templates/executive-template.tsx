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
 * Executive — formal serif layout with a centered uppercase header and a
 * double rule. Accent: navy (#1e3a5f).
 */
export function ExecutiveTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="text-gray-900 font-serif p-10">
      {/* Centered header */}
      <div className="text-center mb-2">
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-3xl font-bold uppercase tracking-[0.2em] text-[#1e3a5f] inline-block"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-sm tracking-widest uppercase text-gray-600 mt-1"
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

      {/* Double rule */}
      <div className="border-t-2 border-[#1e3a5f] mb-[2px]" />
      <div className="border-t border-[#1e3a5f] mb-8" />

      <EditableDate className="text-sm mb-6" />

      <RecipientBlock className="mb-8" lineClassName="text-sm" />

      <LetterBody paragraphClassName="text-[15px] leading-relaxed text-justify" />

      <SignatureBlock className="mt-8" nameClassName="text-[#1e3a5f] font-semibold" />
    </div>
  );
}
