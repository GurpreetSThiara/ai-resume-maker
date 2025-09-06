import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Spacing,
  BorderStyle,
  Table,
  TableCell,
  TableRow,
  WidthType,
  UnderlineType,
  TabStopPosition,
  TabStopType,
} from 'docx';
import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

export async function generateClassicDOCX(coverLetter: CoverLetter): Promise<Buffer> {
  const { content } = coverLetter;
  const { yourName, yourEmail, yourPhone, yourAddress, recipient, opening, body, closing } = content;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1440,   // 1 inch
            },
          },
        },
        children: [
          // Header with contact info (right-aligned)
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: yourName,
                bold: true,
                size: 28,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: yourAddress,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: yourPhone,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: yourEmail,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          // Date
          new Paragraph({
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: format(new Date(), 'MMMM d, yyyy'),
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          // Recipient Info
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: recipient.name,
                bold: true,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),
          ...(recipient.position ? [
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: recipient.position,
                  size: 22,
                  font: 'Times New Roman',
                }),
              ],
            })
          ] : []),
          ...(recipient.company ? [
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: recipient.company,
                  size: 22,
                  font: 'Times New Roman',
                }),
              ],
            })
          ] : []),
          ...(recipient.address ? [
            new Paragraph({
              spacing: { after: 400 },
              children: [
                new TextRun({
                  text: recipient.address,
                  size: 22,
                  font: 'Times New Roman',
                }),
              ],
            })
          ] : []),

          // Opening
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: opening,
                bold: true,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          // Body (split into paragraphs)
          ...body.split('\n\n').map(paragraph => 
            new Paragraph({
              spacing: { line: 300, before: 0, after: 200 },
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({
                  text: paragraph,
                  size: 22,
                  font: 'Times New Roman',
                }),
              ],
            })
          ),

          // Closing
          new Paragraph({
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: closing,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),

          // Signature
          new Paragraph({
            spacing: { before: 800 },
            children: [
              new TextRun({
                text: yourName,
                bold: true,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
