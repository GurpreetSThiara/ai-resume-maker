import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"
import { wrapText } from "../pdf-utils"
import { sanitizeWithFont, hexToRgb, addLinkAnnotation } from "./pdf-helpers"
import type { ResumeDesign } from "../resume-designs"

const PAGE_W = 595.276
const PAGE_H = 841.89

type RGB = ReturnType<typeof rgb>

const col = (hex: string): RGB => {
  const { r, g, b } = hexToRgb(hex)
  return rgb(r, g, b)
}

interface Cursor {
  x: number
  width: number
  isSidebar: boolean
  y: number
  pageIndex: number
}

export async function generateDesignPDF(
  { resumeData }: PDFGenerationOptions,
  design: ResumeDesign,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()

  const regular = await pdf.embedFont(
    design.font === "serif" ? StandardFonts.TimesRoman : StandardFonts.Helvetica,
  )
  const bold = await pdf.embedFont(
    design.font === "serif" ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold,
  )

  const c = design.colors
  const colors = {
    name: col(c.name),
    heading: col(c.heading),
    accent: col(c.accent),
    text: col(c.text),
    secondary: col(c.secondary),
    divider: col(c.divider),
    headerBg: c.headerBg ? col(c.headerBg) : undefined,
    headerText: c.headerText ? col(c.headerText) : undefined,
    sidebarBg: c.sidebarBg ? col(c.sidebarBg) : undefined,
    sidebarText: c.sidebarText ? col(c.sidebarText) : undefined,
    sidebarHeading: c.sidebarHeading ? col(c.sidebarHeading) : undefined,
    sidebarAccent: c.sidebarAccent ? col(c.sidebarAccent) : undefined,
  }
  const s = design.sizes

  const margin = design.layout === "sidebar-left" ? 28 : design.id === "compact-pro" ? 36 : 44
  const stripeW = design.accentStripe ? 8 : 0
  const sidebarW = 188

  const pages: any[] = []

  const paintPageChrome = (page: any) => {
    if (design.layout === "sidebar-left" && colors.sidebarBg) {
      page.drawRectangle({ x: 0, y: 0, width: sidebarW, height: PAGE_H, color: colors.sidebarBg })
    }
    if (design.accentStripe) {
      page.drawRectangle({ x: 0, y: 0, width: stripeW, height: PAGE_H, color: colors.accent })
    }
  }

  const newPage = () => {
    const p = pdf.addPage([PAGE_W, PAGE_H])
    paintPageChrome(p)
    pages.push(p)
    return p
  }

  newPage()

  // --- letter spacing helper (manual tracking for uppercase titles) ---
  const drawTracked = (
    page: any,
    text: string,
    x: number,
    y: number,
    size: number,
    font: any,
    color: RGB,
    tracking: number,
  ) => {
    let cx = x
    for (const ch of Array.from(text)) {
      page.drawText(ch, { x: cx, y, size, font, color })
      cx += font.widthOfTextAtSize(ch, size) + tracking
    }
    return cx - x
  }

  const trackedWidth = (text: string, size: number, font: any, tracking: number) =>
    Array.from(text).reduce((w, ch) => w + font.widthOfTextAtSize(ch, size) + tracking, 0)

  // ---------- Cursor / pagination ----------
  const ensure = (cur: Cursor, space: number) => {
    if (cur.y - space < margin) {
      cur.pageIndex++
      while (cur.pageIndex >= pages.length) newPage()
      cur.y = PAGE_H - margin
    }
  }
  const pageOf = (cur: Cursor) => pages[cur.pageIndex]

  // ---------- primitives ----------
  const para = (
    cur: Cursor,
    text: string,
    opts: {
      size: number
      font: any
      color: RGB
      indent?: number
      lineGap?: number
      link?: string
    },
  ) => {
    const indent = opts.indent || 0
    const lineGap = opts.lineGap ?? opts.size + 2
    const lines = wrapText(text, cur.width - indent, opts.font, opts.size)
    for (const line of lines) {
      ensure(cur, lineGap)
      const safe = sanitizeWithFont(line, opts.font)
      pageOf(cur).drawText(safe, {
        x: cur.x + indent,
        y: cur.y,
        size: opts.size,
        font: opts.font,
        color: opts.color,
      })
      if (opts.link) {
        const w = opts.font.widthOfTextAtSize(safe, opts.size)
        addLinkAnnotation(pdf, pageOf(cur), cur.x + indent, cur.y, w, opts.size, opts.link)
      }
      cur.y -= lineGap
    }
  }

  const titleColorFor = (cur: Cursor) =>
    cur.isSidebar ? colors.sidebarHeading || colors.heading : colors.heading
  const textColorFor = (cur: Cursor) =>
    cur.isSidebar ? colors.sidebarText || colors.text : colors.text
  const secondaryColorFor = (cur: Cursor) =>
    cur.isSidebar ? colors.sidebarText || colors.secondary : colors.secondary
  const accentColorFor = (cur: Cursor) =>
    cur.isSidebar ? colors.sidebarAccent || colors.accent : colors.accent

  const sectionTitle = (cur: Cursor, rawTitle: string) => {
    const title = design.uppercaseTitles ? rawTitle.toUpperCase() : rawTitle
    const size = cur.isSidebar ? s.section - 1 : s.section
    const tracking = design.letterSpacingTitles ? 0.8 : 0
    // Reserve room for the heading PLUS the first ~2.5 lines of its content so a
    // section title never lands orphaned at the very bottom of a page.
    ensure(cur, size + 48)
    const style = design.sectionTitle

    if (style === "left-bar" && !cur.isSidebar) {
      const barH = size
      pageOf(cur).drawRectangle({
        x: cur.x,
        y: cur.y - 1,
        width: 3,
        height: barH,
        color: accentColorFor(cur),
      })
      drawTracked(pageOf(cur), title, cur.x + 9, cur.y, size, bold, titleColorFor(cur), tracking)
      cur.y -= size + 8
      return
    }

    drawTracked(pageOf(cur), title, cur.x, cur.y, size, bold, titleColorFor(cur), tracking)
    cur.y -= size + 3

    if (style === "rule-full") {
      pageOf(cur).drawLine({
        start: { x: cur.x, y: cur.y + 1 },
        end: { x: cur.x + cur.width, y: cur.y + 1 },
        thickness: 1,
        color: cur.isSidebar ? accentColorFor(cur) : colors.divider,
      })
      cur.y -= 11
    } else if (style === "underline") {
      pageOf(cur).drawLine({
        start: { x: cur.x, y: cur.y + 1 },
        end: { x: cur.x + cur.width, y: cur.y + 1 },
        thickness: 1.4,
        color: accentColorFor(cur),
      })
      cur.y -= 11
    } else {
      // plain
      cur.y -= 4
    }
  }

  const bullets = (cur: Cursor, items: string[], color: RGB) => {
    for (const it of items) {
      if (!it) continue
      para(cur, `• ${it}`, { size: s.content, font: regular, color, indent: 10, lineGap: s.content + 3 })
    }
  }

  const skillPills = (cur: Cursor, groups: { title: string; skills: string[] }[]) => {
    const pillBg = cur.isSidebar ? colors.sidebarAccent || colors.accent : col(c.divider)
    const pillText = cur.isSidebar ? colors.sidebarBg || rgb(1, 1, 1) : colors.text
    for (const g of groups) {
      if (g.title && g.title !== "General") {
        para(cur, g.title, { size: s.small, font: bold, color: secondaryColorFor(cur), lineGap: s.small + 4 })
      }
      let px = cur.x
      const pillH = s.content + 6
      ensure(cur, pillH + 4)
      for (const skill of g.skills) {
        const safe = sanitizeWithFont(skill, regular)
        const tw = regular.widthOfTextAtSize(safe, s.content)
        const pw = tw + 12
        if (px + pw > cur.x + cur.width) {
          px = cur.x
          cur.y -= pillH + 4
          ensure(cur, pillH + 4)
        }
        pageOf(cur).drawRectangle({
          x: px,
          y: cur.y - 3,
          width: pw,
          height: pillH,
          color: pillBg,
        })
        pageOf(cur).drawText(safe, {
          x: px + 6,
          y: cur.y,
          size: s.content,
          font: regular,
          color: pillText,
        })
        px += pw + 5
      }
      cur.y -= pillH + 8
    }
  }

  const groupedLine = (cur: Cursor, groups: { title: string; skills: string[] }[]) => {
    for (const g of groups) {
      const label = g.title && g.title !== "General" ? `${g.title}: ` : ""
      const full = `${label}${g.skills.join(", ")}`
      // draw label bold + rest normal on a wrapped paragraph (approximate: bold whole label inline)
      if (label) {
        ensure(cur, s.content + 3)
        const labelW = bold.widthOfTextAtSize(label, s.content)
        pageOf(cur).drawText(sanitizeWithFont(label, bold), {
          x: cur.x,
          y: cur.y,
          size: s.content,
          font: bold,
          color: titleColorFor(cur),
        })
        const rest = g.skills.join(", ")
        const gap = 2
        const restLines = wrapText(rest, cur.width - labelW - gap, regular, s.content)
        restLines.forEach((line, i) => {
          if (i === 0) {
            pageOf(cur).drawText(sanitizeWithFont(line, regular), {
              x: cur.x + labelW + gap,
              y: cur.y,
              size: s.content,
              font: regular,
              color: textColorFor(cur),
            })
            cur.y -= s.content + 3
          } else {
            ensure(cur, s.content + 3)
            pageOf(cur).drawText(sanitizeWithFont(line, regular), {
              x: cur.x,
              y: cur.y,
              size: s.content,
              font: regular,
              color: textColorFor(cur),
            })
            cur.y -= s.content + 3
          }
        })
      } else {
        para(cur, full, { size: s.content, font: regular, color: textColorFor(cur), lineGap: s.content + 3 })
      }
      cur.y -= 3
    }
  }

  // role/company/date block used by experience & education
  const headedEntry = (
    cur: Cursor,
    title: string,
    subtitle: string,
    dateText: string,
    rightOfSub: string,
    items: string[] | undefined,
    withTimeline: boolean,
  ) => {
    const tlIndent = withTimeline ? 16 : 0
    const startPage = cur.pageIndex
    const yTop = cur.y
    ensure(cur, s.item + s.content + 12)

    // title + date on one row
    const dateW = dateText ? regular.widthOfTextAtSize(dateText, s.small) : 0
    const titleLines = wrapText(title, cur.width - tlIndent - dateW - 8, bold, s.item)
    titleLines.forEach((line, i) => {
      ensure(cur, s.item + 2)
      pageOf(cur).drawText(sanitizeWithFont(line, bold), {
        x: cur.x + tlIndent,
        y: cur.y,
        size: s.item,
        font: bold,
        color: titleColorFor(cur),
      })
      if (i === 0 && dateText) {
        pageOf(cur).drawText(sanitizeWithFont(dateText, regular), {
          x: cur.x + cur.width - dateW,
          y: cur.y,
          size: s.small,
          font: regular,
          color: secondaryColorFor(cur),
        })
      }
      cur.y -= s.item + 2
    })

    // subtitle (company/degree) + optional right (location)
    if (subtitle || rightOfSub) {
      ensure(cur, s.content + 2)
      pageOf(cur).drawText(sanitizeWithFont(subtitle, bold), {
        x: cur.x + tlIndent,
        y: cur.y,
        size: s.content,
        font: bold,
        color: accentColorFor(cur),
      })
      if (rightOfSub) {
        const rw = regular.widthOfTextAtSize(rightOfSub, s.small)
        pageOf(cur).drawText(sanitizeWithFont(rightOfSub, regular), {
          x: cur.x + cur.width - rw,
          y: cur.y,
          size: s.small,
          font: regular,
          color: secondaryColorFor(cur),
        })
      }
      cur.y -= s.content + 4
    }

    if (items && items.length) {
      for (const it of items) {
        if (!it) continue
        para(cur, `• ${it}`, {
          size: s.content,
          font: regular,
          color: textColorFor(cur),
          indent: tlIndent + 10,
          lineGap: s.content + 3,
        })
      }
    }

    // timeline marker (only when no page break occurred during the entry)
    if (withTimeline && cur.pageIndex === startPage) {
      const p = pageOf(cur)
      p.drawCircle({ x: cur.x + 4, y: yTop - 1, size: 3.2, color: colors.accent })
      p.drawLine({
        start: { x: cur.x + 4, y: yTop - 6 },
        end: { x: cur.x + 4, y: cur.y + 6 },
        thickness: 1,
        color: colors.divider,
      })
    }

    cur.y -= 8
  }

  // ---------- section dispatch ----------
  const renderSectionBody = (cur: Cursor, section: any) => {
    const withTimeline = !!design.timeline && !cur.isSidebar
    switch (section.type) {
      case "experience":
        for (const exp of section.items || []) {
          headedEntry(
            cur,
            exp.role || "",
            exp.company || "",
            [exp.startDate, exp.endDate].filter(Boolean).join(" - "),
            exp.location || "",
            exp.achievements,
            withTimeline,
          )
        }
        break
      case "education":
        for (const edu of section.items || []) {
          headedEntry(
            cur,
            edu.institution || "",
            edu.degree || "",
            [edu.startDate, edu.endDate].filter(Boolean).join(" - "),
            edu.location || "",
            edu.highlights,
            withTimeline,
          )
        }
        break
      case "projects":
        for (const proj of section.items || []) {
          ensure(cur, s.item + 6)
          pageOf(cur).drawText(sanitizeWithFont(proj.name || "", bold), {
            x: cur.x,
            y: cur.y,
            size: s.item,
            font: bold,
            color: titleColorFor(cur),
          })
          cur.y -= s.item + 2
          for (const lk of [proj.link, proj.repo].filter(Boolean)) {
            para(cur, lk, {
              size: s.small,
              font: regular,
              color: accentColorFor(cur),
              link: lk,
              lineGap: s.small + 2,
            })
          }
          if (Array.isArray(proj.description)) {
            for (const d of proj.description) {
              para(cur, `• ${d}`, {
                size: s.content,
                font: regular,
                color: textColorFor(cur),
                indent: 10,
                lineGap: s.content + 3,
              })
            }
          }
          cur.y -= 6
        }
        break
      case "skills": {
        const groups = getEffectiveSkillGroupsFromSection(section).filter((g) => g.skills.length > 0)
        if (design.skillStyle === "pills") skillPills(cur, groups)
        else if (design.skillStyle === "bullets" || cur.isSidebar) {
          for (const g of groups) {
            if (g.title && g.title !== "General") {
              para(cur, g.title, {
                size: s.small,
                font: bold,
                color: secondaryColorFor(cur),
                lineGap: s.small + 4,
              })
            }
            bullets(cur, g.skills, textColorFor(cur))
            cur.y -= 4
          }
        } else groupedLine(cur, groups)
        break
      }
      case "languages":
      case "certifications":
        bullets(cur, (section.items || []).filter(Boolean), textColorFor(cur))
        cur.y -= 4
        break
      case "custom":
        bullets(cur, (section.content || []).filter(Boolean), textColorFor(cur))
        cur.y -= 4
        break
    }
  }

  const sectionHasContent = (section: any): boolean => {
    if (!section || section.hidden) return false
    switch (section.type) {
      case "experience":
      case "education":
      case "projects":
        return Array.isArray(section.items) && section.items.length > 0
      case "skills":
        return getEffectiveSkillGroupsFromSection(section).some((g) => g.skills.length > 0)
      case "languages":
      case "certifications":
        return Array.isArray(section.items) && section.items.filter((x: string) => x && x.trim()).length > 0
      case "custom":
        return Array.isArray(section.content) && section.content.filter((x: string) => x && x.trim()).length > 0
      default:
        return false
    }
  }

  const renderCustomFields = (cur: Cursor) => {
    const entries = Object.values(resumeData.custom || {}).filter((f: any) => f && !f.hidden && f.content)
    if (!entries.length) return
    for (const f of entries as any[]) {
      ensure(cur, s.content + 3)
      const label = `${f.title}: `
      const lw = bold.widthOfTextAtSize(label, s.content)
      pageOf(cur).drawText(sanitizeWithFont(label, bold), {
        x: cur.x,
        y: cur.y,
        size: s.content,
        font: bold,
        color: titleColorFor(cur),
      })
      const safe = sanitizeWithFont(f.content, regular)
      pageOf(cur).drawText(safe, {
        x: cur.x + lw + 2,
        y: cur.y,
        size: s.content,
        font: regular,
        color: f.link ? accentColorFor(cur) : textColorFor(cur),
      })
      if (f.link) {
        const w = regular.widthOfTextAtSize(safe, s.content)
        addLinkAnnotation(pdf, pageOf(cur), cur.x + lw + 2, cur.y, w, s.content, f.content)
      }
      cur.y -= s.content + 4
    }
    cur.y -= 4
  }

  // contact line (single layouts)
  const drawContactRow = (page: any, centerY: number, centered: boolean, color: RGB, textColorOverride?: RGB) => {
    const b = resumeData.basics
    const parts: { text: string; link?: string }[] = []
    if (b.email) parts.push({ text: b.email, link: `mailto:${b.email}` })
    if (b.phone) parts.push({ text: b.phone })
    if (b.location) parts.push({ text: b.location })
    if (b.linkedin) parts.push({ text: b.linkedin, link: b.linkedin })
    if (!parts.length) return centerY
    const sep = "   |   "
    const sz = s.small
    const segs: string[] = []
    parts.forEach((p, i) => {
      if (i > 0) segs.push(sep)
      segs.push(p.text)
    })
    const totalW = segs.reduce((w, t) => w + regular.widthOfTextAtSize(t, sz), 0)
    let x = centered ? (PAGE_W - totalW) / 2 : margin + stripeW
    const usecolor = textColorOverride || color
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        page.drawText(sep, { x, y: centerY, size: sz, font: regular, color: usecolor })
        x += regular.widthOfTextAtSize(sep, sz)
      }
      const safe = sanitizeWithFont(parts[i].text, regular)
      page.drawText(safe, { x, y: centerY, size: sz, font: regular, color: usecolor })
      const w = regular.widthOfTextAtSize(safe, sz)
      if (parts[i].link) addLinkAnnotation(pdf, page, x, centerY, w, sz, parts[i].link!)
      x += w
    }
    return centerY
  }

  // =========================================================================
  // LAYOUT: SIDEBAR-LEFT
  // =========================================================================
  if (design.layout === "sidebar-left") {
    const allSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
    const sidebarTypes = ["skills", "languages", "certifications"]
    const sideSections = allSections.filter(
      (sec: any) => sec.column === 1 || (!sec.column && sidebarTypes.includes(sec.type)),
    )
    const mainSections = allSections.filter(
      (sec: any) => !(sec.column === 1 || (!sec.column && sidebarTypes.includes(sec.type))),
    )

    const side: Cursor = { x: margin, width: sidebarW - 2 * margin, isSidebar: true, y: PAGE_H - margin, pageIndex: 0 }
    const main: Cursor = {
      x: sidebarW + margin,
      width: PAGE_W - sidebarW - 2 * margin,
      isSidebar: false,
      y: PAGE_H - margin,
      pageIndex: 0,
    }

    // sidebar contact
    side.y -= 4
    const contactLabelColor = colors.sidebarHeading || colors.heading
    const renderSideContact = (label: string, value: string, link?: string) => {
      if (!value) return
      ensure(side, 24)
      drawTracked(pageOf(side), label.toUpperCase(), side.x, side.y, s.small, bold, contactLabelColor, 0.6)
      side.y -= s.small + 3
      para(side, value, {
        size: s.content,
        font: regular,
        color: colors.sidebarText || colors.text,
        link,
        lineGap: s.content + 2,
      })
      side.y -= 6
    }
    renderSideContact("Email", resumeData.basics.email, resumeData.basics.email ? `mailto:${resumeData.basics.email}` : undefined)
    renderSideContact("Phone", resumeData.basics.phone)
    renderSideContact("Location", resumeData.basics.location)
    renderSideContact("LinkedIn", resumeData.basics.linkedin, resumeData.basics.linkedin)
    side.y -= 6

    for (const sec of sideSections) {
      if (!sectionHasContent(sec)) continue
      sectionTitle(side, sec.title)
      renderSectionBody(side, sec)
      side.y -= 6
    }

    // main: name + summary + sections
    main.y -= 4
    const nameText = design.uppercaseName ? resumeData.basics.name.toUpperCase() : resumeData.basics.name
    const nameLines = wrapText(nameText, main.width, bold, s.name)
    for (const line of nameLines) {
      ensure(main, s.name + 6)
      pageOf(main).drawText(sanitizeWithFont(line, bold), {
        x: main.x,
        y: main.y,
        size: s.name,
        font: bold,
        color: colors.name,
      })
      main.y -= s.name + 4
    }
    pageOf(main).drawLine({
      start: { x: main.x, y: main.y + 4 },
      end: { x: main.x + main.width, y: main.y + 4 },
      thickness: 2,
      color: colors.accent,
    })
    main.y -= 16

    if (resumeData.basics.summary) {
      para(main, resumeData.basics.summary, {
        size: s.content,
        font: regular,
        color: colors.text,
        lineGap: s.content + 3,
      })
      main.y -= 12
    }

    for (const sec of mainSections) {
      if (sec.type === "custom-fields") {
        sectionTitle(main, sec.title)
        renderCustomFields(main)
        main.y -= 6
        continue
      }
      if (!sectionHasContent(sec)) continue
      sectionTitle(main, sec.title)
      renderSectionBody(main, sec)
      main.y -= 6
    }

    return await pdf.save()
  }

  // =========================================================================
  // LAYOUT: SINGLE COLUMN
  // =========================================================================
  const contentX = margin + stripeW
  const contentW = PAGE_W - 2 * margin - stripeW
  const cur: Cursor = { x: contentX, width: contentW, isSidebar: false, y: PAGE_H - margin, pageIndex: 0 }
  const firstPage = pages[0]

  const nameText = design.uppercaseName ? resumeData.basics.name.toUpperCase() : resumeData.basics.name

  if (design.header === "band" && colors.headerBg) {
    const bandH = 96
    firstPage.drawRectangle({ x: 0, y: PAGE_H - bandH, width: PAGE_W, height: bandH, color: colors.headerBg })
    if (design.accentStripe) {
      firstPage.drawRectangle({ x: 0, y: PAGE_H - bandH, width: stripeW, height: bandH, color: colors.accent })
    }
    const nameY = PAGE_H - 42
    const nw = trackedWidth(nameText, s.name, bold, 0.5)
    drawTracked(firstPage, nameText, (PAGE_W - nw) / 2, nameY, s.name, bold, colors.headerText || rgb(1, 1, 1), 0.5)
    drawContactRow(firstPage, PAGE_H - 66, true, colors.headerText || rgb(1, 1, 1))
    cur.y = PAGE_H - bandH - 24
  } else if (design.header === "centered") {
    const nw = trackedWidth(nameText, s.name, bold, 0.5)
    ensure(cur, s.name + 10)
    drawTracked(firstPage, nameText, (PAGE_W - nw) / 2, cur.y, s.name, bold, colors.name, 0.5)
    cur.y -= s.name + 8
    drawContactRow(firstPage, cur.y, true, colors.secondary)
    cur.y -= s.small + 8
    firstPage.drawLine({
      start: { x: cur.x, y: cur.y + 4 },
      end: { x: cur.x + cur.width, y: cur.y + 4 },
      thickness: 1.2,
      color: colors.divider,
    })
    cur.y -= 14
  } else {
    // left header
    ensure(cur, s.name + 10)
    firstPage.drawText(sanitizeWithFont(nameText, bold), {
      x: cur.x,
      y: cur.y,
      size: s.name,
      font: bold,
      color: colors.name,
    })
    cur.y -= s.name + 6
    drawContactRow(firstPage, cur.y, false, colors.secondary)
    cur.y -= s.small + 8
    firstPage.drawLine({
      start: { x: cur.x, y: cur.y + 4 },
      end: { x: cur.x + cur.width, y: cur.y + 4 },
      thickness: 1.4,
      color: colors.accent,
    })
    cur.y -= 14
  }

  if (resumeData.basics.summary) {
    para(cur, resumeData.basics.summary, {
      size: s.content,
      font: regular,
      color: colors.text,
      lineGap: s.content + 3,
    })
    cur.y -= 12
  }

  const allSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
  for (const sec of allSections as any[]) {
    if (sec.type === "custom-fields") {
      const entries = Object.values(resumeData.custom || {}).filter((f: any) => f && !f.hidden && f.content)
      if (!entries.length) continue
      sectionTitle(cur, sec.title)
      renderCustomFields(cur)
      cur.y -= 6
      continue
    }
    if (!sectionHasContent(sec)) continue
    sectionTitle(cur, sec.title)
    renderSectionBody(cur, sec)
    cur.y -= 6
  }

  return await pdf.save()
}
