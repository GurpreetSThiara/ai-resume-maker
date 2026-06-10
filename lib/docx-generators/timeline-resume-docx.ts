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

export async function generateTimelineDOCX({
  resumeData,
  filename = "resume.docx",
}: PDFGenerationOptions): Promise<Buffer> {
  
  // Colors and Typography
  const textColor = "2D3748"; 
  const headingColor = "1A202C";
  const secondaryColor = "4A5568";
  const accentColor = "4299E1"; // Timeline line, links
  
  const nameSize = 48; // 24pt
  const contactSize = 20; // 10pt
  const sectionTitleSize = 28; // 14pt (bold, uppercase)
  const instSize = 24; // 12pt (bold)
  const roleSize = 20; // 10pt
  const dateSize = 18; // 9pt
  const contentSize = 20; // 10pt

  const docChildren: (Paragraph | Table)[] = [];

  // Name
  if (resumeData.basics.name) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resumeData.basics.name,
            bold: true,
            size: nameSize,
            color: headingColor,
            font: "Arial",
          }),
        ],
      })
    );
  }

  // Contact Info
  const { email, phone, location, linkedin } = resumeData.basics;
  const contactItems = [email, phone, location, linkedin].filter(Boolean);
  if (contactItems.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactItems.join(" • "),
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
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: resumeData.basics.summary,
            size: contentSize,
            color: textColor,
            font: "Arial",
          }),
        ],
      })
    );
  }

  // Helper for timeline items (Table with left border)
  const createTimelineItem = (children: Paragraph[]) => {
      return new Table({
          rows: [
              new TableRow({
                  children: [
                      new TableCell({
                          children: children,
                          borders: {
                              top: { style: BorderStyle.NONE },
                              bottom: { style: BorderStyle.NONE },
                              right: { style: BorderStyle.NONE },
                              left: { style: BorderStyle.SINGLE, size: 12, color: accentColor, space: 15 }, // The timeline line
                          },
                          margins: { left: 100 }, // Padding inside the timeline box
                      })
                  ]
              })
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE }, // The outer table has no default borders
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE }
          },
      });
  };

  // Sections
  const orderedSections = getSectionsForRendering(resumeData.sections, resumeData.custom);

  for (const section of orderedSections) {
    if (section.type === 'custom-fields') {
      const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]: any) => !item?.hidden);

      if (customEntries.length > 0) {
        // Just bold keys and values
        for (const [key, item] of customEntries) {
             const paragraphChildren = [
                new TextRun({ text: `${item.title}: `, bold: true, size: contentSize, color: headingColor, font: "Arial" }),
             ];
             if (item.link) {
                 paragraphChildren.push(createLink(item.content || "", item.content || "", contentSize, accentColor) as any);
             } else {
                 paragraphChildren.push(new TextRun({ text: item.content || "", size: contentSize, color: textColor, font: "Arial" }));
             }

             docChildren.push(new Paragraph({
                children: paragraphChildren,
                spacing: { after: 120 }
             }));
        }
        docChildren.push(new Paragraph({ spacing: { after: 80 } }));
      }
      continue;
    }

    if (!hasSectionContent(section)) continue;

    // Section Title
    docChildren.push(
      new Paragraph({
        spacing: { before: 160, after: 120 },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: sectionTitleSize,
            color: headingColor,
            font: "Arial",
          }),
        ],
        border: {
          bottom: {
            color: "E2E8F0",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    // Section Content
    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of (section as any).items) {
          const itemChildren: Paragraph[] = [];
          
          itemChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: edu.institution, bold: true, size: instSize, color: headingColor, font: "Arial" }),
              ],
            })
          );
          
          const midLine = `${edu.degree}${edu.location ? ` | ${edu.location}` : ''}`;
          itemChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: midLine, size: roleSize, color: textColor, font: "Arial" }),
              ],
            })
          );
          
          const eduDates = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
          if (eduDates) {
            itemChildren.push(
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: eduDates, size: dateSize, color: secondaryColor, font: "Arial" }),
                ],
              })
            );
          }

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              itemChildren.push(
                new Paragraph({
                  spacing: { after: 60 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${highlight}`, size: contentSize, color: textColor, font: "Arial" }),
                  ],
                })
              );
            }
          }
          itemChildren.push(new Paragraph({ spacing: { after: 60 } })); // Bottom padding for item box
          
          docChildren.push(createTimelineItem(itemChildren));
          docChildren.push(new Paragraph({ spacing: { after: 120 } })); // Gap between timeline items
        }
        break;

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of (section as any).items) {
          const itemChildren: Paragraph[] = [];
          
          itemChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: exp.company, bold: true, size: instSize, color: headingColor, font: "Arial" }),
              ],
            })
          );
          
          const midLine = `${exp.role}${exp.location ? ` | ${exp.location}` : ''}`;
          itemChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: midLine, size: roleSize, color: textColor, font: "Arial" }),
              ],
            })
          );
          
          const expDates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
          if (expDates) {
            itemChildren.push(
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: expDates, size: dateSize, color: secondaryColor, font: "Arial" }),
                ],
              })
            );
          }

          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              itemChildren.push(
                new Paragraph({
                  spacing: { after: 60 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${achievement}`, size: contentSize, color: textColor, font: "Arial" }),
                  ],
                })
              );
            }
          }
          itemChildren.push(new Paragraph({ spacing: { after: 60 } }));
          
          docChildren.push(createTimelineItem(itemChildren));
          docChildren.push(new Paragraph({ spacing: { after: 120 } }));
        }
        break;

      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section as any);
        const visibleGroups = groups.filter(g => g.skills.length > 0);
        
        for (const group of visibleGroups) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: `${group.title}: `, bold: true, size: contentSize, color: headingColor, font: "Arial" }),
                new TextRun({ text: group.skills.join(', '), size: contentSize, color: textColor, font: "Arial" }),
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
              spacing: { after: 120 },
              children: [
                new TextRun({ text: (section as any).items.join(" • "), size: contentSize, color: textColor, font: "Arial" }),
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
                new TextRun({ text: proj.name, bold: true, size: instSize, color: headingColor, font: "Arial" }),
              ],
            })
          );
          
          if (proj.link || proj.repo) {
             const paragraphChildren = [];
             if (proj.link) {
                 paragraphChildren.push(new TextRun({ text: "Demo: ", size: dateSize, color: secondaryColor, font: "Arial" }));
                 paragraphChildren.push(createLink(proj.link as unknown as string, proj.link as unknown as string, dateSize, accentColor) as any);
             }
             if (proj.repo) {
                 if (paragraphChildren.length > 0) {
                     paragraphChildren.push(new TextRun({ text: "  |  ", size: dateSize, color: secondaryColor, font: "Arial" }));
                 }
                 paragraphChildren.push(new TextRun({ text: "GitHub: ", size: dateSize, color: secondaryColor, font: "Arial" }));
                 paragraphChildren.push(createLink(proj.repo as unknown as string, proj.repo as unknown as string, dateSize, accentColor) as any);
             }
             docChildren.push(new Paragraph({
                 spacing: { before: 20, after: 80 },
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
                    new TextRun({ text: `• ${d}`, size: contentSize, color: textColor, font: "Arial" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: 120 } }));
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
                  new TextRun({ text: `• ${text}`, size: contentSize, color: textColor, font: "Arial" }),
                ],
              })
            );
          }
          docChildren.push(new Paragraph({ spacing: { after: 120 } }));
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
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
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
