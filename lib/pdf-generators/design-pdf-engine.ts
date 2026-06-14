import { PDFDocument, StandardFonts, rgb } from "@pdfme/pdf-lib"
import type { PDFGenerationOptions } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"
import { wrapText } from "../pdf-utils"
import { sanitizeWithFont, hexToRgb, addLinkAnnotation } from "./pdf-helpers"
import type { ResumeDesign } from "../resume-designs"
import { skillDotsFilled, effectiveSkillLevel } from "../resume-designs"

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

  // Role/headline shown under the name (derived from the most recent experience role).
  const firstRole: string = (() => {
    const exp: any = (resumeData.sections || []).find((sec: any) => sec.type === "experience")
    return (exp && exp.items && exp.items[0] && exp.items[0].role) || ""
  })()

  // User toggle: draw proficiency bars/dots (skills + language dots). Default on.
  const skillLevelsOn: boolean = (() => {
    const sk: any = (resumeData.sections || []).find((sec: any) => sec.type === "skills")
    return !sk || sk.showLevels !== false
  })()

  const isSidebarLayout = design.layout === "sidebar-left" || design.layout === "sidebar-right"
  const sidebarRight = design.layout === "sidebar-right"
  const margin = isSidebarLayout ? 28 : design.id === "compact-pro" ? 36 : 44
  const stripeW = design.accentStripe ? 8 : 0
  const sidebarW = 188
  const sidebarX0 = sidebarRight ? PAGE_W - sidebarW : 0 // left edge of the sidebar band

  const pages: any[] = []

  const paintPageChrome = (page: any) => {
    if (isSidebarLayout && colors.sidebarBg) {
      page.drawRectangle({ x: sidebarX0, y: 0, width: sidebarW, height: PAGE_H, color: colors.sidebarBg })
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

    if (style === "boxed") {
      // Filled accent bar behind the heading text (chip), with light text.
      const padX = 8
      const padV = 4
      const tw = trackedWidth(title, size, bold, tracking)
      const boxH = size + 2 * padV
      const boxBottom = cur.y - 0.25 * size - padV
      const chipColor = accentColorFor(cur)
      const chipText = cur.isSidebar ? colors.sidebarBg || rgb(1, 1, 1) : rgb(1, 1, 1)
      roundedRect(pageOf(cur), cur.x, boxBottom, tw + 2 * padX, boxH, 3, chipColor)
      drawTracked(pageOf(cur), title, cur.x + padX, cur.y, size, bold, chipText, tracking)
      cur.y = boxBottom - 12
      return
    }

    if (style === "pill") {
      // Prominent rounded "tab" header: white pill w/ dark text on the sidebar,
      // accent pill w/ light text in the main column.
      const padX = 11
      const padV = 5
      const tw = trackedWidth(title, size, bold, tracking)
      const boxH = size + 2 * padV
      const boxBottom = cur.y - 0.25 * size - padV
      const pillBg = cur.isSidebar ? rgb(1, 1, 1) : accentColorFor(cur)
      const pillText = cur.isSidebar ? colors.sidebarBg || colors.heading : rgb(1, 1, 1)
      roundedRect(pageOf(cur), cur.x, boxBottom, tw + 2 * padX, boxH, boxH / 2, pillBg)
      drawTracked(pageOf(cur), title, cur.x + padX, cur.y, size, bold, pillText, tracking)
      cur.y = boxBottom - 13
      return
    }

    if (style === "centered") {
      const w = trackedWidth(title, size, bold, tracking)
      drawTracked(pageOf(cur), title, cur.x + (cur.width - w) / 2, cur.y, size, bold, titleColorFor(cur), tracking)
      const lineY = cur.y - (size * 0.4 + 3)
      pageOf(cur).drawLine({
        start: { x: cur.x, y: lineY },
        end: { x: cur.x + cur.width, y: lineY },
        thickness: 0.75,
        color: cur.isSidebar ? accentColorFor(cur) : colors.divider,
      })
      cur.y = lineY - 13
      return
    }

    drawTracked(pageOf(cur), title, cur.x, cur.y, size, bold, titleColorFor(cur), tracking)
    const baseline = cur.y

    if (style === "rule-full" || style === "underline") {
      // Place the rule just below the heading text (small gap above), then leave
      // a comfortable gap before the content. Keep the rule thin and crisp.
      const lineY = baseline - (size * 0.4 + 2)
      pageOf(cur).drawLine({
        start: { x: cur.x, y: lineY },
        end: { x: cur.x + cur.width, y: lineY },
        thickness: style === "underline" ? 1 : 0.75,
        color: style === "underline" ? accentColorFor(cur) : cur.isSidebar ? accentColorFor(cur) : colors.divider,
      })
      cur.y = lineY - 13
    } else {
      // plain
      cur.y -= size + 2
    }
  }

  const bullets = (cur: Cursor, items: string[], color: RGB) => {
    for (const it of items) {
      if (!it) continue
      para(cur, `• ${it}`, { size: s.content, font: regular, color, indent: 10, lineGap: s.content + 3 })
    }
  }

  // Filled rounded rectangle (pdf-lib has no native corner radius) — composed
  // from two rects + four corner circles.
  const roundedRect = (page: any, x: number, y: number, w: number, h: number, r: number, color: RGB) => {
    const rr = Math.max(0, Math.min(r, h / 2, w / 2))
    if (rr <= 0.5) {
      page.drawRectangle({ x, y, width: w, height: h, color })
      return
    }
    page.drawRectangle({ x: x + rr, y, width: w - 2 * rr, height: h, color })
    page.drawRectangle({ x, y: y + rr, width: w, height: h - 2 * rr, color })
    page.drawCircle({ x: x + rr, y: y + rr, size: rr, color })
    page.drawCircle({ x: x + w - rr, y: y + rr, size: rr, color })
    page.drawCircle({ x: x + rr, y: y + h - rr, size: rr, color })
    page.drawCircle({ x: x + w - rr, y: y + h - rr, size: rr, color })
  }

  const skillPills = (cur: Cursor, groups: { title: string; skills: string[] }[]) => {
    const pillBg = cur.isSidebar ? colors.sidebarAccent || colors.accent : col(c.divider)
    const pillText = cur.isSidebar ? colors.sidebarBg || rgb(1, 1, 1) : colors.text
    const S = s.content
    const padH = 9 // horizontal padding (text appears centered)
    const padV = 4 // vertical padding
    const pillH = S + 2 * padV
    const rowStep = pillH + 5
    cur.y -= 6 // extra breathing room between the section rule and the pills
    for (const g of groups) {
      if (g.title && g.title !== "General") {
        para(cur, g.title, { size: s.small, font: bold, color: secondaryColorFor(cur), lineGap: s.small + 4 })
        cur.y -= 6 // clearance so pill tops don't crowd the group label
      }
      let px = cur.x
      ensure(cur, rowStep)
      for (const skill of g.skills) {
        const safe = sanitizeWithFont(skill, regular)
        const tw = regular.widthOfTextAtSize(safe, S)
        const pw = tw + 2 * padH
        if (px + pw > cur.x + cur.width) {
          px = cur.x
          cur.y -= rowStep
          ensure(cur, rowStep)
        }
        const by = cur.y // text baseline
        const pillBottom = by - 0.25 * S - padV // vertically centers the text in the pill
        roundedRect(pageOf(cur), px, pillBottom, pw, pillH, pillH / 2, pillBg)
        pageOf(cur).drawText(safe, { x: px + padH, y: by, size: S, font: regular, color: pillText })
        px += pw + 6
      }
      cur.y -= pillH + 6
    }
  }

  // ---- designer primitives: monogram, skill bars, skill/language dots ----
  const initials = (name: string) =>
    (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()

  const drawMonogram = (page: any, cx: number, cy: number, r: number, fill: RGB, textColor: RGB) => {
    page.drawCircle({ x: cx, y: cy, size: r, color: fill })
    const init = sanitizeWithFont(initials(resumeData.basics.name), bold)
    const fs = r
    const w = bold.widthOfTextAtSize(init, fs)
    page.drawText(init, { x: cx - w / 2, y: cy - fs * 0.35, size: fs, font: bold, color: textColor })
  }

  // a label on the left + 5 filled/empty proficiency dots right-aligned
  const drawDotRow = (cur: Cursor, label: string, filled: number) => {
    const dotR = 2.4
    const gap = 4
    const size = s.content
    ensure(cur, size + 8)
    const p = pageOf(cur)
    p.drawText(sanitizeWithFont(label, regular), { x: cur.x, y: cur.y, size, font: regular, color: textColorFor(cur) })
    const dotsW = 5 * (dotR * 2) + 4 * gap
    let dx = cur.x + cur.width - dotsW
    const dy = cur.y + size * 0.28
    const empty = cur.isSidebar ? rgb(0.42, 0.42, 0.42) : col(c.divider)
    for (let k = 0; k < 5; k++) {
      p.drawCircle({ x: dx + dotR, y: dy, size: dotR, color: k < filled ? accentColorFor(cur) : empty })
      dx += dotR * 2 + gap
    }
    cur.y -= size + 8
  }

  type SkillGroups = { title: string; skills: string[] }[]
  type Levels = Record<string, number>

  const skillBars = (cur: Cursor, groups: SkillGroups, levels: Levels) => {
    const barH = 4
    for (const g of groups) {
      if (g.title && g.title !== "General") {
        para(cur, g.title, { size: s.small, font: bold, color: secondaryColorFor(cur), lineGap: s.small + 4 })
      }
      g.skills.forEach((skill, i) => {
        ensure(cur, s.content + barH + 11)
        const p = pageOf(cur)
        p.drawText(sanitizeWithFont(skill, regular), { x: cur.x, y: cur.y, size: s.content, font: regular, color: textColorFor(cur) })
        const barY = cur.y - barH - 4
        const track = cur.isSidebar ? rgb(0.42, 0.42, 0.42) : col(c.divider)
        roundedRect(p, cur.x, barY, cur.width, barH, barH / 2, track)
        roundedRect(p, cur.x, barY, cur.width * (effectiveSkillLevel(levels, skill, i) / 5), barH, barH / 2, accentColorFor(cur))
        cur.y = barY - 9
      })
      cur.y -= 4
    }
  }

  const skillDots = (cur: Cursor, groups: SkillGroups, levels: Levels) => {
    for (const g of groups) {
      if (g.title && g.title !== "General") {
        para(cur, g.title, { size: s.small, font: bold, color: secondaryColorFor(cur), lineGap: s.small + 4 })
      }
      g.skills.forEach((skill, i) => drawDotRow(cur, skill, effectiveSkillLevel(levels, skill, i)))
      cur.y -= 4
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
      const rw = rightOfSub ? regular.widthOfTextAtSize(rightOfSub, s.small) : 0
      // Constrain the subtitle so a long degree/company never collides with the
      // right-aligned location; overflow wraps onto its own lines.
      const subMax = cur.width - tlIndent - (rw ? rw + 10 : 0)
      const subLines = subtitle ? wrapText(subtitle, subMax, bold, s.content) : [""]
      subLines.forEach((line, i) => {
        ensure(cur, s.content + 2)
        pageOf(cur).drawText(sanitizeWithFont(line, bold), {
          x: cur.x + tlIndent,
          y: cur.y,
          size: s.content,
          font: bold,
          color: accentColorFor(cur),
        })
        if (i === 0 && rightOfSub) {
          pageOf(cur).drawText(sanitizeWithFont(rightOfSub, regular), {
            x: cur.x + cur.width - rw,
            y: cur.y,
            size: s.small,
            font: regular,
            color: secondaryColorFor(cur),
          })
        }
        cur.y -= s.content + (i === subLines.length - 1 ? 4 : 2)
      })
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
        // When the user turns off level indicators, bars/dots fall back to pills.
        const eff = !skillLevelsOn && (design.skillStyle === "bars" || design.skillStyle === "dots") ? "pills" : design.skillStyle
        const lv = (section.skillLevels || {}) as Record<string, number>
        if (eff === "bars") skillBars(cur, groups, lv)
        else if (eff === "dots") skillDots(cur, groups, lv)
        else if (eff === "pills") skillPills(cur, groups)
        else if (eff === "bullets" || cur.isSidebar) {
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
        if (design.skillStyle === "dots" && skillLevelsOn) {
          ;(section.items || []).filter(Boolean).forEach((it: string, i: number) => drawDotRow(cur, it, skillDotsFilled(i)))
        } else {
          bullets(cur, (section.items || []).filter(Boolean), textColorFor(cur))
        }
        cur.y -= 4
        break
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
      const contentColor = f.link ? accentColorFor(cur) : textColorFor(cur)
      // Wrap long content (e.g. URLs) so it never clips at the column edge.
      const lines = wrapText(String(f.content), cur.width - lw - 2, regular, s.content)
      lines.forEach((line, i) => {
        if (i > 0) ensure(cur, s.content + 2)
        const lx = i === 0 ? cur.x + lw + 2 : cur.x
        const safe = sanitizeWithFont(line, regular)
        pageOf(cur).drawText(safe, { x: lx, y: cur.y, size: s.content, font: regular, color: contentColor })
        if (f.link) {
          const w = regular.widthOfTextAtSize(safe, s.content)
          addLinkAnnotation(pdf, pageOf(cur), lx, cur.y, w, s.content, f.content)
        }
        cur.y -= s.content + (i === lines.length - 1 ? 4 : 2)
      })
    }
    cur.y -= 4
  }

  // contact helpers (single-column layouts) — wrap so long emails/URLs never
  // overflow the page width.
  type Seg = { text: string; link?: string; w: number }
  const CONTACT_SEP = "  |  "
  const contactParts = (): { text: string; link?: string }[] => {
    const b = resumeData.basics
    const parts: { text: string; link?: string }[] = []
    if (b.email) parts.push({ text: b.email, link: `mailto:${b.email}` })
    if (b.phone) parts.push({ text: b.phone })
    if (b.location) parts.push({ text: b.location })
    if (b.linkedin) parts.push({ text: b.linkedin, link: b.linkedin })
    return parts
  }
  const groupContact = (maxWidth: number): Seg[][] => {
    const sz = s.small
    const sepW = regular.widthOfTextAtSize(CONTACT_SEP, sz)
    const lines: Seg[][] = []
    let line: Seg[] = []
    let lineW = 0
    for (const p of contactParts()) {
      const text = sanitizeWithFont(p.text, regular)
      const w = regular.widthOfTextAtSize(text, sz)
      const addW = (line.length ? sepW : 0) + w
      if (line.length && lineW + addW > maxWidth) {
        lines.push(line)
        line = []
        lineW = 0
      }
      line.push({ text, link: p.link, w })
      lineW += (line.length > 1 ? sepW : 0) + w
    }
    if (line.length) lines.push(line)
    return lines
  }
  const drawContactLine = (page: any, segs: Seg[], baseline: number, centered: boolean, color: RGB, leftX: number) => {
    const sz = s.small
    const sepW = regular.widthOfTextAtSize(CONTACT_SEP, sz)
    const lineW = segs.reduce((acc, sg, i) => acc + (i ? sepW : 0) + sg.w, 0)
    let x = centered ? (PAGE_W - lineW) / 2 : leftX
    segs.forEach((sg, i) => {
      if (i > 0) {
        page.drawText(CONTACT_SEP, { x, y: baseline, size: sz, font: regular, color })
        x += sepW
      }
      page.drawText(sg.text, { x, y: baseline, size: sz, font: regular, color })
      if (sg.link) addLinkAnnotation(pdf, page, x, baseline, sg.w, sz, sg.link)
      x += sg.w
    })
  }
  // Draw a (possibly multi-line) wrapped name. `topY` is the top of the first
  // line; returns the y just below the last line.
  const drawNameLines = (page: any, lines: string[], topY: number, centered: boolean, color: RGB, leftX: number) => {
    let top = topY
    const lh = s.name + 5
    for (const line of lines) {
      const baseline = top - s.name * 0.8
      const w = bold.widthOfTextAtSize(sanitizeWithFont(line, bold), s.name)
      const x = centered ? (PAGE_W - w) / 2 : leftX
      page.drawText(sanitizeWithFont(line, bold), { x, y: baseline, size: s.name, font: bold, color })
      top -= lh
    }
    return top
  }

  // =========================================================================
  // LAYOUT: SIDEBAR (left or right)
  // =========================================================================
  if (isSidebarLayout) {
    const allSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
    const sidebarTypes = ["skills", "languages", "certifications"]
    const sideSections = allSections.filter(
      (sec: any) => sec.column === 1 || (!sec.column && sidebarTypes.includes(sec.type)),
    )
    const mainSections = allSections.filter(
      (sec: any) => !(sec.column === 1 || (!sec.column && sidebarTypes.includes(sec.type))),
    )

    const side: Cursor = { x: sidebarX0 + margin, width: sidebarW - 2 * margin, isSidebar: true, y: PAGE_H - margin, pageIndex: 0 }
    const main: Cursor = {
      x: sidebarRight ? margin : sidebarW + margin,
      width: PAGE_W - sidebarW - 2 * margin,
      isSidebar: false,
      y: PAGE_H - margin,
      pageIndex: 0,
    }

    // two-tone accent block at the top of the sidebar: monogram + name + role
    if (design.sidebarNameBlock) {
      const blockPad = 14
      const innerW = sidebarW - 2 * blockPad
      const nm = design.uppercaseName ? resumeData.basics.name.toUpperCase() : resumeData.basics.name
      const nameSize = Math.min(s.name, 19)
      const nameLines = wrapText(nm, innerW, bold, nameSize)
      const r = design.monogram ? 22 : 0
      const topPad = 22
      const monoBlock = r ? r * 2 + 12 : 0
      const roleBlock = firstRole ? s.small + 6 : 0
      const blockH = topPad + monoBlock + nameLines.length * (nameSize + 3) + roleBlock + 18
      pageOf(side).drawRectangle({ x: sidebarX0, y: PAGE_H - blockH, width: sidebarW, height: blockH, color: colors.accent })
      let by = PAGE_H - topPad
      if (r) {
        drawMonogram(pageOf(side), sidebarX0 + sidebarW / 2, by - r, r, rgb(1, 1, 1), colors.accent)
        by -= r * 2 + 12
      }
      for (const line of nameLines) {
        const safe = sanitizeWithFont(line, bold)
        const w = bold.widthOfTextAtSize(safe, nameSize)
        pageOf(side).drawText(safe, { x: sidebarX0 + (sidebarW - w) / 2, y: by - nameSize, size: nameSize, font: bold, color: rgb(1, 1, 1) })
        by -= nameSize + 3
      }
      if (firstRole) {
        const safe = sanitizeWithFont(firstRole, regular)
        const w = regular.widthOfTextAtSize(safe, s.small)
        pageOf(side).drawText(safe, { x: sidebarX0 + (sidebarW - w) / 2, y: by - s.small - 1, size: s.small, font: regular, color: rgb(1, 1, 1) })
      }
      side.y = PAGE_H - blockH - 16
    } else if (design.monogram) {
      const r = 24
      const cx = sidebarX0 + sidebarW / 2
      const cy = side.y - r
      drawMonogram(pageOf(side), cx, cy, r, colors.sidebarAccent || colors.accent, colors.sidebarBg || rgb(1, 1, 1))
      side.y = cy - r - 14
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
    main.y -= 8
    if (!design.sidebarNameBlock) {
      const nameText = design.uppercaseName ? resumeData.basics.name.toUpperCase() : resumeData.basics.name
      const nameLines = wrapText(nameText, main.width, bold, s.name)
      // drawNameLines positions the baseline so the cap height sits below the
      // top margin (proper top padding) and leaves a tight, controlled trailing gap.
      main.y = drawNameLines(pageOf(main), nameLines, main.y, false, colors.name, main.x)
      if (design.showRole && firstRole) {
        pageOf(main).drawText(sanitizeWithFont(firstRole, regular), { x: main.x, y: main.y - s.content * 0.8, size: s.content, font: regular, color: colors.accent })
        main.y -= s.content + 4
      }
      pageOf(main).drawLine({
        start: { x: main.x, y: main.y - 3 },
        end: { x: main.x + main.width, y: main.y - 3 },
        thickness: 2,
        color: colors.accent,
      })
      main.y -= 22 // clearance below the accent rule before the summary/first section
    }

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
  const nameLH = s.name + 5
  const contLH = s.small + 5

  if (design.header === "band" && colors.headerBg) {
    const headerText = colors.headerText || rgb(1, 1, 1)
    const innerPad = 40
    const innerW = PAGE_W - 2 * innerPad
    const nameLines = wrapText(nameText, innerW, bold, s.name)
    const contactLines = groupContact(innerW)
    const topPad = 24
    const midGap = 10
    const botPad = 20
    const roleLH = design.showRole && firstRole ? s.content + 6 : 0
    const bandH =
      topPad +
      nameLines.length * nameLH +
      roleLH +
      (contactLines.length ? midGap + contactLines.length * contLH : 0) +
      botPad
    firstPage.drawRectangle({ x: 0, y: PAGE_H - bandH, width: PAGE_W, height: bandH, color: colors.headerBg })
    if (design.accentStripe) {
      firstPage.drawRectangle({ x: 0, y: PAGE_H - bandH, width: stripeW, height: bandH, color: colors.accent })
    }
    let top = drawNameLines(firstPage, nameLines, PAGE_H - topPad, true, headerText, innerPad)
    if (design.showRole && firstRole) {
      const safe = sanitizeWithFont(firstRole, regular)
      const w = regular.widthOfTextAtSize(safe, s.content)
      firstPage.drawText(safe, { x: (PAGE_W - w) / 2, y: top - s.content * 0.8, size: s.content, font: regular, color: headerText })
      top -= roleLH
    }
    if (contactLines.length) {
      top -= midGap
      for (const ln of contactLines) {
        drawContactLine(firstPage, ln, top - s.small * 0.8, true, headerText, innerPad)
        top -= contLH
      }
    }
    cur.y = PAGE_H - bandH - 22
  } else if (design.header === "geometric" && colors.headerBg) {
    // Two-tone split banner: accent block with big initials on the left,
    // name + contact on the right.
    const headerText = colors.headerText || rgb(1, 1, 1)
    const splitX = 150
    const rightX = splitX + 22
    const innerW = PAGE_W - rightX - 36
    const nameLines = wrapText(nameText, innerW, bold, s.name)
    const contactLines = groupContact(innerW)
    const topPad = 28
    const midGap = 10
    const botPad = 26
    const roleLH = design.showRole && firstRole ? s.content + 6 : 0
    const bandH =
      topPad +
      nameLines.length * nameLH +
      roleLH +
      (contactLines.length ? midGap + contactLines.length * contLH : 0) +
      botPad
    firstPage.drawRectangle({ x: 0, y: PAGE_H - bandH, width: PAGE_W, height: bandH, color: colors.headerBg })
    firstPage.drawRectangle({ x: 0, y: PAGE_H - bandH, width: splitX, height: bandH, color: colors.accent })
    const init = sanitizeWithFont(initials(resumeData.basics.name), bold)
    const ifs = 36
    const iw = bold.widthOfTextAtSize(init, ifs)
    firstPage.drawText(init, {
      x: splitX / 2 - iw / 2,
      y: PAGE_H - bandH / 2 - ifs * 0.35,
      size: ifs,
      font: bold,
      color: headerText,
    })
    let top = drawNameLines(firstPage, nameLines, PAGE_H - topPad, false, headerText, rightX)
    if (design.showRole && firstRole) {
      firstPage.drawText(sanitizeWithFont(firstRole, regular), { x: rightX, y: top - s.content * 0.8, size: s.content, font: regular, color: headerText })
      top -= roleLH
    }
    if (contactLines.length) {
      top -= midGap
      for (const ln of contactLines) {
        drawContactLine(firstPage, ln, top - s.small * 0.8, false, headerText, rightX)
        top -= contLH
      }
    }
    cur.y = PAGE_H - bandH - 22
  } else if (design.header === "centered") {
    const nameLines = wrapText(nameText, cur.width, bold, s.name)
    ensure(cur, nameLines.length * nameLH + 10)
    cur.y = drawNameLines(firstPage, nameLines, cur.y, true, colors.name, cur.x) - 4
    for (const ln of groupContact(cur.width)) {
      drawContactLine(firstPage, ln, cur.y - s.small * 0.8, true, colors.secondary, cur.x)
      cur.y -= contLH
    }
    cur.y -= 6
    firstPage.drawLine({
      start: { x: cur.x, y: cur.y + 4 },
      end: { x: cur.x + cur.width, y: cur.y + 4 },
      thickness: 1.2,
      color: colors.divider,
    })
    cur.y -= 14
  } else {
    // left header
    if (design.monogram) {
      const r = 22
      const cy = cur.y - r
      drawMonogram(firstPage, cur.x + r, cy, r, colors.accent, rgb(1, 1, 1))
      cur.y = cy - r - 12
    }
    const nameLines = wrapText(nameText, cur.width, bold, s.name)
    ensure(cur, nameLines.length * nameLH + 10)
    cur.y = drawNameLines(firstPage, nameLines, cur.y, false, colors.name, cur.x) - 2
    if (design.showRole && firstRole) {
      firstPage.drawText(sanitizeWithFont(firstRole, regular), { x: cur.x, y: cur.y - s.content * 0.8, size: s.content, font: regular, color: colors.accent })
      cur.y -= s.content + 4
    }
    for (const ln of groupContact(cur.width)) {
      drawContactLine(firstPage, ln, cur.y - s.small * 0.8, false, colors.secondary, cur.x)
      cur.y -= contLH
    }
    cur.y -= 6
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
