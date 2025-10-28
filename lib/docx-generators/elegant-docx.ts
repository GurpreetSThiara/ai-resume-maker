import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

export async function generateElegantDOCX(coverLetter: CoverLetter): Promise<Buffer> {
  const { applicant, recipient, content } = coverLetter;
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const yourEmail = applicant.contactInfo.email;
  const yourPhone = applicant.contactInfo.phone;
  const yourAddress = [
    applicant.contactInfo.address.street,
    `${applicant.contactInfo.address.city}, ${applicant.contactInfo.address.state} ${applicant.contactInfo.address.zipCode}`,
  ].filter(Boolean).join(' ');
  const opening = content.openingParagraph.text;
  const body = content.bodyParagraphs.map((p) => p.text).join('\n\n');
  const closing = content.closingParagraph.text;

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1800, right: 1440, bottom: 1800, left: 1440 } } },
      children: [
        // Header with name and title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: yourName.toUpperCase(),
              bold: true,
              size: 24,
              font: 'Georgia',
              color: "#2c3e50"
            }),
          ],
        }),
        
        // Contact info in a single line with small dividers
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: yourAddress,
              size: 18,
              font: 'Georgia',
              color: "#7f8c8d"
            }),
            new TextRun({
              text: "  •  ",
              size: 18,
              font: 'Georgia',
              color: "#bdc3c7"
            }),
            new TextRun({
              text: yourPhone,
              size: 18,
              font: 'Georgia',
              color: "#7f8c8d"
            }),
            new TextRun({
              text: "  •  ",
              size: 18,
              font: 'Georgia',
              color: "#bdc3c7"
            }),
            new TextRun({
              text: yourEmail,
              size: 18,
              font: 'Georgia',
              color: "#7f8c8d"
            })
          ],
        }),

        // Date
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: format(new Date(), 'MMMM d, yyyy'),
              size: 18,
              font: 'Georgia',
            }),
          ],
        }),

        // Recipient info
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: recipient.name,
              size: 18,
              font: 'Georgia',
            }),
          ],
        }),
        ...(recipient.title ? [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: recipient.title,
                size: 18,
                font: 'Georgia',
              }),
            ],
          })
        ] : []),
        ...(recipient.company ? [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: recipient.company,
                size: 18,
                font: 'Georgia',
              }),
            ],
          })
        ] : []),
        ...(recipient.address ? [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `${recipient.address.street}, ${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`,
                size: 18,
                font: 'Georgia',
              }),
            ],
          })
        ] : []),

        // Opening
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: opening,
              size: 18,
              font: 'Georgia',
            }),
          ],
        }),

        // Body
        ...body.split('\n\n').map(paragraph => 
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { line: 280, before: 0, after: 200 },
            indent: { firstLine: 360 },
            children: [
              new TextRun({
                text: paragraph,
                size: 18,
                font: 'Georgia',
              }),
            ],
          })
        ),

        // Closing
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: closing,
              size: 18,
              font: 'Georgia',
            }),
          ],
        }),

        // Signature
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 800 },
          children: [
            new TextRun({
              text: yourName,
              bold: true,
              size: 18,
              font: 'Georgia',
            }),
          ],
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
