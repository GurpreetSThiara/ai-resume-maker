import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import type { PDFGenerationOptions } from "@/types/resume";
import { SECTION_TYPES } from "@/types/resume";
import { getSectionsForRendering } from "@/utils/sectionOrdering";
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills";
import { createLink, hasSectionContent } from "./utils";

export async function generateClassicDOCX({
  resumeData,
  filename = "resume.docx",
  variant = "default",
}: PDFGenerationOptions & { variant?: "default" | "compact" }): Promise<Buffer> {
  const isCompact = variant === "compact";

  // Margins and styling matching the PDF generator
  const marginSize = isCompact ? 576 : 720; // 0.4inch vs 0.5inch
  const textColor = "262626"; // Dark gray #262626
  const secondaryColor = "666666"; // Medium gray
  const linkColor = "0000FF";
  
  const nameSize = isCompact ? 36 : 40; // 18pt vs 20pt
  const contactSize = isCompact ? 18 : 22; // 9pt vs 11pt
  const summarySize = isCompact ? 18 : 22; // 9pt vs 11pt
  const sectionTitleSize = isCompact ? 24 : 28; // 12pt vs 14pt (uppercase)
  
  const instSize = isCompact ? 20 : 24; // 10pt vs 12pt
  const roleSize = isCompact ? 18 : 20; // 9pt vs 10pt
  const dateSize = isCompact ? 18 : 20; // 9pt vs 10pt
  const bulletSize = isCompact ? 18 : 20; // 9pt vs 10pt

  const docChildren: (Paragraph | Table)[] = [];

  // Name
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: isCompact ? 120 : 160 },
      children: [
        new TextRun({
          text: resumeData.basics.name || '',
          bold: true,
          size: nameSize,
          color: textColor,
          font: "Arial",
        }),
      ],
    })
  );

  // Contact Info
  const { email, phone, location, linkedin } = resumeData.basics;
  const contactItems = [email, phone, location, linkedin].filter(Boolean);
  if (contactItems.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { after: isCompact ? 80 : 120 },
        children: [
          new TextRun({
            text: contactItems.join(" | "),
            size: contactSize,
            color: secondaryColor,
            font: "Arial",
          }),
        ],
      })
    );
  }

  // Summary
  if (resumeData.basics.summary) {
    docChildren.push(
      new Paragraph({
        spacing: { after: isCompact ? 80 : 120 },
        children: [
          new TextRun({
            text: resumeData.basics.summary,
            size: summarySize,
            color: textColor,
            font: "Arial",
          }),
        ],
      })
    );
  }

  // Sections
  const orderedSections = getSectionsForRendering(resumeData.sections, resumeData.custom);

  for (const section of orderedSections) {
    if (section.type === 'custom-fields') {
      const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]: any) => !item?.hidden);

      if (customEntries.length > 0) {
        const rows = [];
        for (let i = 0; i < customEntries.length; i += 2) {
            const leftEntry = customEntries[i];
            const rightEntry = customEntries[i + 1];

            const createCell = (entry: any) => {
              if (!entry) {
                return new TableCell({ children: [], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } });
              }
              const [key, item] = entry;
              const titleText = item.title ? `${item.title.toUpperCase()}: ` : '';
              const paragraphChildren = [
                new TextRun({ text: titleText, bold: true, size: summarySize, color: textColor, font: "Arial" }),
              ];
              
              if (item.link) {
                 paragraphChildren.push(createLink(item.content || "", item.content || "", summarySize, linkColor) as any);
              } else {
                 paragraphChildren.push(new TextRun({ text: item.content || "", size: summarySize, color: textColor, font: "Arial" }));
              }
              
              return new TableCell({
                children: [new Paragraph({ children: paragraphChildren, spacing: { after: 100 } })],
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 50, type: WidthType.PERCENTAGE }
              });
            };

            rows.push(new TableRow({ children: [createCell(leftEntry), createCell(rightEntry)] }));
        }

        docChildren.push(
            new Table({
              rows,
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            })
        );
        docChildren.push(new Paragraph({ spacing: { after: isCompact ? 80 : 120 } }));
      }
      continue;
    }

    if (!hasSectionContent(section)) continue;

    // Section Title
    docChildren.push(
      new Paragraph({
        spacing: { before: isCompact ? 120 : 160, after: isCompact ? 80 : 120 },
        children: [
          new TextRun({
            text: section.title ? section.title.toUpperCase() : '',
            bold: true,
            size: sectionTitleSize,
            color: textColor,
            font: "Arial",
          }),
        ],
      })
    );

    // Section Content
    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of (section as any).items) {
          const eduDates = `${edu.startDate} - ${edu.endDate}`;
          
          docChildren.push(
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: edu.institution, bold: true, size: instSize, color: textColor, font: "Arial" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 70, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [new TextRun({ text: eduDates, size: dateSize, color: secondaryColor, font: "Arial" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 30, type: WidthType.PERCENTAGE }
                    })
                  ]
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            })
          );
          
          const roleLocationString = edu.location ? `${edu.degree} • ${edu.location}` : edu.degree;
          docChildren.push(
            new Paragraph({
              spacing: { before: 40, after: 60 },
              children: [
                new TextRun({ text: roleLocationString || '', size: roleSize, color: textColor, font: "Arial" }),
              ],
            })
          );

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: 60 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${highlight}`, size: bulletSize, color: textColor, font: "Arial" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: isCompact ? 60 : 100 } }));
        }
        break;

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of (section as any).items) {
          const expDates = `${exp.startDate} - ${exp.endDate}`;
          
          docChildren.push(
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: exp.company, bold: true, size: instSize, color: textColor, font: "Arial" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 70, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [new TextRun({ text: expDates, size: dateSize, color: secondaryColor, font: "Arial" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 30, type: WidthType.PERCENTAGE }
                    })
                  ]
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            })
          );
          
          const roleLocationString = exp.location ? `${exp.role} • ${exp.location}` : exp.role;
          docChildren.push(
            new Paragraph({
              spacing: { before: 40, after: 60 },
              children: [
                new TextRun({ text: roleLocationString || '', size: roleSize, color: textColor, font: "Arial" }),
              ],
            })
          );

          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: 60 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${achievement}`, size: bulletSize, color: textColor, font: "Arial" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: isCompact ? 60 : 100 } }));
        }
        break;

      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section as any);
        const visibleGroups = groups.filter(g => g.skills.length > 0);
        
        for (const group of visibleGroups) {
          docChildren.push(
            new Paragraph({
              spacing: { after: isCompact ? 60 : 100 },
              children: [
                new TextRun({ text: `${group.title}: `, bold: true, size: summarySize, color: textColor, font: "Arial" }),
                new TextRun({ text: group.skills.join(', '), size: summarySize, color: textColor, font: "Arial" }),
              ],
            })
          );
        }
        break;
      }

      case SECTION_TYPES.LANGUAGES:
      case SECTION_TYPES.CERTIFICATIONS:
        if ((section as any).items?.length) {
          docChildren.push(
            new Paragraph({
              spacing: { after: isCompact ? 60 : 100 },
              children: [
                new TextRun({ text: (section as any).items.join(" • "), size: summarySize, color: textColor, font: "Arial" }),
              ],
            })
          );
        }
        break;

      case SECTION_TYPES.PROJECTS:
        for (const proj of (section as any).items) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: proj.name, bold: true, size: instSize, color: textColor, font: "Arial" }),
              ],
            })
          );
          
          if (proj.link || proj.repo) {
             const paragraphChildren = [];
             if (proj.link) {
                 paragraphChildren.push(new TextRun({ text: "Demo: ", bold: true, size: dateSize, color: secondaryColor, font: "Arial" }));
                 paragraphChildren.push(createLink(proj.link as unknown as string, proj.link as unknown as string, dateSize, linkColor) as any);
             }
             if (proj.repo) {
                 if (paragraphChildren.length > 0) {
                     paragraphChildren.push(new TextRun({ text: "  |  ", size: dateSize, color: secondaryColor, font: "Arial" }));
                 }
                 paragraphChildren.push(new TextRun({ text: "Github: ", bold: true, size: dateSize, color: secondaryColor, font: "Arial" }));
                 paragraphChildren.push(createLink(proj.repo as unknown as string, proj.repo as unknown as string, dateSize, linkColor) as any);
             }
             docChildren.push(new Paragraph({
                 spacing: { before: 20, after: 60 },
                 children: paragraphChildren
             }));
          }

          if (Array.isArray(proj.description)) {
            for (const d of proj.description) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: 60 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${d}`, size: bulletSize, color: textColor, font: "Arial" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: isCompact ? 60 : 100 } }));
        }
        break;

      case SECTION_TYPES.CUSTOM:
        if ((section as any).content?.length) {
          for (const text of (section as any).content) {
            docChildren.push(
              new Paragraph({
                spacing: { after: 60 },
                indent: { left: 360 },
                children: [
                  new TextRun({ text: `• ${text}`, size: bulletSize, color: textColor, font: "Arial" }),
                ],
              })
            );
          }
          docChildren.push(new Paragraph({ spacing: { after: isCompact ? 60 : 100 } }));
        }
        break;
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: marginSize,
              right: marginSize,
              bottom: marginSize,
              left: marginSize,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
