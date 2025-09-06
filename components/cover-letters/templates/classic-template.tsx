import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

interface TemplateProps {
  coverLetter: CoverLetter;
}

export function ClassicTemplate({ coverLetter }: TemplateProps) {
  const { applicant, recipient, content } = coverLetter;
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const yourEmail = applicant.contactInfo.email;
  const yourPhone = applicant.contactInfo.phone;
  const yourAddress = [
    applicant.contactInfo.address.street,
    `${applicant.contactInfo.address.city}, ${applicant.contactInfo.address.state} ${applicant.contactInfo.address.zipCode}`,
    applicant.contactInfo.address.country,
  ].filter(Boolean).join(' | ');
  const opening = content.openingParagraph.text;
  const body = content.bodyParagraphs.map(p => p.text).join('\n\n');
  const closing = content.closingParagraph.text;
  const recipientAddress = [
    recipient.address.street,
    `${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`,
  ].filter(Boolean).join('\n');

  return (
    <div className="bg-white text-gray-800 font-serif p-12">
      <div className="text-right mb-12">
        <h1 className="text-3xl font-bold mb-2">{yourName}</h1>
        <p>{yourAddress}</p>
        <p>{yourPhone}</p>
        <p>{yourEmail}</p>
      </div>

      <div className="mb-8">
        <p>{format(new Date(content.date), 'MMMM d, yyyy')}</p>
      </div>

      <div className="mb-8">
        <p className="font-bold">{recipient.name}</p>
        <p>{recipient.title}</p>
        <p>{recipient.company}</p>
        <p className="whitespace-pre-line">{recipientAddress}</p>
      </div>

      <div className="mb-8">
        <p className="font-bold mb-4">{opening}</p>
        <p className="whitespace-pre-line text-justify leading-relaxed">{body}</p>
      </div>

      <div>
        <p>{closing}</p>
        <p className="mt-8 font-bold">{yourName}</p>
      </div>
    </div>
  );
}
