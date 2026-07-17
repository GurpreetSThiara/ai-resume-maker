'use client';

import type { CoverLetter } from '@/types/cover-letter';
import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { format } from 'date-fns';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface CoverLetterTemplateProps {
  coverLetter: CoverLetter;
  editable?: boolean;
}

type EditableTag = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3';

interface EditableTextProps {
  value: string;
  onCommit: (value: string) => void;
  as?: EditableTag;
  className?: string;
}

/**
 * Inline-editable text element. Commits the plain-text content on blur,
 * matching the contentEditable pattern used across cover letter templates.
 */
export function EditableText({ value, onCommit, as = 'p', className }: EditableTextProps) {
  const Tag = as;
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onCommit(e.currentTarget.textContent || '')}
      className={cn('outline-none focus:ring-2 focus:ring-blue-300 rounded px-1', className)}
    >
      {value}
    </Tag>
  );
}

/** Click-to-edit letter date, backed by content.date. */
export function EditableDate({ className }: { className?: string }) {
  const { state, updateContent } = useCoverLetter();
  const [isEditing, setIsEditing] = useState(false);
  const date = state.coverLetter.content.date;

  if (isEditing) {
    return (
      <Input
        type="date"
        defaultValue={format(new Date(date), 'yyyy-MM-dd')}
        onBlur={(e) => {
          if (e.target.value) updateContent({ date: new Date(e.target.value) });
          setIsEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
        className="text-sm w-40"
        autoFocus
      />
    );
  }

  return (
    <p
      onClick={() => setIsEditing(true)}
      className={cn('cursor-pointer hover:bg-gray-50 rounded px-1', className)}
    >
      {format(new Date(date), 'MMMM d, yyyy')}
    </p>
  );
}

/**
 * Field handlers + derived values shared by every cover letter template.
 * Templates read live data from context (the `coverLetter` prop is kept for
 * API compatibility but context is the source of truth).
 */
export function useTemplateFields() {
  const { state, updateCoverLetter, updateContent } = useCoverLetter();
  const coverLetter = state.coverLetter;
  const { applicant, recipient, content } = coverLetter;

  const setApplicantField = (field: string, value: string) =>
    updateCoverLetter({ applicant: { ...applicant, [field]: value } });

  const setContactField = (field: string, value: string) =>
    updateCoverLetter({
      applicant: {
        ...applicant,
        contactInfo: { ...applicant.contactInfo, [field]: value },
      },
    });

  const setRecipientField = (field: string, value: string) =>
    updateCoverLetter({ recipient: { ...recipient, [field]: value } });

  const setContentField = (field: keyof CoverLetter['content'], value: unknown) =>
    updateContent({ [field]: value });

  const setOpening = (text: string) =>
    updateContent({ openingParagraph: { ...content.openingParagraph, text } });

  const setClosing = (text: string) =>
    updateContent({ closingParagraph: { ...content.closingParagraph, text } });

  const setBodyParagraph = (index: number, text: string) => {
    const updated = [...content.bodyParagraphs];
    updated[index] = { ...updated[index], text };
    updateContent({ bodyParagraphs: updated });
  };

  /** Commits a full name string by splitting into first/last. */
  const setFullName = (value: string) => {
    const names = value.split(' ');
    updateCoverLetter({
      applicant: {
        ...applicant,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
      },
    });
  };

  const fullName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const initials = `${applicant.firstName.charAt(0)}${applicant.lastName.charAt(0)}`.toUpperCase();

  return {
    coverLetter,
    applicant,
    recipient,
    content,
    fullName,
    initials,
    setApplicantField,
    setContactField,
    setRecipientField,
    setContentField,
    setOpening,
    setClosing,
    setBodyParagraph,
    setFullName,
  };
}

/** Recipient block (name / title / company / address) with per-line styling hooks. */
export function RecipientBlock({
  className,
  lineClassName,
  nameClassName,
}: {
  className?: string;
  lineClassName?: string;
  nameClassName?: string;
}) {
  const { recipient, setRecipientField } = useTemplateFields();
  if (!recipient.name && !recipient.title && !recipient.company && !recipient.address) return null;

  return (
    <div className={className}>
      {recipient.name && (
        <EditableText
          value={recipient.name}
          onCommit={(v) => setRecipientField('name', v)}
          className={cn('font-medium', lineClassName, nameClassName)}
        />
      )}
      {recipient.title && (
        <EditableText
          value={recipient.title}
          onCommit={(v) => setRecipientField('title', v)}
          className={lineClassName}
        />
      )}
      {recipient.company && (
        <EditableText
          value={recipient.company}
          onCommit={(v) => setRecipientField('company', v)}
          className={lineClassName}
        />
      )}
      {recipient.address && (
        <EditableText
          value={recipient.address}
          onCommit={(v) => setRecipientField('address', v)}
          className={cn('whitespace-pre-line', lineClassName)}
        />
      )}
    </div>
  );
}

/** Salutation + opening + body paragraphs + closing, with shared editing handlers. */
export function LetterBody({
  className,
  paragraphClassName,
}: {
  className?: string;
  paragraphClassName?: string;
}) {
  const { content, setContentField, setOpening, setClosing, setBodyParagraph } =
    useTemplateFields();

  return (
    <div className={cn('space-y-4', className)}>
      {content.salutation && (
        <EditableText
          value={content.salutation}
          onCommit={(v) => setContentField('salutation', v)}
          className={paragraphClassName}
        />
      )}
      <EditableText
        value={content.openingParagraph.text}
        onCommit={setOpening}
        className={cn('whitespace-pre-wrap', paragraphClassName)}
      />
      {content.bodyParagraphs.map((para, idx) => (
        <EditableText
          key={para.id}
          value={para.text}
          onCommit={(v) => setBodyParagraph(idx, v)}
          className={cn('whitespace-pre-wrap', paragraphClassName)}
        />
      ))}
      <EditableText
        value={content.closingParagraph.text}
        onCommit={setClosing}
        className={cn('whitespace-pre-wrap', paragraphClassName)}
      />
    </div>
  );
}

/** Complimentary close + signature name. */
export function SignatureBlock({
  className,
  nameClassName,
}: {
  className?: string;
  nameClassName?: string;
}) {
  const { content, fullName, setContentField, setFullName } = useTemplateFields();
  return (
    <div className={cn('mt-6', className)}>
      <EditableText
        value={content.complimentaryClose || 'Sincerely,'}
        onCommit={(v) => setContentField('complimentaryClose', v)}
      />
      <EditableText
        value={fullName}
        onCommit={setFullName}
        className={cn('mt-4 font-medium inline-block', nameClassName)}
      />
    </div>
  );
}
