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
 * Sidebar — two-column layout with a colored sidebar holding the name and
 * contact details, letter content on the right. Accent: blue (#1e40af).
 */
export function SidebarTemplate(_props: CoverLetterTemplateProps) {
  const { applicant, fullName, setFullName, setApplicantField, setContactField } =
    useTemplateFields();
  const contact = applicant.contactInfo;

  return (
    <div className="flex h-full font-sans text-gray-900">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0 bg-[#1e40af] text-white p-6 space-y-6">
        <div>
          <EditableText
            as="h1"
            value={fullName}
            onCommit={setFullName}
            className="text-2xl font-bold leading-tight focus:ring-white/50"
          />
          {applicant.professionalTitle && (
            <EditableText
              value={applicant.professionalTitle}
              onCommit={(v) => setApplicantField('professionalTitle', v)}
              className="text-blue-200 text-sm mt-1 focus:ring-white/50"
            />
          )}
        </div>

        <div>
          <h2 className="uppercase text-xs tracking-wider text-blue-200 mb-2">Contact</h2>
          <div className="space-y-1">
            {contact.phone && (
              <EditableText
                value={contact.phone}
                onCommit={(v) => setContactField('phone', v)}
                className="text-sm focus:ring-white/50"
              />
            )}
            {contact.email && (
              <EditableText
                value={contact.email}
                onCommit={(v) => setContactField('email', v)}
                className="text-sm focus:ring-white/50"
              />
            )}
            {contact.linkedin && (
              <EditableText
                value={contact.linkedin}
                onCommit={(v) => setContactField('linkedin', v)}
                className="text-sm focus:ring-white/50"
              />
            )}
            {contact.address && (
              <EditableText
                value={contact.address}
                onCommit={(v) => setContactField('address', v)}
                className="text-sm whitespace-pre-line focus:ring-white/50"
              />
            )}
          </div>
        </div>
      </div>

      {/* Letter content */}
      <div className="flex-1 p-8">
        <EditableDate className="text-sm mb-6" />

        <RecipientBlock className="mb-8" lineClassName="text-sm" />

        <LetterBody paragraphClassName="text-[15px] leading-relaxed" />

        <SignatureBlock className="mt-8" nameClassName="text-[#1e40af] font-semibold" />
      </div>
    </div>
  );
}
