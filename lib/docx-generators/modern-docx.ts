import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

export async function generateModernDOCX(coverLetter: CoverLetter): Promise<Buffer> {
  const { applicant, recipient, content } = coverLetter;
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const yourEmail = applicant.contactInfo.email;
  const yourPhone = applicant.contactInfo.phone;
  const yourAddress = [
    applicant.contactInfo.address.street,
    `${applicant.contactInfo.address.city}, ${applicant.contactInfo.address.state} ${applicant.contactInfo.address.zipCode}`,
  ].filter(Boolean).join(' • ');
  const opening = content.openingParagraph.text;
  const body = content.bodyParagraphs.map((p) => p.text).join('\n\n');
  const closing = content.closingParagraph.text;
  const recipientAddress = [
    recipient.address.street,
    `${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`,
  ].filter(Boolean).join(', ');
  
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        // Header with contact info
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text: yourName, bold: true, size: 32, color: "#2b579a", font: 'Arial' })]
        }),
        
        // Contact info in a single line
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({ text: yourEmail, size: 20, color: "#666666", font: 'Arial' }),
            new TextRun({ text: " • ", size: 20, color: "#999999", font: 'Arial' }),
            new TextRun({ text: yourPhone, size: 20, color: "#666666", font: 'Arial' }),
            new TextRun({ text: " • ", size: 20, color: "#999999", font: 'Arial' }),
            new TextRun({ text: yourAddress, size: 20, color: "#666666", font: 'Arial' }),
          ],
        }),
        
        // Divider
        new Paragraph({
          border: { bottom: { color: "#2b579a", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          spacing: { before: 100, after: 300 },
        }),
        
        // Date
        new Paragraph({
          spacing: { before: 300, after: 200 },
          children: [new TextRun({ text: format(new Date(content.date), 'MMMM d, yyyy'), size: 20, color: '#333333', font: 'Arial' })],
        }),

        // Recipient block
        new Paragraph({
          children: [
            new TextRun({ text: recipient.name, bold: true, size: 22, font: 'Arial' }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: recipient.title, size: 20, font: 'Arial' })] }),
        new Paragraph({ children: [new TextRun({ text: recipient.company, size: 20, font: 'Arial' })] }),
        new Paragraph({ children: [new TextRun({ text: recipientAddress, size: 20, font: 'Arial' })] }),

        // Opening
        new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: opening, bold: true, size: 22, font: 'Arial' })] }),

        // Body
        ...body.split('\n\n').map(
          (para) =>
            new Paragraph({
              spacing: { after: 200 },
              children: [new TextRun({ text: para, size: 20, font: 'Arial' })],
              alignment: AlignmentType.JUSTIFIED,
            })
        ),

        // Closing
        new Paragraph({ spacing: { before: 300, after: 100 }, children: [new TextRun({ text: closing, size: 20, font: 'Arial' })] }),
        new Paragraph({ children: [new TextRun({ text: yourName, bold: true, size: 22, font: 'Arial' })] }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
