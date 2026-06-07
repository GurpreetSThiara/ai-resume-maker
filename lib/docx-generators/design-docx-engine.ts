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
} from "docx"
import type { PDFGenerationOptions } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"
import { createLink, hasSectionContent } from "./utils"
import type { ResumeDesign } from "../resume-designs"

const noBorders = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE },
  insideVertical: { style: BorderStyle.NONE },
}

const FONT = (d: ResumeDesign) => (d.font === "serif" ? "Times New Roman" : "Helvetica")

export async function generateDesignDOCX(
  { resumeData }: PDFGenerationOptions,
  design: ResumeDesign,
): Promise<Buffer> {
  const f = FONT(design)
  const c = design.colors
  const hp = (pt: number) => Math.round(pt * 2) // pt -> half-points
  const sz = {
    name: hp(design.sizes.name),
    section: hp(design.sizes.section),
    item: hp(design.sizes.item),
    content: hp(design.sizes.content),
    small: hp(design.sizes.small),
  }

  const dateDelim = " - "

  // ---- generic body builders (target = array of Paragraph|Table) ----
  type Ctx = {
    heading: string
    text: string
    secondary: string
    accent: string
    titleBorder: string
  }

  const sectionTitle = (target: any[], title: string, ctx: Ctx, sidebar: boolean) => {
    const text = design.uppercaseTitles ? title.toUpperCase() : title
    const useBorder = design.sectionTitle === "rule-full" || design.sectionTitle === "underline"
    target.push(
      new Paragraph({
        spacing: { before: 220, after: 110 },
        keepNext: true,
        keepLines: true,
        children: [
          new TextRun({
            text,
            bold: true,
            size: sidebar ? sz.section - 2 : sz.section,
            color: ctx.heading,
            font: f,
            characterSpacing: design.letterSpacingTitles ? 14 : 0,
          }),
        ],
        border: useBorder
          ? {
              bottom: {
                color: design.sectionTitle === "underline" ? ctx.accent : ctx.titleBorder,
                space: 2,
                style: BorderStyle.SINGLE,
                size: design.sectionTitle === "underline" ? 10 : 8,
              },
            }
          : undefined,
      }),
    )
  }

  const bulletLine = (target: any[], text: string, ctx: Ctx) => {
    target.push(
      new Paragraph({
        spacing: { after: 50 },
        indent: { left: 240 },
        children: [new TextRun({ text: `• ${text}`, size: sz.content, color: ctx.text, font: f })],
      }),
    )
  }

  const entryHeader = (
    target: any[],
    title: string,
    dateText: string,
    subtitle: string,
    rightOfSub: string,
    ctx: Ctx,
  ) => {
    target.push(
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 72, type: WidthType.PERCENTAGE },
                borders: noBorders,
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: title, bold: true, size: sz.item, color: ctx.heading, font: f })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                borders: noBorders,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: dateText, size: sz.small, color: ctx.secondary, font: f })],
                  }),
                ],
              }),
            ],
          }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorders,
      }),
    )
    if (subtitle || rightOfSub) {
      const runs = [new TextRun({ text: subtitle, size: sz.content, color: ctx.accent, bold: true, font: f })]
      if (rightOfSub) runs.push(new TextRun({ text: `   ${rightOfSub}`, size: sz.small, color: ctx.secondary, font: f }))
      target.push(new Paragraph({ spacing: { before: 30, after: 60 }, children: runs }))
    }
  }

  const renderBody = (target: any[], section: any, ctx: Ctx, sidebar: boolean) => {
    switch (section.type) {
      case "experience":
        for (const exp of section.items || []) {
          entryHeader(
            target,
            exp.role || "",
            [exp.startDate, exp.endDate].filter(Boolean).join(dateDelim),
            exp.company || "",
            exp.location || "",
            ctx,
          )
          for (const a of exp.achievements || []) bulletLine(target, a, ctx)
          target.push(new Paragraph({ spacing: { after: 110 } }))
        }
        break
      case "education":
        for (const edu of section.items || []) {
          entryHeader(
            target,
            edu.institution || "",
            [edu.startDate, edu.endDate].filter(Boolean).join(dateDelim),
            edu.degree || "",
            edu.location || "",
            ctx,
          )
          for (const h of edu.highlights || []) bulletLine(target, h, ctx)
          target.push(new Paragraph({ spacing: { after: 110 } }))
        }
        break
      case "projects":
        for (const proj of section.items || []) {
          target.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [new TextRun({ text: proj.name || "", bold: true, size: sz.item, color: ctx.heading, font: f })],
            }),
          )
          const linkRuns: any[] = []
          if (proj.link) {
            linkRuns.push(new TextRun({ text: "Demo: ", size: sz.small, color: ctx.secondary, font: f }))
            linkRuns.push(createLink(proj.link, proj.link, sz.small, ctx.accent) as any)
          }
          if (proj.repo) {
            if (linkRuns.length) linkRuns.push(new TextRun({ text: "   |   ", size: sz.small, color: ctx.secondary, font: f }))
            linkRuns.push(new TextRun({ text: "Code: ", size: sz.small, color: ctx.secondary, font: f }))
            linkRuns.push(createLink(proj.repo, proj.repo, sz.small, ctx.accent) as any)
          }
          if (linkRuns.length) target.push(new Paragraph({ spacing: { after: 60 }, children: linkRuns }))
          for (const d of proj.description || []) bulletLine(target, d, ctx)
          target.push(new Paragraph({ spacing: { after: 110 } }))
        }
        break
      case "skills": {
        const groups = getEffectiveSkillGroupsFromSection(section).filter((g) => g.skills.length > 0)
        if (design.skillStyle === "bullets" || sidebar) {
          for (const g of groups) {
            if (g.title && g.title !== "General") {
              target.push(
                new Paragraph({
                  spacing: { after: 50 },
                  children: [new TextRun({ text: g.title, bold: true, size: sz.content, color: ctx.heading, font: f })],
                }),
              )
            }
            for (const skill of g.skills) bulletLine(target, skill, ctx)
            target.push(new Paragraph({ spacing: { after: 80 } }))
          }
        } else {
          for (const g of groups) {
            const runs: any[] = []
            if (g.title && g.title !== "General")
              runs.push(new TextRun({ text: `${g.title}: `, bold: true, size: sz.content, color: ctx.heading, font: f }))
            runs.push(new TextRun({ text: g.skills.join(", "), size: sz.content, color: ctx.text, font: f }))
            target.push(new Paragraph({ spacing: { after: 90 }, children: runs }))
          }
        }
        break
      }
      case "languages":
      case "certifications":
        for (const it of (section.items || []).filter(Boolean)) bulletLine(target, it, ctx)
        break
      case "custom":
        for (const it of (section.content || []).filter(Boolean)) bulletLine(target, it, ctx)
        break
    }
  }

  const renderCustomFields = (target: any[], ctx: Ctx) => {
    const entries = Object.values(resumeData.custom || {}).filter((x: any) => x && !x.hidden && x.content)
    for (const item of entries as any[]) {
      const runs: any[] = [
        new TextRun({ text: `${item.title}: `, bold: true, size: sz.content, color: ctx.heading, font: f }),
      ]
      if (item.link) runs.push(createLink(item.content, item.content, sz.content, ctx.accent) as any)
      else runs.push(new TextRun({ text: item.content, size: sz.content, color: ctx.text, font: f }))
      target.push(new Paragraph({ spacing: { after: 80 }, children: runs }))
    }
  }

  const mainCtx: Ctx = {
    heading: c.heading,
    text: c.text,
    secondary: c.secondary,
    accent: c.accent,
    titleBorder: c.divider,
  }

  // =========================================================================
  // SIDEBAR-LEFT
  // =========================================================================
  if (design.layout === "sidebar-left") {
    const sideCtx: Ctx = {
      heading: c.sidebarHeading || c.heading,
      text: c.sidebarText || c.text,
      secondary: c.sidebarText || c.secondary,
      accent: c.sidebarAccent || c.accent,
      titleBorder: c.sidebarAccent || c.divider,
    }
    const left: any[] = []
    const right: any[] = []

    // contact
    const contact = [
      ["Email", resumeData.basics.email],
      ["Phone", resumeData.basics.phone],
      ["Location", resumeData.basics.location],
      ["LinkedIn", resumeData.basics.linkedin],
    ].filter(([, v]) => v)
    if (contact.length) {
      sectionTitle(left, "Contact", sideCtx, true)
      for (const [, v] of contact) {
        left.push(
          new Paragraph({
            spacing: { after: 70 },
            children: [new TextRun({ text: v as string, size: sz.content, color: sideCtx.text, font: f })],
          }),
        )
      }
    }

    const all = getSectionsForRendering(resumeData.sections, resumeData.custom)
    const sidebarTypes = ["skills", "languages", "certifications"]
    for (const sec of all as any[]) {
      if (sec.type === "custom-fields") {
        const entries = Object.values(resumeData.custom || {}).filter((x: any) => x && !x.hidden && x.content)
        if (!entries.length) continue
        sectionTitle(right, sec.title, mainCtx, false)
        renderCustomFields(right, mainCtx)
        continue
      }
      if (!hasSectionContent(sec)) continue
      const isSide = sec.column === 1 || (!sec.column && sidebarTypes.includes(sec.type))
      const target = isSide ? left : right
      sectionTitle(target, sec.title, isSide ? sideCtx : mainCtx, isSide)
      renderBody(target, sec, isSide ? sideCtx : mainCtx, isSide)
    }

    // name + summary at top of right column
    const nameText = design.uppercaseName ? resumeData.basics.name.toUpperCase() : resumeData.basics.name
    right.unshift(
      new Paragraph({ spacing: { after: 200 } }),
      new Paragraph({
        spacing: { after: 160 },
        border: { bottom: { color: c.accent, space: 2, style: BorderStyle.SINGLE, size: 18 } },
        children: [new TextRun({ text: nameText, bold: true, size: sz.name, color: c.name, font: f })],
      }),
    )
    if (resumeData.basics.summary) {
      right.splice(2, 0, new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: resumeData.basics.summary, size: sz.content, color: c.text, font: f })],
      }))
    }

    const outer = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              margins: { top: 500, bottom: 500, left: 400, right: 300 },
              shading: c.sidebarBg ? { type: ShadingType.CLEAR, color: "auto", fill: c.sidebarBg } : undefined,
              borders: noBorders,
              children: left,
            }),
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              margins: { top: 400, bottom: 500, left: 400, right: 400 },
              borders: noBorders,
              children: right,
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders,
    })

    const doc = new Document({
      sections: [{ properties: { page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } } }, children: [outer] }],
    })
    return Packer.toBuffer(doc)
  }

  // =========================================================================
  // SINGLE COLUMN
  // =========================================================================
  const body: any[] = []
  const nameText = design.uppercaseName ? resumeData.basics.name.toUpperCase() : resumeData.basics.name
  const contactItems = [
    resumeData.basics.email,
    resumeData.basics.phone,
    resumeData.basics.location,
    resumeData.basics.linkedin,
  ].filter(Boolean)

  if (design.header === "band" && c.headerBg) {
    const headerCell: Paragraph[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: nameText,
            bold: true,
            size: sz.name,
            color: c.headerText || "FFFFFF",
            font: f,
            characterSpacing: 14,
          }),
        ],
      }),
    ]
    if (contactItems.length)
      headerCell.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: contactItems.join("   |   "), size: sz.small, color: c.headerText || "FFFFFF", font: f }),
          ],
        }),
      )
    body.push(
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.CLEAR, color: "auto", fill: c.headerBg },
                margins: { top: 360, bottom: 360, left: 360, right: 360 },
                borders: noBorders,
                children: headerCell,
              }),
            ],
          }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorders,
      }),
    )
    body.push(new Paragraph({ spacing: { after: 240 } }))
  } else {
    const centered = design.header === "centered"
    body.push(
      new Paragraph({
        alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 70 },
        children: [
          new TextRun({
            text: nameText,
            bold: true,
            size: sz.name,
            color: c.name,
            font: f,
            characterSpacing: design.letterSpacingTitles ? 10 : 0,
          }),
        ],
      }),
    )
    body.push(
      new Paragraph({
        alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 120 },
        border: { bottom: { color: centered ? c.divider : c.accent, space: 4, style: BorderStyle.SINGLE, size: centered ? 8 : 14 } },
        children: [new TextRun({ text: contactItems.join("   |   "), size: sz.small, color: c.secondary, font: f })],
      }),
    )
  }

  if (resumeData.basics.summary) {
    body.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: resumeData.basics.summary, size: sz.content, color: c.text, font: f })],
      }),
    )
  }

  const all = getSectionsForRendering(resumeData.sections, resumeData.custom)
  for (const sec of all as any[]) {
    if (sec.type === "custom-fields") {
      const entries = Object.values(resumeData.custom || {}).filter((x: any) => x && !x.hidden && x.content)
      if (!entries.length) continue
      sectionTitle(body, sec.title, mainCtx, false)
      renderCustomFields(body, mainCtx)
      continue
    }
    if (!hasSectionContent(sec)) continue
    sectionTitle(body, sec.title, mainCtx, false)
    renderBody(body, sec, mainCtx, false)
  }

  const doc = new Document({
    sections: [
      { properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children: body },
    ],
  })
  return Packer.toBuffer(doc)
}
