import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

interface TemplateProps {
  coverLetter: CoverLetter;
}

export function CreativeTemplate({ coverLetter }: TemplateProps) {
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
    <div className="bg-white text-gray-800 font-helvetica p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gray-100 z-0"></div>
      <div className="relative z-10 grid grid-cols-3 gap-8">
        <div className="col-span-1 pr-8">
          <h1 className="text-5xl font-black text-gray-800 leading-none mb-12">{yourName}</h1>
          <div className="space-y-4 text-sm">
            <div className="flex items-center">
              <span className="font-black mr-2">A:</span>
              <span>{yourAddress}</span>
            </div>
            <div className="flex items-center">
              <span className="font-black mr-2">P:</span>
              <span>{yourPhone}</span>
            </div>
            <div className="flex items-center">
              <span className="font-black mr-2">E:</span>
              <span>{yourEmail}</span>
            </div>
          </div>
        </div>

        <div className="col-span-2 pl-8">
          <div className="text-right mb-12">
            <p className="font-bold text-lg">{format(new Date(content.date), 'yyyy-MM-dd')}</p>
          </div>
          {(recipient.name || recipient.title || recipient.company || recipient.address) && (
            <div className="mb-8">
              {recipient.name && <p className="font-bold text-xl">{recipient.name}</p>}
              {recipient.title && <p>{recipient.title}</p>}
              {recipient.company && <p>{recipient.company}</p>}
              {recipient.address && <p className="whitespace-pre-line">{recipient.address}</p>}
            </div>
          )}

          <div className="mb-8">
            <p className="font-bold text-2xl mb-4">{opening}</p>
            <p className="whitespace-pre-line text-justify leading-relaxed">{body}</p>
          </div>

          <div>
            <p className="text-lg">{closing}</p>
            <p className="mt-8 text-3xl font-extrabold">{yourName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
