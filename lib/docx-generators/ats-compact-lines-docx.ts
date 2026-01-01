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
import { ResumeData, SECTION_TYPES } from '@/types/resume';
import { format } from 'date-fns';

export async function generateATSCompactLinesDOCX({ resumeData, filename = "resume.docx" }: { resumeData: ResumeData; filename?: string }): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,     // 0.5 inch
              right: 720,   // 0.5 inch
              bottom: 720,  // 0.5 inch
              left: 720,    // 0.5 inch
            },
          },
        },
        children: [
          // Header - Name
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: resumeData.basics.name || '',
                bold: true,
                size: 22,
                color: "000000",
              }),
            ],
          }),

          // Contact Info
          new Paragraph({
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: [
                  resumeData.basics.email,
                  resumeData.basics.phone,
                  resumeData.basics.location,
                  resumeData.basics.linkedin
                ].filter(Boolean).join(' | '),
                size: 18,
                color: "666666",
              }),
            ],
          }),

          // Summary
          ...(resumeData.basics.summary ? [
            new Paragraph({
              spacing: { before: 0, after: 200 },
              children: [
                new TextRun({
                  text: resumeData.basics.summary,
                  size: 18,
                  color: "000000",
                }),
              ],
            }),
          ] : []),

          // Custom Details
          ...(Object.entries(resumeData.custom || {})
            .filter(([_, item]: any) => !item?.hidden)
            .map(([_, item]) =>
              new Paragraph({
                spacing: { before: 0, after: 100 },
                children: [
                  new TextRun({
                    text: `${item.title}: ${item.content}`,
                    size: 18,
                    color: item.link ? "0000FF" : "000000",
                  }),
                ],
              })
            )),

          // Sections
          ...resumeData.sections.flatMap(section => {
            if ((section as any).hidden) return [];

            let hasContent = false;
            if ('items' in (section as any) && Array.isArray((section as any).items)) {
              if ([SECTION_TYPES.EDUCATION, SECTION_TYPES.EXPERIENCE, SECTION_TYPES.PROJECTS].includes(section.type as any)) {
                hasContent = (section as any).items.length > 0;
              } else if ([SECTION_TYPES.SKILLS, SECTION_TYPES.LANGUAGES, SECTION_TYPES.CERTIFICATIONS].includes(section.type as any)) {
                hasContent = (section as any).items.filter((s: string) => s && s.trim()).length > 0;
              }
            } else if ('content' in (section as any) && Array.isArray((section as any).content)) {
              hasContent = (section as any).content.some((t: string) => t && t.trim() !== '');
            }
            if (!hasContent) return [];

            const sectionChildren: Paragraph[] = [];

            // Section Title
            sectionChildren.push(
              new Paragraph({
                spacing: { before: 200, after: 100 },
                children: [
                  new TextRun({
                    text: section.title,
                    bold: true,
                    size: 20,
                    color: "000000",
                  }),
                ],
              })
            );

            // Divider line
            sectionChildren.push(
              new Paragraph({
                spacing: { before: 0, after: 100 },
                border: {
                  bottom: {
                    color: "CCCCCC",
                    size: 1,
                    style: BorderStyle.SINGLE,
                  },
                },
                children: [
                  new TextRun({ text: "" }),
                ],
              })
            );

            // Section Content
            switch (section.type) {
              case SECTION_TYPES.EDUCATION:
                for (const edu of (section as any).items) {
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 100, after: 50 },
                      children: [
                        new TextRun({
                          text: edu.institution,
                          bold: true,
                          size: 18,
                          color: "000000",
                        }),
                      ],
                    })
                  );
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 0, after: 50 },
                      children: [
                        new TextRun({
                          text: edu.degree,
                          size: 18,
                          color: "000000",
                        }),
                      ],
                    })
                  );
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 0, after: 100 },
                      children: [
                        new TextRun({
                          text: `${edu.startDate} - ${edu.endDate}${edu.location ? ` • ${edu.location}` : ''}`,
                          size: 16,
                          color: "666666",
                        }),
                      ],
                    })
                  );
                  if (edu.highlights?.length) {
                    for (const highlight of edu.highlights) {
                      sectionChildren.push(
                        new Paragraph({
                          spacing: { before: 0, after: 50 },
                          children: [
                            new TextRun({
                              text: `• ${highlight}`,
                              size: 18,
                              color: "000000",
                            }),
                          ],
                        })
                      );
                    }
                  }
                }
                break;

              case SECTION_TYPES.EXPERIENCE:
                for (const exp of (section as any).items) {
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 100, after: 50 },
                      children: [
                        new TextRun({
                          text: exp.company,
                          bold: true,
                          size: 18,
                          color: "000000",
                        }),
                      ],
                    })
                  );
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 0, after: 50 },
                      children: [
                        new TextRun({
                          text: exp.role,
                          size: 18,
                          color: "000000",
                        }),
                      ],
                    })
                  );
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 0, after: 100 },
                      children: [
                        new TextRun({
                          text: `${exp.startDate} - ${exp.endDate}${exp.location ? ` • ${exp.location}` : ''}`,
                          size: 16,
                          color: "666666",
                        }),
                      ],
                    })
                  );
                  if (exp.achievements?.length) {
                    for (const achievement of exp.achievements) {
                      sectionChildren.push(
                        new Paragraph({
                          spacing: { before: 0, after: 50 },
                          children: [
                            new TextRun({
                              text: `• ${achievement}`,
                              size: 18,
                              color: "000000",
                            }),
                          ],
                        })
                      );
                    }
                  }
                }
                break;

              case SECTION_TYPES.SKILLS:
              case SECTION_TYPES.LANGUAGES:
              case SECTION_TYPES.CERTIFICATIONS:
                if ((section as any).items?.length) {
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 100, after: 200 },
                      children: [
                        new TextRun({
                          text: (section as any).items.join(" • "),
                          size: 18,
                          color: "000000",
                        }),
                      ],
                    })
                  );
                }
                break;

              case SECTION_TYPES.PROJECTS:
                for (const proj of (section as any).items) {
                  sectionChildren.push(
                    new Paragraph({
                      spacing: { before: 100, after: 50 },
                      children: [
                        new TextRun({
                          text: proj.name,
                          bold: true,
                          size: 18,
                          color: "000000",
                        }),
                      ],
                    })
                  );
                  if (proj.link || proj.repo) {
                    const links = [];
                    if (proj.link) links.push(`Link: ${proj.link}`);
                    if (proj.repo) links.push(`GitHub: ${proj.repo}`);
                    sectionChildren.push(
                      new Paragraph({
                        spacing: { before: 0, after: 50 },
                        children: [
                          new TextRun({
                            text: links.join(" | "),
                            size: 16,
                            color: "0000FF",
                            underline: { type: UnderlineType.SINGLE },
                          }),
                        ],
                      })
                    );
                  }
                  if (Array.isArray(proj.description)) {
                    for (const d of proj.description) {
                      sectionChildren.push(
                        new Paragraph({
                          spacing: { before: 0, after: 50 },
                          children: [
                            new TextRun({
                              text: `• ${d}`,
                              size: 18,
                              color: "000000",
                            }),
                          ],
                        })
                      );
                    }
                  }
                }
                break;

              case SECTION_TYPES.CUSTOM:
                if ((section as any).content?.length) {
                  for (const text of (section as any).content) {
                    sectionChildren.push(
                      new Paragraph({
                        spacing: { before: 0, after: 50 },
                        children: [
                          new TextRun({
                            text: `• ${text}`,
                            size: 18,
                            color: "000000",
                          }),
                        ],
                      })
                    );
                  }
                }
                break;
            }

            return sectionChildren;
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
