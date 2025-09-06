import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

type Style = {
  font: PDFFont
  boldFont: PDFFont
  baseSize: number
  headingSize: number
  accent?: { r: number; g: number; b: number }
  text: { r: number; g: number; b: number }
  margin: { top: number; right: number; bottom: number; left: number }
  lineGap: number
  headerBar?: boolean
  rightHeader?: boolean
};

function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  size: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.flatMap(l => l.split('\n'));
}

async function getStyle(pdfDoc: PDFDocument, layout: CoverLetter['formatting']['layout']): Promise<Style> {
  const regular = await pdfDoc.embedFont(
    layout === 'modern' || layout === 'minimalist' ? StandardFonts.Helvetica : StandardFonts.TimesRoman
  );
  const bold = await pdfDoc.embedFont(
    layout === 'modern' || layout === 'minimalist' ? StandardFonts.HelveticaBold : StandardFonts.TimesRomanBold
  );

  const base: Omit<Style, 'font' | 'boldFont'> = {
    baseSize: 11,
    headingSize: 13,
    text: { r: 0, g: 0, b: 0 },
    margin: { top: 64, right: 56, bottom: 64, left: 56 },
    lineGap: 4,
  } as const;

  switch (layout) {
    case 'traditional':
      return { ...base, font: regular, boldFont: bold, accent: { r: 0.1, g: 0.1, b: 0.1 }, rightHeader: true };
    case 'modern':
      return {
        ...base,
        baseSize: 11.5,
        headingSize: 15,
        font: regular,
        boldFont: bold,
        accent: { r: 0.13, g: 0.44, b: 0.75 },
        headerBar: true,
      };
    case 'creative':
      return { ...base, baseSize: 12, headingSize: 16, font: regular, boldFont: bold, accent: { r: 0.85, g: 0.3, b: 0.1 }, headerBar: true };
    case 'minimalist':
    default:
      return { ...base, baseSize: 11, headingSize: 13, font: regular, boldFont: bold };
  }
}

function drawLines(
  page: any,
  lines: string[],
  x: number,
  y: number,
  style: Style,
  size?: number,
  bold?: boolean
) {
  const color = rgb(style.text.r, style.text.g, style.text.b);
  const font = bold ? style.boldFont : style.font;
  const lineHeight = (size || style.baseSize) + style.lineGap;
  let yy = y;
  for (const line of lines) {
    page.drawText(line, { x, y: yy, font, size: size || style.baseSize, color });
    yy -= lineHeight;
  }
  return y - yy;
}

export async function generateCoverLetterPDF(coverLetter: CoverLetter): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const style = await getStyle(pdfDoc, coverLetter.formatting.layout);
  const maxTextWidth = width - style.margin.left - style.margin.right;
  let cursorY = height - style.margin.top;

  // Optional header bar
  if (style.headerBar && style.accent) {
    page.drawRectangle({ x: 0, y: height - 36, width, height: 36, color: rgb(style.accent.r, style.accent.g, style.accent.b) });
  }

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

  // Modern template: sidebar layout to match preview
  if (coverLetter.formatting.layout === 'modern') {
    const sidebarWidth = (width - style.margin.left - style.margin.right) * 0.33;
    const gap = 20;
    const contentX = style.margin.left + sidebarWidth + gap;
    const contentWidth = width - style.margin.right - contentX;

    // Sidebar divider
    page.drawLine({
      start: { x: style.margin.left + sidebarWidth, y: style.margin.bottom ?? 64 },
      end: { x: style.margin.left + sidebarWidth, y: height - style.margin.top },
      thickness: 2,
      color: rgb(0.9, 0.9, 0.9),
    });

    // Name in blue in sidebar
    const blue = rgb(0.13, 0.44, 0.75);
    let yLeft = height - style.margin.top;
    page.drawText(yourName, {
      x: style.margin.left,
      y: yLeft,
      font: style.boldFont,
      size: 28,
      color: blue,
    });
    yLeft -= 28 + 8;

    // Labels and values (Address, Phone, Email)
    const labelSize = 11;
    const valSize = 11;
    const sectionGap = 12;
    const drawLabel = (t: string) => {
      page.drawText(t, { x: style.margin.left, y: yLeft, font: style.boldFont, size: labelSize });
      yLeft -= labelSize + 4;
    };
    const drawValue = (t: string) => {
      const vLines = wrapText(t, sidebarWidth, style.font, valSize);
      let tmp = yLeft;
      for (const l of vLines) {
        page.drawText(l, { x: style.margin.left, y: tmp, font: style.font, size: valSize });
        tmp -= valSize + style.lineGap;
      }
      yLeft = tmp - sectionGap;
    };
    drawLabel('Address');
    drawValue(yourAddress || '');
    drawLabel('Phone');
    drawValue(yourPhone || '');
    drawLabel('Email');
    drawValue(yourEmail || '');

    // Right content area
    let yRight = height - style.margin.top;
    // Date (right aligned within content column)
    const dateStr = format(new Date(content.date), 'MMMM d, yyyy');
    const dtw = style.font.widthOfTextAtSize(dateStr, style.baseSize);
    page.drawText(dateStr, { x: contentX + contentWidth - dtw, y: yRight, font: style.font, size: style.baseSize });
    yRight -= style.baseSize + 16;

    // Recipient block
    const rec = recipient;
    const recAddress = [
      rec.address.street,
      `${rec.address.city}, ${rec.address.state} ${rec.address.zipCode}`,
    ].filter(Boolean).join('\n');
    const recLines = [rec.name, rec.title, rec.company, recAddress].filter(Boolean) as string[];
    for (let i = 0; i < recLines.length; i++) {
      const isName = i === 0;
      const text = recLines[i] as string;
      const lines = wrapText(text, contentWidth, isName ? style.boldFont : style.font, style.baseSize);
      for (const l of lines) {
        page.drawText(l, { x: contentX, y: yRight, font: isName ? style.boldFont : style.font, size: style.baseSize });
        yRight -= style.baseSize + style.lineGap;
      }
    }
    yRight -= 12;

    // Opening (bold)
    const openingLines = wrapText(opening, contentWidth, style.boldFont, style.baseSize);
    for (const l of openingLines) {
      page.drawText(l, { x: contentX, y: yRight, font: style.boldFont, size: style.baseSize });
      yRight -= style.baseSize + style.lineGap;
    }
    yRight -= 8;

    // Body (justified effect by standard drawText lines with relaxed leading)
    const bodyParas = body.split(/\n\s*\n/);
    for (const p of bodyParas) {
      const lines = wrapText(p.trim(), contentWidth, style.font, style.baseSize);
      for (const l of lines) {
        page.drawText(l, { x: contentX, y: yRight, font: style.font, size: style.baseSize });
        yRight -= style.baseSize + style.lineGap + 1; // slight relaxed leading
      }
      yRight -= 6;
    }

    // Closing and name
    const closingLines = wrapText(closing, contentWidth, style.font, style.baseSize);
    for (const l of closingLines) {
      page.drawText(l, { x: contentX, y: yRight, font: style.font, size: style.baseSize });
      yRight -= style.baseSize + style.lineGap;
    }
    yRight -= 16;
    page.drawText(yourName, { x: contentX, y: yRight, font: style.boldFont, size: style.baseSize });

    return pdfDoc.save();
  }

  // Header block (default styles)
  if (style.rightHeader) {
    // Right aligned header
    const nameWidth = style.boldFont.widthOfTextAtSize(yourName, style.headingSize);
    page.drawText(yourName, { x: width - style.margin.right - nameWidth, y: cursorY, font: style.boldFont, size: style.headingSize });
    cursorY -= style.headingSize + style.lineGap + 2;

    const headerLines = [yourAddress, yourPhone, yourEmail].filter(Boolean);
    for (const line of headerLines) {
      const tw = style.font.widthOfTextAtSize(line, style.baseSize);
      page.drawText(line, { x: width - style.margin.right - tw, y: cursorY, font: style.font, size: style.baseSize });
      cursorY -= style.baseSize + style.lineGap;
    }
    cursorY -= 12;
  } else {
    // Left header, optionally over bar
    const nameY = style.headerBar ? height - 26 : cursorY;
    const nameX = style.headerBar ? style.margin.left : style.margin.left;
    const color = style.accent ? rgb(style.accent.r, style.accent.g, style.accent.b) : rgb(0, 0, 0);
    page.drawText(yourName, { x: nameX, y: nameY, font: style.boldFont, size: style.headingSize, color });
    if (!style.headerBar) cursorY -= style.headingSize + 10;

    const contact = [yourEmail, yourPhone, yourAddress].filter(Boolean).join(' • ');
    const contactLines = wrapText(contact, maxTextWidth, style.font, style.baseSize);
    cursorY -= drawLines(page, contactLines, style.margin.left, cursorY, style) + 8;
  }

  // Date
  const dateStr = format(new Date(content.date), 'MMMM d, yyyy');
  page.drawText(dateStr, { x: style.margin.left, y: cursorY, font: style.font, size: style.baseSize });
  cursorY -= style.baseSize + style.lineGap + 8;

  // Recipient
  const recAddress = [recipient.address.street, `${recipient.address.city}, ${recipient.address.state} ${recipient.address.zipCode}`].filter(Boolean).join('\n');
  const recLines = [recipient.name, recipient.title, recipient.company, recAddress].filter(Boolean);
  for (const l of recLines) {
    page.drawText(l, { x: style.margin.left, y: cursorY, font: style.font, size: style.baseSize });
    cursorY -= style.baseSize + style.lineGap;
  }
  cursorY -= 6;

  // Opening
  const openingLines = wrapText(opening, maxTextWidth, style.boldFont, style.baseSize);
  cursorY -= drawLines(page, openingLines, style.margin.left, cursorY, style, style.baseSize, true) + 6;

  // Body (wrap by paragraphs)
  const paragraphs = body.split(/\n\s*\n/);
  for (const p of paragraphs) {
    const lines = wrapText(p.trim(), maxTextWidth, style.font, style.baseSize);
    cursorY -= drawLines(page, lines, style.margin.left, cursorY, style) + 8;
  }

  // Closing
  const closingLines = wrapText(closing, maxTextWidth, style.font, style.baseSize);
  cursorY -= drawLines(page, closingLines, style.margin.left, cursorY, style) + 16;

  // Signature
  page.drawText(yourName, { x: style.margin.left, y: cursorY, font: style.boldFont, size: style.baseSize });

  return pdfDoc.save();
}
