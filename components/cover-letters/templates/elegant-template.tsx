import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

interface TemplateProps {
  coverLetter: CoverLetter;
}

export function ElegantTemplate({ coverLetter }: TemplateProps) {
  const { applicant, recipient, content, formatting } = coverLetter;
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const yourEmail = applicant.contactInfo.email;
  const yourPhone = applicant.contactInfo.phone;
  const yourAddress = applicant.contactInfo.address;
  const opening = content.openingParagraph.text;
  const body = content.bodyParagraphs.map(p => p.text).join('\n\n');
  const closing = content.closingParagraph.text;
  const recipientAddress = recipient.address;

  return (
    <div className="bg-white text-gray-700 font-helvetica p-12 max-w-4xl mx-auto border-t-8 border-b-8 border-gray-800">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-widest uppercase mb-2">{yourName}</h1>
        <p className="text-sm tracking-widest">{yourAddress} | {yourPhone} | {yourEmail}</p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 text-right">
          <p className="font-bold">Date</p>
          <p className="font-bold mt-4">To</p>
        </div>
        <div className="col-span-3">
          <p>{format(new Date(content.date), 'MMMM d, yyyy')}</p>
          <div className="mt-4">
            {(recipient.name || recipient.title || recipient.company || recipient.address) && (
              <>
                {recipient.name && <p className="font-bold">{recipient.name}</p>}
                {recipient.title && <p>{recipient.title}</p>}
                {recipient.company && <p>{recipient.company}</p>}
                {recipient.address && <p className="whitespace-pre-line">{recipient.address}</p>}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-300 pt-8">
        <p className="font-bold text-lg mb-4">{opening}</p>
        <p className="whitespace-pre-line text-justify leading-loose">{body}</p>
      </div>

      <div className="mt-12 text-right">
        <p>{closing}</p>
        <p className="mt-12 text-2xl font-bold">{yourName}</p>
      </div>
    </div>
  );
}
