import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  PageOrientation,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

type DocxStyle = {
  font: string
  baseSize: number // half-points in docx TextRun
  headingSize: number // half-points
  accent?: string
  rightHeader?: boolean
  headerBar?: boolean
  spacing: { before: number; after: number; line: number }
  page: { margin: { top: number; right: number; bottom: number; left: number } }
};

const layoutStyles: Record<CoverLetter['formatting']['layout'], DocxStyle> = {
  traditional: {
    font: 'Times New Roman',
    baseSize: 22,
    headingSize: 28,
    rightHeader: true,
    spacing: { before: 80, after: 80, line: 360 },
    page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
  },
  modern: {
    font: 'Helvetica',
    baseSize: 22,
    headingSize: 30,
    headerBar: true,
    accent: '2A70BF',
    spacing: { before: 60, after: 80, line: 360 },
    page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
  },
  creative: {
    font: 'Helvetica',
    baseSize: 24,
    headingSize: 32,
    headerBar: true,
    accent: 'D84D1A',
    spacing: { before: 60, after: 80, line: 360 },
    page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
  },
  minimalist: {
    font: 'Helvetica',
    baseSize: 22,
    headingSize: 26,
    spacing: { before: 80, after: 80, line: 360 },
    page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
  },
};

function p(text: string, opts?: Partial<{ align: any; bold: boolean; size: number; color: string; spacing: { before: number; after: number; line: number }; font: string }>) {
  return new Paragraph({
    alignment: opts?.align,
    spacing: opts?.spacing,
    children: [
      new TextRun({ text, bold: !!opts?.bold, size: opts?.size, color: opts?.color, font: opts?.font }),
    ],
  });
}

function spacer(height: number = 120) {
  return new Paragraph({ spacing: { before: height, after: 0 } });
}

function buildDoc(coverLetter: CoverLetter) {
  const s = layoutStyles[coverLetter.formatting.layout] ?? layoutStyles.minimalist;
  const { applicant, recipient, content } = coverLetter;
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const yourEmail = applicant.contactInfo.email;
  const yourPhone = applicant.contactInfo.phone;
  const yourAddress = [
    applicant.contactInfo.address.street,
    `${applicant.contactInfo.address.city}, ${applicant.contactInfo.address.state} ${applicant.contactInfo.address.zipCode}`,
    applicant.contactInfo.address.country,
  ].filter(Boolean).join(' • ');
  const opening = content.openingParagraph.text;
  const body = content.bodyParagraphs.map(p => p.text).join('\n\n');
  const closing = content.closingParagraph.text;

  // Modern: build a two-column table (1/3 + 2/3) to mirror sidebar layout
  if (coverLetter.formatting.layout === 'modern') {
    const blue = '1D4ED8'; // Tailwind blue-700
    const leftCell = new TableCell({
      width: { size: 33, type: WidthType.PERCENTAGE },
      borders: { right: { style: BorderStyle.SINGLE, size: 8, color: 'E5E7EB' } }, // gray-200 divider
      children: [
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: yourName, bold: true, size: 56, color: blue, font: s.font })],
        }),
        new Paragraph({ children: [new TextRun({ text: 'Address', bold: true, size: s.baseSize, font: s.font })] }),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: yourAddress || '', size: s.baseSize, font: s.font })] }),
        new Paragraph({ children: [new TextRun({ text: 'Phone', bold: true, size: s.baseSize, font: s.font })] }),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: yourPhone || '', size: s.baseSize, font: s.font })] }),
        new Paragraph({ children: [new TextRun({ text: 'Email', bold: true, size: s.baseSize, font: s.font })] }),
        new Paragraph({ children: [new TextRun({ text: yourEmail || '', size: s.baseSize, font: s.font })] }),
      ],
    });

    // Right column content
    const rightChildren: Paragraph[] = [];
    rightChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 240 },
        children: [new TextRun({ text: format(new Date(content.date), 'MMMM d, yyyy'), size: s.baseSize, font: s.font })],
      })
    );
    rightChildren.push(
      p(recipient.name, { bold: true, size: s.baseSize, font: s.font }),
      p(recipient.title, { size: s.baseSize, font: s.font }),
      p(recipient.company, { size: s.baseSize, font: s.font }),
      p([
        recipient.address.street,
        `${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`,
      ].filter(Boolean).join('\n'), { size: s.baseSize, font: s.font, spacing: { before: 0, after: 200, line: s.spacing.line } }),
    );
    rightChildren.push(p(opening, { bold: true, size: s.baseSize, font: s.font, spacing: { before: 0, after: 160, line: s.spacing.line } }));
    body.split(/\n\s*\n/).forEach(par => {
      rightChildren.push(p(par.trim(), { align: AlignmentType.JUSTIFIED, size: s.baseSize, font: s.font, spacing: { before: 0, after: 160, line: s.spacing.line } }));
    });
    rightChildren.push(p(closing, { size: s.baseSize, font: s.font, spacing: { before: 0, after: 240, line: s.spacing.line } }));
    rightChildren.push(p(yourName, { bold: true, size: s.baseSize, font: s.font }));

    const rightCell = new TableCell({
      width: { size: 67, type: WidthType.PERCENTAGE },
      children: rightChildren,
    });

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: [leftCell, rightCell] })],
    });

    return new Document({
      sections: [
        {
          properties: { page: { margin: s.page.margin, size: { orientation: PageOrientation.PORTRAIT } } },
          children: [table],
        },
      ],
    });
  }

  const headerChildren: Paragraph[] = [];

  if (s.headerBar && s.accent) {
    headerChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: ' ', shading: { type: 'clear', fill: s.accent }, size: 2 }),
        ],
      })
    );
  }

  if (s.rightHeader) {
    headerChildren.push(
      p(yourName, { align: AlignmentType.RIGHT, bold: true, size: s.headingSize, font: s.font }),
      p(yourAddress, { align: AlignmentType.RIGHT, size: s.baseSize, font: s.font }),
      p(yourPhone, { align: AlignmentType.RIGHT, size: s.baseSize, font: s.font }),
      p(yourEmail, { align: AlignmentType.RIGHT, size: s.baseSize, font: s.font }),
      spacer(200),
    );
  } else {
    headerChildren.push(
      p(yourName, { bold: true, size: s.headingSize, font: s.font, color: s.accent }),
      p([yourEmail, yourPhone, yourAddress].filter(Boolean).join(' • '), { size: s.baseSize, font: s.font, spacing: { before: 40, after: 200, line: s.spacing.line } }),
    );
  }

  const bodyParagraphs: Paragraph[] = [];
  bodyParagraphs.push(p(format(new Date(content.date), 'MMMM d, yyyy'), { size: s.baseSize, font: s.font, spacing: { before: 0, after: 160, line: s.spacing.line } }));

  bodyParagraphs.push(
    p(recipient.name, { bold: true, size: s.baseSize, font: s.font }),
    p(recipient.title, { size: s.baseSize, font: s.font }),
    p(recipient.company, { size: s.baseSize, font: s.font }),
    p([
      recipient.address.street,
      `${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`,
    ].filter(Boolean).join('\n'), { size: s.baseSize, font: s.font, spacing: { before: 0, after: 160, line: s.spacing.line } }),
  );

  bodyParagraphs.push(p(opening, { bold: true, size: s.baseSize, font: s.font, spacing: { before: 0, after: 160, line: s.spacing.line } }));

  body.split(/\n\s*\n/).forEach(par => {
    bodyParagraphs.push(p(par.trim(), { align: AlignmentType.JUSTIFIED, size: s.baseSize, font: s.font, spacing: { before: 0, after: 160, line: s.spacing.line } }));
  });

  bodyParagraphs.push(p(closing, { size: s.baseSize, font: s.font, spacing: { before: 0, after: 240, line: s.spacing.line } }));
  bodyParagraphs.push(p(yourName, { bold: true, size: s.baseSize, font: s.font }));

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: s.page.margin, size: { orientation: PageOrientation.PORTRAIT } } },
        children: [...headerChildren, ...bodyParagraphs],
      },
    ],
  });

  return doc;
}

export async function generateCoverLetterDOCX(coverLetter: CoverLetter): Promise<Blob> {
  const doc = buildDoc(coverLetter);
  // Use toBlob for browser compatibility (client-side downloads)
  const blob = await Packer.toBlob(doc);
  return blob;
}
