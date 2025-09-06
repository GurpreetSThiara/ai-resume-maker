import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

interface TemplateProps {
  coverLetter: CoverLetter;
}

export function ModernTemplate({ coverLetter }: TemplateProps) {
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
    <div className="bg-white text-gray-800 font-sans p-10">
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-1 border-r-2 pr-8 border-gray-200">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-8">{yourName}</h1>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-bold">Address</p>
              <p>{yourAddress}</p>
            </div>
            <div>
              <p className="font-bold">Phone</p>
              <p>{yourPhone}</p>
            </div>
            <div>
              <p className="font-bold">Email</p>
              <p>{yourEmail}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 pl-8">
          <div className="text-right mb-12">
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
      </div>
    </div>
  );
}
