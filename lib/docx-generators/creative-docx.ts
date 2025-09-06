import { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopPosition, TabStopType, BorderStyle } from 'docx';
import { CoverLetter } from '@/types/cover-letter';
import { format } from 'date-fns';

export async function generateCreativeDOCX(coverLetter: CoverLetter): Promise<Buffer> {
  const { content } = coverLetter;
  const { yourName, yourEmail, yourPhone, yourAddress, recipient, opening, body, closing } = content;

  // Create a colored sidebar
  const createSidebar = () => {
    return new Paragraph({
      border: {
        left: {
          color: "#3498db",
          space: 15,
          style: BorderStyle.SINGLE,
          size: 24,
        },
      },
      spacing: { left: 600 },
      children: [],
    });
  };

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        // Header with name and title
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: yourName.toUpperCase(),
              bold: true,
              size: 28,
              color: "#2c3e50",
              font: 'Helvetica',
            }),
          ],
        }),
        
        // Job title/role
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: "CREATIVE PROFESSIONAL",
              size: 14,
              color: "#7f8c8d",
              font: 'Helvetica',
              bold: true,
              allCaps: true,
            }),
          ],
        }),

        // Contact info in a clean layout
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: yourEmail,
              size: 16,
              color: "#2c3e50",
              font: 'Helvetica',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: yourPhone,
              size: 16,
              color: "#2c3e50",
              font: 'Helvetica',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: yourAddress,
              size: 16,
              color: "#2c3e50",
              font: 'Helvetica',
            }),
          ],
        }),

        // Date
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: format(new Date(), 'MMMM d, yyyy'),
              size: 14,
              font: 'Helvetica',
              color: "#7f8c8d"
            }),
          ],
        }),

        // Recipient info with sidebar
        createSidebar(),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: -200, after: 100 },
          children: [
            new TextRun({
              text: recipient.name,
              bold: true,
              size: 16,
              font: 'Helvetica',
            }),
          ],
        }),
        ...(recipient.position ? [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: recipient.position,
                size: 14,
                font: 'Helvetica',
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
                size: 14,
                font: 'Helvetica',
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
                text: recipient.address,
                size: 14,
                font: 'Helvetica',
              }),
            ],
          })
        ] : []),

        // Opening with sidebar
        createSidebar(),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: -200, after: 200 },
          children: [
            new TextRun({
              text: opening,
              size: 14,
              font: 'Helvetica',
            }),
          ],
        }),

        // Body with sidebars for each paragraph
        ...body.split('\n\n').map((paragraph, index) => (
          [
            createSidebar(),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: -200, after: 200, line: 280 },
              children: [
                new TextRun({
                  text: paragraph,
                  size: 14,
                  font: 'Helvetica',
                }),
              ],
            })
          ]
        )).flat(),

        // Closing with sidebar
        createSidebar(),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: -200, after: 200 },
          children: [
            new TextRun({
              text: closing,
              size: 14,
              font: 'Helvetica',
            }),
          ],
        }),

        // Signature with sidebar
        createSidebar(),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: -200, after: 200 },
          children: [
            new TextRun({
              text: yourName,
              bold: true,
              size: 14,
              font: 'Helvetica',
            }),
          ],
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
