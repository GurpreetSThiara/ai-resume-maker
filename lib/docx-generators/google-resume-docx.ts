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

export async function generateGoogleDOCX({
  resumeData,
  filename = "resume.docx",
  variant = "default",
}: PDFGenerationOptions & { variant?: "default" | "black_compact" }): Promise<Buffer> {
  const isBlackCompact = variant === "black_compact";

  // Margins and styling matching the PDF generator
  const marginSize = isBlackCompact ? 576 : 720; // 0.4inch vs 0.5inch
  const accentColor = isBlackCompact ? "000000" : "2666A6"; // Black vs Blue
  const textColor = "1A1A1A";
  const secondaryColor = "595959"; // rgb(0.35, 0.35, 0.35)
  const linkColor = "0000FF";
  
  const nameSize = isBlackCompact ? 36 : 40; // 18pt vs 20pt
  const contactSize = isBlackCompact ? 18 : 20; // 9pt vs 10pt
  const summarySize = isBlackCompact ? 18 : 20; // 9pt vs 10pt
  const sectionTitleSize = isBlackCompact ? 26 : 28; // 13pt vs 14pt
  
  const instSize = isBlackCompact ? 20 : 22; // 10pt vs 11pt
  const roleSize = isBlackCompact ? 18 : 20; // 9pt vs 10pt
  const dateSize = isBlackCompact ? 16 : 18; // 8pt vs 9pt
  const bulletSize = isBlackCompact ? 18 : 20; // 9pt vs 10pt

  const docChildren: (Paragraph | Table)[] = [];

  // Name
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: isBlackCompact ? 120 : 160 },
      children: [
        new TextRun({
          text: resumeData.basics.name || '',
          bold: true,
          size: nameSize,
          color: accentColor,
          font: "Helvetica",
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
        spacing: { after: isBlackCompact ? 160 : 200 },
        children: [
          new TextRun({
            text: contactItems.join(" | "),
            size: contactSize,
            color: secondaryColor,
            font: "Helvetica",
          }),
        ],
      })
    );
  }

  // Summary
  if (resumeData.basics.summary) {
    docChildren.push(
      new Paragraph({
        spacing: { after: isBlackCompact ? 200 : 240 },
        children: [
          new TextRun({
            text: resumeData.basics.summary,
            size: summarySize,
            color: textColor,
            font: "Helvetica",
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
        if (isBlackCompact) {
          // 2-column layout using Table
          const rows = [];
          for (let i = 0; i < customEntries.length; i += 2) {
            const leftEntry = customEntries[i];
            const rightEntry = customEntries[i + 1];

            const createCell = (entry: any) => {
              if (!entry) {
                return new TableCell({ children: [], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } });
              }
              const [key, item] = entry;
              const paragraphChildren = [
                new TextRun({ text: `${item.title}: `, bold: true, size: summarySize, color: textColor, font: "Helvetica" }),
              ];
              
              if (item.link) {
                 paragraphChildren.push(createLink(item.content || "", item.content || "", summarySize, linkColor) as any);
              } else {
                 paragraphChildren.push(new TextRun({ text: item.content || "", size: summarySize, color: textColor, font: "Helvetica" }));
              }
              
              return new TableCell({
                children: [new Paragraph({ children: paragraphChildren, spacing: { after: 120 } })],
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
          docChildren.push(new Paragraph({ spacing: { after: isBlackCompact ? 120 : 160 } }));

        } else {
          // Normal flex-wrap layout mapping to paragraphs
          for (const [key, item] of customEntries) {
             const paragraphChildren = [
                new TextRun({ text: `${item.title}: `, bold: true, size: summarySize, color: textColor, font: "Helvetica" }),
             ];
             if (item.link) {
                 paragraphChildren.push(createLink(item.content || "", item.content || "", summarySize, linkColor) as any);
             } else {
                 paragraphChildren.push(new TextRun({ text: item.content || "", size: summarySize, color: textColor, font: "Helvetica" }));
             }

             docChildren.push(new Paragraph({
                children: paragraphChildren,
                spacing: { after: 120 }
             }));
          }
          docChildren.push(new Paragraph({ spacing: { after: 160 } }));
        }
      }
      continue;
    }

    if (!hasSectionContent(section)) continue;

    // Section Title
    docChildren.push(
      new Paragraph({
        spacing: { before: isBlackCompact ? 160 : 200, after: 60 },
        children: [
          new TextRun({
            text: section.title,
            bold: true,
            size: sectionTitleSize,
            color: accentColor,
            font: "Helvetica",
          }),
        ],
        border: {
          bottom: {
            color: isBlackCompact ? "CCCCCC" : accentColor,
            space: 1,
            style: BorderStyle.SINGLE,
            size: isBlackCompact ? 6 : 12,
          },
        },
      })
    );

    // Section Content
    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of (section as any).items) {
          docChildren.push(
            new Paragraph({
              spacing: { before: isBlackCompact ? 120 : 160, after: 40 },
              children: [
                new TextRun({ text: edu.institution, bold: true, size: instSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
          docChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: edu.degree, size: roleSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
          const eduDates = `${edu.startDate} - ${edu.endDate}${edu.location ? ` • ${edu.location}` : ''}`;
          docChildren.push(
            new Paragraph({
              spacing: { after: isBlackCompact ? 120 : 160 },
              children: [
                new TextRun({ text: eduDates, size: dateSize, color: secondaryColor, font: "Helvetica" }),
              ],
            })
          );

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: isBlackCompact ? 80 : 120 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${highlight}`, size: bulletSize, color: textColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
        }
        break;

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of (section as any).items) {
          docChildren.push(
            new Paragraph({
              spacing: { before: isBlackCompact ? 120 : 160, after: 40 },
              children: [
                new TextRun({ text: exp.company, bold: true, size: instSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
          docChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({ text: exp.role, size: roleSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
          const expDates = `${exp.startDate} - ${exp.endDate}${exp.location ? ` • ${exp.location}` : ''}`;
          docChildren.push(
            new Paragraph({
              spacing: { after: isBlackCompact ? 120 : 160 },
              children: [
                new TextRun({ text: expDates, size: dateSize, color: secondaryColor, font: "Helvetica" }),
              ],
            })
          );

          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: isBlackCompact ? 80 : 120 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${achievement}`, size: bulletSize, color: textColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
        }
        break;

      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section as any);
        const visibleGroups = groups.filter(g => g.skills.length > 0);
        
        for (const group of visibleGroups) {
          docChildren.push(
            new Paragraph({
              spacing: { before: isBlackCompact ? 80 : 120, after: isBlackCompact ? 80 : 120 },
              children: [
                new TextRun({ text: `${group.title}: `, bold: true, size: summarySize, color: textColor, font: "Helvetica" }),
                new TextRun({ text: group.skills.join(', '), size: summarySize, color: textColor, font: "Helvetica" }),
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
              spacing: { before: isBlackCompact ? 120 : 160, after: isBlackCompact ? 120 : 160 },
              children: [
                new TextRun({ text: (section as any).items.join(" • "), size: summarySize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
        }
        break;

      case SECTION_TYPES.PROJECTS:
        for (const proj of (section as any).items) {
          docChildren.push(
            new Paragraph({
              spacing: { before: isBlackCompact ? 120 : 160, after: 40 },
              children: [
                new TextRun({ text: proj.name, bold: true, size: instSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
          
          if (proj.link || proj.repo) {
             const paragraphChildren = [];
             if (proj.link) {
                 paragraphChildren.push(new TextRun({ text: "Live demo: ", bold: true, size: dateSize, color: textColor, font: "Helvetica" }));
                 paragraphChildren.push(createLink(proj.link as unknown as string, proj.link as unknown as string, dateSize, linkColor) as any);
             }
             if (proj.repo) {
                 if (paragraphChildren.length > 0) {
                     paragraphChildren.push(new TextRun({ text: " | ", size: dateSize, color: textColor, font: "Helvetica" }));
                 }
                 paragraphChildren.push(new TextRun({ text: "Github: ", bold: true, size: dateSize, color: textColor, font: "Helvetica" }));
                 paragraphChildren.push(createLink(proj.repo as unknown as string, proj.repo as unknown as string, dateSize, linkColor) as any);
             }
             docChildren.push(new Paragraph({
                 spacing: { after: isBlackCompact ? 80 : 120 },
                 children: paragraphChildren
             }));
          }

          if (Array.isArray(proj.description)) {
            for (const d of proj.description) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: isBlackCompact ? 80 : 120 },
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `• ${d}`, size: bulletSize, color: textColor, font: "Helvetica" }),
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
            docChildren.push(
              new Paragraph({
                spacing: { after: isBlackCompact ? 80 : 120 },
                indent: { left: 360 },
                children: [
                  new TextRun({ text: `• ${text}`, size: bulletSize, color: textColor, font: "Helvetica" }),
                ],
              })
            );
          }
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
