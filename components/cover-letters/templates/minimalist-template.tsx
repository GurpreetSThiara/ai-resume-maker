import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

interface TemplateProps {
  coverLetter: CoverLetter;
}

export function MinimalistTemplate({ coverLetter }: TemplateProps) {
  const { applicant , recipient , content } = coverLetter;
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const yourEmail = applicant.contactInfo.email;
  const yourPhone = applicant.contactInfo.phone;
  const yourAddress = applicant.contactInfo.address;
  const opening = content.openingParagraph.text;
  const body = content.bodyParagraphs.map(p => p.text).join('\n\n');
  const closing = content.closingParagraph.text;
  const recipientAddress = recipient.address;

  return (
    <div className="bg-white text-gray-900 font-helvetica p-12">
      <div className="flex justify-between items-start mb-16">
        <div>
          <h1 className="text-2xl font-bold tracking-wider">{yourName}</h1>
        </div>
        <div className="text-right text-xs space-y-1">
          <p>{yourAddress}</p>
          <p>{yourPhone}</p>
          <p>{yourEmail}</p>
        </div>
      </div>

      {(recipient.name || recipient.title || recipient.company || recipient.address) && (
        <div className="mb-12 text-sm">
          {recipient.name && <p className="font-bold">{recipient.name}</p>}
          {recipient.title && <p>{recipient.title}</p>}
          {recipient.company && <p>{recipient.company}</p>}
          {recipient.address && <p className="whitespace-pre-line">{recipient.address}</p>}
          <p className="mt-4">{format(new Date(content.date), 'dd MMMM yyyy')}</p>
        </div>
      )}

      <div className="mb-8">
        <p className="font-bold text-base mb-4">{opening}</p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-justify">{body}</p>
      </div>

      <div className="mt-12 text-sm">
        <p>{closing}</p>
        <p className="mt-8">{yourName}</p>
      </div>
    </div>
  );
}
