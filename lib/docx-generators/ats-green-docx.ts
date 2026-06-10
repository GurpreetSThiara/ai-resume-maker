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
  ShadingType,
} from 'docx';
import type { PDFGenerationOptions } from "@/types/resume";
import { SECTION_TYPES } from "@/types/resume";
import { getSectionsForRendering } from "@/utils/sectionOrdering";
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills";
import { createLink, hasSectionContent } from "./utils";

export async function generateATSGreenDOCX({
  resumeData,
  filename = "resume.docx",
  theme = "green",
}: PDFGenerationOptions & { theme?: "green" | "yellow" }): Promise<Buffer> {
  
  // Colors and Typography
  const isYellow = theme === "yellow";
  const headerFill = isYellow ? "FAEFA6" : "BFDCBF"; // Hex strings for DOCX shading
  const textColor = "0D0D0D"; 
  const linkColor = "0000B3";
  const bulletColor = "4D4D4D";
  
  const nameSize = 40; // 20pt
  const contactSize = 20; // 10pt
  const sectionTitleSize = 24; // 12pt
  const contentSize = 20; // 10pt
  const smallSize = 18; // 9pt

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
            color: textColor,
            font: "Helvetica",
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
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: contactItems.join(" • "),
            size: contactSize,
            color: textColor,
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
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resumeData.basics.summary,
            size: contentSize,
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
        // Inline flow for custom fields in ATS Green
        for (const [key, item] of customEntries) {
             const paragraphChildren = [
                new TextRun({ text: `${item.title}: `, bold: true, size: contentSize, color: textColor, font: "Helvetica" }),
             ];
             if (item.link) {
                 paragraphChildren.push(createLink(item.content || "", item.content || "", contentSize, linkColor) as any);
             } else {
                 paragraphChildren.push(new TextRun({ text: item.content || "", size: contentSize, color: textColor, font: "Helvetica" }));
             }

             docChildren.push(new Paragraph({
                children: paragraphChildren,
                spacing: { after: 60 }
             }));
        }
        docChildren.push(new Paragraph({ spacing: { after: 80 } }));
      }
      continue;
    }

    if (!hasSectionContent(section)) continue;

    // Section Title with Background Shading
    docChildren.push(
      new Paragraph({
        spacing: { before: 120, after: 100 },
        shading: {
            type: ShadingType.CLEAR,
            color: "auto",
            fill: headerFill,
        },
        children: [
          new TextRun({
            text: section.title, // Removed leading explicit space because it shows up as a format mark (looks like a bullet)
            bold: true,
            size: sectionTitleSize,
            color: textColor,
            font: "Helvetica",
          }),
        ],
      })
    );

    // Section Content
    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of (section as any).items) {
          const titleParts = [edu.degree, edu.institution].filter(Boolean);
          const eduDates = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
          
          docChildren.push(
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: titleParts.join(", "), bold: true, size: contentSize, color: textColor, font: "Helvetica" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 70, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [new TextRun({ text: eduDates, size: smallSize, color: textColor, font: "Helvetica" })],
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
          
          if (edu.location) {
              docChildren.push(
                new Paragraph({
                  spacing: { before: 40, after: 60 },
                  children: [
                    new TextRun({ text: edu.location, size: smallSize, color: textColor, font: "Helvetica" }),
                  ],
                })
              );
          } else {
             docChildren.push(new Paragraph({ spacing: { after: 60 } })); 
          }

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: 60 },
                  indent: { left: 400 },
                  children: [
                    new TextRun({ text: `• ${highlight}`, size: contentSize, color: bulletColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: 100 } }));
        }
        break;

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of (section as any).items) {
          const titleParts = [exp.company, exp.role].filter(Boolean);
          const expDates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
          
          docChildren.push(
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: titleParts.join(" - "), bold: true, size: contentSize, color: textColor, font: "Helvetica" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 70, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [new TextRun({ text: expDates, size: smallSize, color: textColor, font: "Helvetica" })],
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
          
          if (exp.location) {
              docChildren.push(
                new Paragraph({
                  spacing: { before: 40, after: 60 },
                  children: [
                    new TextRun({ text: exp.location, size: smallSize, color: textColor, font: "Helvetica" }),
                  ],
                })
              );
          } else {
             docChildren.push(new Paragraph({ spacing: { after: 60 } }));
          }

          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              docChildren.push(
                new Paragraph({
                  spacing: { after: 60 },
                  indent: { left: 400 },
                  children: [
                    new TextRun({ text: `• ${achievement}`, size: contentSize, color: bulletColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: 100 } }));
        }
        break;

      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section as any);
        const visibleGroups = groups.filter(g => g.skills.length > 0);
        
        for (const group of visibleGroups) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({ text: `${group.title}: `, bold: true, size: contentSize, color: textColor, font: "Helvetica" }),
                new TextRun({ text: group.skills.join(', '), size: contentSize, color: textColor, font: "Helvetica" }),
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
              spacing: { after: 60 },
              children: [
                new TextRun({ text: (section as any).items.join(", "), size: contentSize, color: textColor, font: "Helvetica" }),
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
                new TextRun({ text: proj.name, bold: true, size: sectionTitleSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
          
          if (proj.link || proj.repo) {
             const paragraphChildren = [];
             if (proj.link) {
                 paragraphChildren.push(new TextRun({ text: "Link: ", size: smallSize, color: textColor, font: "Helvetica" }));
                 paragraphChildren.push(createLink(proj.link as unknown as string, proj.link as unknown as string, smallSize, linkColor) as any);
             }
             if (proj.repo) {
                 if (paragraphChildren.length > 0) {
                     paragraphChildren.push(new TextRun({ text: "  |  ", size: smallSize, color: textColor, font: "Helvetica" }));
                 }
                 paragraphChildren.push(new TextRun({ text: "GitHub: ", size: smallSize, color: textColor, font: "Helvetica" }));
                 paragraphChildren.push(createLink(proj.repo as unknown as string, proj.repo as unknown as string, smallSize, linkColor) as any);
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
                  indent: { left: 400 },
                  children: [
                    new TextRun({ text: `• ${d}`, size: contentSize, color: bulletColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: 100 } }));
        }
        break;

      case SECTION_TYPES.CUSTOM:
        if ((section as any).content?.length) {
          for (const text of (section as any).content) {
            docChildren.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: text, size: contentSize, color: textColor, font: "Helvetica" }),
                ],
              })
            );
          }
          docChildren.push(new Paragraph({ spacing: { after: 100 } }));
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
              bottom: 576,
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
