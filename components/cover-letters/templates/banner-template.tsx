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
 * Banner — full-width dark banner header with white text, followed by a
 * classic letter layout. Accent: slate (#334155).
 */
export function BannerTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="text-gray-900 font-sans h-full flex flex-col">
      {/* Dark banner header */}
      <div className="bg-[#334155] text-white px-10 py-8">
        <EditableText
          as="h1"
          value={fullName}
          onCommit={setFullName}
          className="text-3xl font-bold text-white inline-block focus:ring-white/50"
        />
        {applicant.professionalTitle && (
          <EditableText
            value={applicant.professionalTitle}
            onCommit={(v) => setApplicantField('professionalTitle', v)}
            className="text-slate-300 mt-1 focus:ring-white/50"
          />
        )}
        <div className="flex flex-wrap gap-x-3 text-sm text-slate-300 mt-3">
          {contact.phone && (
            <EditableText
              as="span"
              value={contact.phone}
              onCommit={(v) => setContactField('phone', v)}
              className="focus:ring-white/50"
            />
          )}
          {contact.phone && contact.email && <span className="text-slate-500">|</span>}
          {contact.email && (
            <EditableText
              as="span"
              value={contact.email}
              onCommit={(v) => setContactField('email', v)}
              className="focus:ring-white/50"
            />
          )}
          {contact.email && contact.linkedin && <span className="text-slate-500">|</span>}
          {contact.linkedin && (
            <EditableText
              as="span"
              value={contact.linkedin}
              onCommit={(v) => setContactField('linkedin', v)}
              className="focus:ring-white/50"
            />
          )}
        </div>
        {contact.address && (
          <EditableText
            value={contact.address}
            onCommit={(v) => setContactField('address', v)}
            className="text-sm text-slate-300 mt-1 whitespace-pre-line focus:ring-white/50"
          />
        )}
      </div>

      {/* Letter content */}
      <div className="px-10 py-8 flex-1">
        <EditableDate className="text-sm mb-6" />

        <RecipientBlock className="mb-8" lineClassName="text-sm" />

        <LetterBody paragraphClassName="text-[15px] leading-relaxed" />

        <SignatureBlock className="mt-8" nameClassName="text-[#334155] font-semibold" />
      </div>
    </div>
  );
}
