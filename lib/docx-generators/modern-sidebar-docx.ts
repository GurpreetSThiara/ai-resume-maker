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

export async function generateModernSidebarDOCX({
  resumeData,
  filename = "resume.docx",
}: PDFGenerationOptions): Promise<Buffer> {
  
  // Colors and Typography
  const textColor = "334155"; // text-slate-700
  const headingColor = "1E293B"; // text-slate-800
  const sidebarHeadingColor = "0F172A"; // text-slate-900
  const sidebarTextColor = "475569"; // text-slate-600
  const sidebarBg = "F8FAFC"; // bg-slate-50
  const linkColor = "2563EB"; // text-blue-600
  
  const nameSize = 48; // 24pt
  const sectionTitleSize = 28; // 14pt (uppercase)
  const sidebarSectionTitleSize = 24; // 12pt (uppercase)
  const instSize = 24; // 12pt (bold)
  const roleSize = 20; // 10pt
  const dateSize = 18; // 9pt
  const contentSize = 20; // 10pt

  const leftColumnChildren: (Paragraph | Table)[] = [];
  const rightColumnChildren: (Paragraph | Table)[] = [];

  // ================= LEFT COLUMN =================

  // Name rendering moved to right column


  // Contact Info
  const { email, phone, location, linkedin } = resumeData.basics;
  const contactItems = [email, phone, location, linkedin].filter(Boolean);
  if (contactItems.length > 0) {
    // Add Contact header
    leftColumnChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 120 },
        children: [
          new TextRun({
            text: "CONTACT",
            bold: true,
            size: sidebarSectionTitleSize,
            color: sidebarHeadingColor,
            font: "Helvetica",
          }),
        ],
        border: { bottom: { color: "E2E8F0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      })
    );

    for (const item of contactItems) {
        leftColumnChildren.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: item,
                size: contentSize,
                color: sidebarTextColor,
                font: "Helvetica",
              }),
            ],
          })
        );
    }
  }

  // ================= SECTIONS DISTRIBUTION =================
  const orderedSections = getSectionsForRendering(resumeData.sections, resumeData.custom);

  const sidebarSectionTypes = [SECTION_TYPES.SKILLS, SECTION_TYPES.LANGUAGES, SECTION_TYPES.CERTIFICATIONS];

  // Helper to render section title for left col
  const renderSidebarTitle = (title: string) => {
      leftColumnChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: sidebarSectionTitleSize,
              color: sidebarHeadingColor,
              font: "Helvetica",
            }),
          ],
          border: { bottom: { color: "E2E8F0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
        })
      );
  };

  // Helper to render section title for right col
  const renderMainTitle = (title: string) => {
      rightColumnChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 120 },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: sectionTitleSize,
              color: headingColor,
              font: "Helvetica",
            }),
          ],
          border: { bottom: { color: "CBD5E1", space: 1, style: BorderStyle.SINGLE, size: 12 } },
        })
      );
  };

  // ================= RIGHT COLUMN =================
  
  // Name
  if (resumeData.basics.name) {
    rightColumnChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 400, after: 240 },
        children: [
          new TextRun({
            text: resumeData.basics.name,
            bold: true,
            size: 56, // Increased from 48 for main column prominence
            color: headingColor,
            font: "Helvetica",
          }),
        ],
        border: { bottom: { color: "E2E8F0", space: 1, style: BorderStyle.SINGLE, size: 12 } },
      })
    );
  }

  // Summary goes to top of right column
  if (resumeData.basics.summary) {
    renderMainTitle("Professional Summary");
    rightColumnChildren.push(
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

  for (const section of orderedSections) {
    if (section.type === 'custom-fields') {
      const customEntries = Object.entries(resumeData.custom || {}).filter(([_, item]: any) => !item?.hidden);

      if (customEntries.length > 0) {
        for (const [key, item] of customEntries) {
             const isCustomSidebar = (item as any).column === 1;
             const targetCol = isCustomSidebar ? leftColumnChildren : rightColumnChildren;
             
             if (isCustomSidebar) {
                 renderSidebarTitle((item as any).title);
             }

             const paragraphChildren = [
                new TextRun({ text: isCustomSidebar ? "" : `${item.title}: `, bold: true, size: contentSize, color: headingColor, font: "Helvetica" }),
             ];
             if (item.link) {
                 paragraphChildren.push(createLink(item.content || "", item.content || "", contentSize, linkColor) as any);
             } else {
                 paragraphChildren.push(new TextRun({ text: item.content || "", size: contentSize, color: isCustomSidebar ? sidebarTextColor : textColor, font: "Helvetica" }));
             }

             targetCol.push(new Paragraph({
                children: paragraphChildren,
                spacing: { after: 120 }
             }));
        }
      }
      continue;
    }

    if (!hasSectionContent(section)) continue;

    const isSidebar = section.column === 1 || (!section.column && sidebarSectionTypes.includes(section.type as any));
    const targetArray = isSidebar ? leftColumnChildren : rightColumnChildren;

    if (isSidebar) {
        renderSidebarTitle(section.title);
    } else {
        renderMainTitle(section.title);
    }

    // Section Content
    switch (section.type) {
      case SECTION_TYPES.EDUCATION:
        for (const edu of (section as any).items) {
          const eduDates = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
          
          targetArray.push(
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
          targetArray.push(
            new Paragraph({
              spacing: { before: 40, after: 60 },
              children: [
                new TextRun({ text: roleLocationString || '', size: roleSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );

          if (edu.highlights?.length) {
            for (const highlight of edu.highlights) {
              targetArray.push(
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
          targetArray.push(new Paragraph({ spacing: { after: 120 } }));
        }
        break;

      case SECTION_TYPES.EXPERIENCE:
        for (const exp of (section as any).items) {
          const expDates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
          
          targetArray.push(
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
          targetArray.push(
            new Paragraph({
              spacing: { before: 40, after: 60 },
              children: [
                new TextRun({ text: roleLocationString || '', size: roleSize, color: textColor, font: "Helvetica" }),
              ],
            })
          );

          if (exp.achievements?.length) {
            for (const achievement of exp.achievements) {
              targetArray.push(
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
          targetArray.push(new Paragraph({ spacing: { after: 120 } }));
        }
        break;

      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section as any);
        const visibleGroups = groups.filter(g => g.skills.length > 0);
        
        for (const group of visibleGroups) {
          targetArray.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: `${group.title}`, bold: true, size: contentSize, color: sidebarHeadingColor, font: "Helvetica" }),
              ],
            })
          );
          for (const skill of group.skills) {
              targetArray.push(
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({ text: `• ${skill}`, size: contentSize, color: sidebarTextColor, font: "Helvetica" }),
                  ],
                })
              );
          }
          targetArray.push(new Paragraph({ spacing: { after: 160 } }));
        }
        break;
      }

      case SECTION_TYPES.LANGUAGES:
      case SECTION_TYPES.CERTIFICATIONS:
        if ((section as any).items?.length) {
          for (const item of (section as any).items) {
              targetArray.push(
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({ text: `• ${item}`, size: contentSize, color: sidebarTextColor, font: "Helvetica" }),
                  ],
                })
              );
          }
        }
        break;

      case SECTION_TYPES.PROJECTS:
        for (const proj of (section as any).items) {
          targetArray.push(
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
             targetArray.push(new Paragraph({
                 spacing: { before: 20, after: 80 },
                 children: paragraphChildren
             }));
          }

          if (Array.isArray(proj.description)) {
            for (const d of proj.description) {
              targetArray.push(
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
          targetArray.push(new Paragraph({ spacing: { after: 120 } }));
        }
        break;

      case SECTION_TYPES.CUSTOM:
        if ((section as any).content?.length) {
          for (const text of (section as any).content) {
            targetArray.push(
              new Paragraph({
                spacing: { after: 60 },
                indent: { left: 360 },
                children: [
                  new TextRun({ text: `• ${text}`, size: contentSize, color: textColor, font: "Helvetica" }),
                ],
              })
            );
          }
          targetArray.push(new Paragraph({ spacing: { after: 120 } }));
        }
        break;
    }
  }

  // Create the overarching table
  const outerTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: leftColumnChildren,
            width: { size: 30, type: WidthType.PERCENTAGE },
            margins: { top: 720, bottom: 720, left: 720, right: 360 }, // Internal padding
            shading: { type: ShadingType.CLEAR, color: "auto", fill: sidebarBg },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
          new TableCell({
            children: rightColumnChildren,
            width: { size: 70, type: WidthType.PERCENTAGE },
            margins: { top: 720, bottom: 720, left: 360, right: 720 }, // Internal padding
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
    },
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 0, // 0 margin to allow shading to hit the very edge for full bleed
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        children: [outerTable],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
