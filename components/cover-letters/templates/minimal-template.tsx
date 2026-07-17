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
 * Minimal — understated grayscale minimalism with generous whitespace and a
 * single hairline rule. No accent color.
 */
export function MinimalTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="p-12 font-sans text-gray-800">
      {/* Understated header */}
      <div>
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-xl font-medium tracking-wide inline-block"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-sm text-gray-500 mt-1"
          />
        )}
        <div className="flex flex-wrap gap-x-2 text-xs text-gray-500 mt-2">
          {contact.phone && (
            <EditableText
              as="span"
              value={contact.phone}
              onCommit={(v) => setContactField('phone', v)}
            />
          )}
          {contact.phone && contact.email && <span className="text-gray-400">/</span>}
          {contact.email && (
            <EditableText
              as="span"
              value={contact.email}
              onCommit={(v) => setContactField('email', v)}
            />
          )}
          {contact.email && contact.linkedin && <span className="text-gray-400">/</span>}
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
            className="text-xs text-gray-500 mt-1 whitespace-pre-line"
          />
        )}
      </div>

      {/* Hairline rule */}
      <div className="border-t border-gray-300 mt-6 mb-10" />

      <EditableDate className="text-sm text-gray-500 mb-8" />

      <RecipientBlock className="mb-10" lineClassName="text-sm text-gray-600" />

      <LetterBody paragraphClassName="text-sm leading-loose" />

      <SignatureBlock className="mt-10" />
    </div>
  );
}
