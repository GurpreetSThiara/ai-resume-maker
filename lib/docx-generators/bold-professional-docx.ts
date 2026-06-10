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

export async function generateBoldDOCX({
  resumeData,
  filename = "resume.docx",
}: PDFGenerationOptions): Promise<Buffer> {
  
  // Colors and Typography
  const headerBg = "1E293B"; // slate-800
  const headerTextColor = "F8FAFC"; // slate-50
  
  const textColor = "334155"; // slate-700
  const headingColor = "0F172A"; // slate-900
  const linkColor = "2563EB"; // blue-600
  const borderBottomColor = "E2E8F0"; // slate-200
  
  const nameSize = 56; // 28pt
  const contactSize = 22; // 11pt
  const sectionTitleSize = 32; // 16pt (uppercase)
  const instSize = 26; // 13pt (bold)
  const roleSize = 22; // 11pt
  const dateSize = 20; // 10pt
  const contentSize = 22; // 11pt

  const docChildren: (Paragraph | Table)[] = [];

  // ================= HEADER BLOCK =================
  const headerChildren: Paragraph[] = [];
  
  if (resumeData.basics.name) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: resumeData.basics.name.toUpperCase(),
            bold: true,
            size: nameSize,
            color: headerTextColor,
            font: "Helvetica",
          }),
        ],
      })
    );
  }

  const { email, phone, location, linkedin } = resumeData.basics;
  const contactItems = [email, phone, location, linkedin].filter(Boolean);
  if (contactItems.length > 0) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: contactItems.join("  |  "),
            size: contactSize,
            color: headerTextColor,
            font: "Helvetica",
          }),
        ],
      })
    );
  }

  const headerTable = new Table({
      rows: [
          new TableRow({
              children: [
                  new TableCell({
                      children: headerChildren,
                      shading: { type: ShadingType.CLEAR, color: "auto", fill: headerBg },
                      margins: { top: 360, bottom: 360, left: 360, right: 360 }, // Padding inside block
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  })
              ]
          })
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
  });
  
  docChildren.push(headerTable);
  docChildren.push(new Paragraph({ spacing: { after: 360 } })); // Huge gap after header

  // ================= SUMMARY =================
  if (resumeData.basics.summary) {
    docChildren.push(
      new Paragraph({
        spacing: { after: 240 },
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

  // ================= SECTIONS =================
  const orderedSections = getSectionsForRendering(resumeData.sections, resumeData.custom);

  for (const section of orderedSections) {
    if (section.type === 'custom-fields') {
      const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]: any) => !item?.hidden);

      if (customEntries.length > 0) {
        // Render custom fields
        for (const [key, item] of customEntries) {
             const paragraphChildren = [
                new TextRun({ text: `${item.title}: `, bold: true, size: contentSize, color: headingColor, font: "Helvetica" }),
             ];
             if (item.link) {
                 paragraphChildren.push(createLink(item.content || "", item.content || "", contentSize, linkColor) as any);
             } else {
                 paragraphChildren.push(new TextRun({ text: item.content || "", size: contentSize, color: textColor, font: "Helvetica" }));
             }

             docChildren.push(new Paragraph({
                children: paragraphChildren,
                spacing: { after: 120 }
             }));
        }
        docChildren.push(new Paragraph({ spacing: { after: 200 } }));
      }
      continue;
    }

    if (!hasSectionContent(section)) continue;

    // Section Title
    docChildren.push(
      new Paragraph({
        spacing: { before: 240, after: 160 },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: sectionTitleSize,
            color: headingColor,
            font: "Helvetica",
          }),
        ],
        border: { bottom: { color: borderBottomColor, space: 1, style: BorderStyle.SINGLE, size: 12 } },
      })
    );

    // Section Content
    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of (section as any).items) {
          const eduDates = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
          
          docChildren.push(
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: edu.institution, bold: true, size: instSize, color: headingColor, font: "Helvetica" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 70, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [new TextRun({ text: eduDates, bold: true, size: dateSize, color: headingColor, font: "Helvetica" })],
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
                new TextRun({ text: roleLocationString || '', size: roleSize, color: textColor, font: "Helvetica" }),
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
                    new TextRun({ text: `• ${highlight}`, size: contentSize, color: textColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: 120 } }));
        }
        break;

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of (section as any).items) {
          const expDates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
          
          docChildren.push(
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: exp.company, bold: true, size: instSize, color: headingColor, font: "Helvetica" })],
                        })
                      ],
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      width: { size: 70, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [new TextRun({ text: expDates, bold: true, size: dateSize, color: headingColor, font: "Helvetica" })],
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
                new TextRun({ text: roleLocationString || '', size: roleSize, color: textColor, font: "Helvetica" }),
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
                    new TextRun({ text: `• ${achievement}`, size: contentSize, color: textColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
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
                new TextRun({ text: `${group.title}: `, bold: true, size: contentSize, color: headingColor, font: "Helvetica" }),
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
              spacing: { after: 120 },
              children: [
                new TextRun({ text: (section as any).items.join(" • "), size: contentSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );
        }
        break;

      case SECTION_TYPES.PROJECTS:
        for (const proj of (section as any).items) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({ text: proj.name, bold: true, size: instSize, color: headingColor, font: "Helvetica" }),
              ],
            })
          );
          
          if (proj.link || proj.repo) {
             const paragraphChildren = [];
             if (proj.link) {
                 paragraphChildren.push(new TextRun({ text: "Demo: ", size: dateSize, color: textColor, font: "Helvetica" }));
                 paragraphChildren.push(createLink(proj.link as unknown as string, proj.link as unknown as string, dateSize, linkColor) as any);
             }
             if (proj.repo) {
                 if (paragraphChildren.length > 0) {
                     paragraphChildren.push(new TextRun({ text: "  |  ", size: dateSize, color: textColor, font: "Helvetica" }));
                 }
                 paragraphChildren.push(new TextRun({ text: "GitHub: ", size: dateSize, color: textColor, font: "Helvetica" }));
                 paragraphChildren.push(createLink(proj.repo as unknown as string, proj.repo as unknown as string, dateSize, linkColor) as any);
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
                    new TextRun({ text: `• ${d}`, size: contentSize, color: textColor, font: "Helvetica" }),
                  ],
                })
              );
            }
          }
          docChildren.push(new Paragraph({ spacing: { after: 160 } }));
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
                  new TextRun({ text: `• ${text}`, size: contentSize, color: textColor, font: "Helvetica" }),
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
