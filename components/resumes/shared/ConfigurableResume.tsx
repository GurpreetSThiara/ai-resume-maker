"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { ResumeData } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"
import ProjectSection from "../../resume-components/project-section"
import type { ResumeDesign } from "@/lib/resume-designs"
import { skillDotsFilled, effectiveSkillLevel } from "@/lib/resume-designs"

const getInitials = (name: string) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

interface ConfigurableResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
  design: ResumeDesign
}

const hx = (h?: string) => (h ? `#${h}` : undefined)

export const ConfigurableResume: React.FC<ConfigurableResumeProps> = ({
  pdfRef,
  font,
  resumeData,
  setResumeData,
  design,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const parent = containerRef.current.parentElement
      if (!parent) return
      const widthScale = parent.clientWidth / 595
      const heightScale = parent.clientHeight / 842
      let newScale = Math.min(widthScale, heightScale, 1)
      if (window.innerWidth >= 768 && newScale > 0.92) newScale = 0.92
      setScale(newScale)
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  // ---------- editing handlers ----------
  const handleNameChange = (e: React.FormEvent<HTMLElement>) =>
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, name: e.currentTarget?.textContent || "" } }))

  const handleSummaryChange = (e: React.FormEvent<HTMLElement>) =>
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, summary: e.currentTarget?.textContent || "" } }))

  const handleContactInfoChange = (e: React.FormEvent<HTMLElement>, key: keyof typeof resumeData.basics) =>
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: e.currentTarget?.textContent || "" } }))

  const handleSectionTitleChange = (sectionId: string, newTitle: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const idx = updated.sections.findIndex((s) => s.id === sectionId)
      if (idx !== -1) updated.sections[idx].title = newTitle
      return updated
    })

  const handleSectionItemChange = (sectionId: string, itemIndex: number, field: string, value: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section) return prev
      if (section.type === SECTION_TYPES.EDUCATION || section.type === SECTION_TYPES.EXPERIENCE) {
        ;(section.items[itemIndex] as any)[field] = value
      }
      return updated
    })

  const handleHighlightChange = (sectionId: string, itemIndex: number, hi: number, txt: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.EDUCATION) return prev
      const edu = section.items[itemIndex]
      if (edu.highlights && edu.highlights[hi] !== undefined) edu.highlights[hi] = txt
      return updated
    })

  const handleAchievementChange = (sectionId: string, itemIndex: number, ai: number, txt: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.EXPERIENCE) return prev
      const exp = section.items[itemIndex]
      if (exp.achievements && exp.achievements[ai] !== undefined) exp.achievements[ai] = txt
      return updated
    })

  const handleProjectFieldChange = (sectionId: string | undefined, pi: number, field: string, value: string) => {
    if (!sectionId) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.PROJECTS) return prev
      if (!section.items) section.items = [] as any
      ;(section.items[pi] as any)[field] = value
      return updated
    })
  }

  const handleProjectDescriptionChange = (sectionId: string | undefined, pi: number, di: number, value: string) => {
    if (!sectionId) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.PROJECTS) return prev
      const proj = section.items[pi] as any
      if (!proj) return prev
      if (!Array.isArray(proj.description)) proj.description = []
      proj.description[di] = value
      return updated
    })
  }

  const handleSkillsChange = (sectionId: string, updatedGroups: any[]) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section) return prev
      if ("groups" in section) (section as any).groups = updatedGroups
      const flat = updatedGroups.flatMap((g) => g.skills)
      if ("items" in section) (section as any).items = flat
      return updated
    })

  const handleListChange = (sectionId: string, idx: number, value: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section) return prev
      if (section.type === SECTION_TYPES.CERTIFICATIONS || section.type === SECTION_TYPES.LANGUAGES) {
        if (!(section as any).items) (section as any).items = []
        ;(section as any).items[idx] = value
      }
      return updated
    })

  const handleCustomContentChange = (sectionId: string, idx: number, value: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.CUSTOM) return prev
      if (!section.content) section.content = []
      section.content[idx] = value
      return updated
    })

  const handleCustomFieldChange = (key: string, field: "title" | "content", value: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      if (updated.custom[key]) updated.custom[key][field] = value
      return updated
    })

  // ---------- derived palette ----------
  const c = design.colors
  const palette = {
    name: hx(c.name)!,
    heading: hx(c.heading)!,
    accent: hx(c.accent)!,
    text: hx(c.text)!,
    secondary: hx(c.secondary)!,
    divider: hx(c.divider)!,
    headerBg: hx(c.headerBg),
    headerText: hx(c.headerText),
    sidebarBg: hx(c.sidebarBg),
    sidebarText: hx(c.sidebarText),
    sidebarHeading: hx(c.sidebarHeading),
    sidebarAccent: hx(c.sidebarAccent),
  }
  const firstRole: string = (() => {
    const exp: any = (resumeData.sections || []).find((s: any) => s.type === SECTION_TYPES.EXPERIENCE)
    return (exp && exp.items && exp.items[0] && exp.items[0].role) || ""
  })()
  const skillLevelsOn: boolean = (() => {
    const sk: any = (resumeData.sections || []).find((s: any) => s.type === SECTION_TYPES.SKILLS)
    return !sk || sk.showLevels !== false
  })()
  const fam = design.font === "serif" ? 'Georgia, "Times New Roman", serif' : "Helvetica, Arial, sans-serif"
  const px = (pt: number) => `${pt * 1.34}px`

  // initials monogram circle (designer templates)
  const monogramEl = (sizePx: number, fill: string, color: string) => (
    <div
      style={{
        width: sizePx,
        height: sizePx,
        borderRadius: "50%",
        background: fill,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ color, fontWeight: 800, fontSize: `${sizePx * 0.42}px`, fontFamily: fam }}>
        {getInitials(resumeData.basics.name)}
      </span>
    </div>
  )

  const sectionTitleEl = (section: any, sidebar: boolean) => {
    const color = sidebar ? palette.sidebarHeading || palette.heading : palette.heading
    const accent = sidebar ? palette.sidebarAccent || palette.accent : palette.accent
    const base: React.CSSProperties = {
      color,
      fontFamily: fam,
      fontSize: px(sidebar ? design.sizes.section - 1 : design.sizes.section),
      fontWeight: 700,
      textTransform: design.uppercaseTitles ? "uppercase" : "none",
      letterSpacing: design.letterSpacingTitles ? "0.08em" : "normal",
      marginBottom: 6,
    }
    const style = { ...base }
    if (design.sectionTitle === "rule-full")
      Object.assign(style, { borderBottom: `1px solid ${color}`, paddingBottom: 4, marginBottom: 8 })
    else if (design.sectionTitle === "underline")
      Object.assign(style, { borderBottom: `1.5px solid ${accent}`, paddingBottom: 4, marginBottom: 8 })
    else if (design.sectionTitle === "left-bar")
      Object.assign(style, { borderLeft: `3px solid ${accent}`, paddingLeft: 8 })
    else if (design.sectionTitle === "centered")
      Object.assign(style, { textAlign: "center", borderBottom: `1px solid ${palette.divider}`, paddingBottom: 4, marginBottom: 8 })
    else if (design.sectionTitle === "boxed")
      Object.assign(style, {
        background: accent,
        color: sidebar ? palette.sidebarBg || "#fff" : "#fff",
        borderRadius: 4,
        padding: "4px 9px",
        marginBottom: 8,
        display: "inline-block",
      })
    else if (design.sectionTitle === "pill")
      Object.assign(style, {
        background: sidebar ? "#fff" : accent,
        color: sidebar ? palette.sidebarBg || palette.heading : "#fff",
        borderRadius: 9999,
        padding: "4px 13px",
        marginBottom: 8,
        display: "inline-block",
      })
    return (
      <div
        style={style}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
      >
        {section.title}
      </div>
    )
  }

  const bodyText = (sidebar: boolean) => (sidebar ? palette.sidebarText || palette.text : palette.text)
  const subColor = (sidebar: boolean) => (sidebar ? palette.sidebarText || palette.secondary : palette.secondary)
  const accentColor = (sidebar: boolean) => (sidebar ? palette.sidebarAccent || palette.accent : palette.accent)

  const renderSectionContent = (section: any, sidebar: boolean) => {
    if (section.hidden) return null
    const tColor = bodyText(sidebar)
    const sub = subColor(sidebar)
    const acc = accentColor(sidebar)
    const itemFont = px(design.sizes.item)
    const contentFont = px(design.sizes.content)
    const smallFont = px(design.sizes.small)
    const useTimeline = !!design.timeline && !sidebar

    const entryBlock = (
      key: number,
      opts: {
        sectionId: string
        index: number
        title: string
        titleField: string
        startDate: string
        endDate: string
        subtitle: string
        subtitleField: string
        location: string
      },
      children: React.ReactNode,
    ) => {
      const edit = (field: string, v: string) => handleSectionItemChange(opts.sectionId, opts.index, field, v)
      return (
        <div key={key} style={{ marginBottom: 10, position: useTimeline ? "relative" : undefined, paddingLeft: useTimeline ? 18 : 0 }}>
          {useTimeline && (
            <>
              <span style={{ position: "absolute", left: 0, top: 4, width: 8, height: 8, borderRadius: "50%", background: palette.accent }} />
              <span style={{ position: "absolute", left: 3.5, top: 12, bottom: 0, width: 1.5, background: palette.divider }} />
            </>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontWeight: 700, color: sidebar ? palette.sidebarHeading || palette.heading : palette.heading, fontSize: itemFont, fontFamily: fam }} contentEditable suppressContentEditableWarning onBlur={(e) => edit(opts.titleField, e.currentTarget.textContent || "")}>
              {opts.title}
            </span>
            <span style={{ color: sub, fontSize: smallFont, fontFamily: fam, whiteSpace: "nowrap" }}>
              <span contentEditable suppressContentEditableWarning onBlur={(e) => edit("startDate", e.currentTarget.textContent || "")}>{opts.startDate}</span>
              {(opts.startDate || opts.endDate) && " - "}
              <span contentEditable suppressContentEditableWarning onBlur={(e) => edit("endDate", e.currentTarget.textContent || "")}>{opts.endDate}</span>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ color: acc, fontWeight: 600, fontSize: contentFont, fontFamily: fam }} contentEditable suppressContentEditableWarning onBlur={(e) => edit(opts.subtitleField, e.currentTarget.textContent || "")}>
              {opts.subtitle}
            </span>
            {opts.location !== undefined && (
              <span style={{ color: sub, fontSize: smallFont, fontFamily: fam }} contentEditable suppressContentEditableWarning onBlur={(e) => edit("location", e.currentTarget.textContent || "")}>
                {opts.location}
              </span>
            )}
          </div>
          {children}
        </div>
      )
    }

    const bulletList = (items: string[], onEdit: (i: number, v: string) => void) => (
      <ul style={{ listStyle: "disc", marginLeft: 16, marginTop: 4 }}>
        {items.map((it, i) => (
          <li key={i} style={{ color: tColor, fontSize: contentFont, fontFamily: fam, lineHeight: 1.45 }} contentEditable suppressContentEditableWarning onBlur={(e) => onEdit(i, e.currentTarget.textContent || "")}>
            {it}
          </li>
        ))}
      </ul>
    )

    switch (section.type) {
      case SECTION_TYPES.EXPERIENCE:
        return (section.items || []).map((exp: any, i: number) =>
          entryBlock(
            i,
            {
              sectionId: section.id,
              index: i,
              title: exp.role,
              titleField: "role",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              subtitle: exp.company,
              subtitleField: "company",
              location: exp.location || "",
            },
            exp.achievements && bulletList(exp.achievements, (j, v) => handleAchievementChange(section.id, i, j, v)),
          ),
        )
      case SECTION_TYPES.EDUCATION:
        return (section.items || []).map((edu: any, i: number) =>
          entryBlock(
            i,
            {
              sectionId: section.id,
              index: i,
              title: edu.institution,
              titleField: "institution",
              startDate: edu.startDate || "",
              endDate: edu.endDate || "",
              subtitle: edu.degree,
              subtitleField: "degree",
              location: edu.location || "",
            },
            edu.highlights && bulletList(edu.highlights, (j, v) => handleHighlightChange(section.id, i, j, v)),
          ),
        )
      case SECTION_TYPES.PROJECTS:
        return (
          <ProjectSection
            sectionId={section.id}
            projects={section.items || []}
            textColor={tColor}
            linkColor={acc}
            contentEditable
            onProjectFieldChange={handleProjectFieldChange}
            onProjectDescriptionChange={handleProjectDescriptionChange}
            titleClassName="font-bold"
            titleStyle={{ fontSize: itemFont, fontFamily: fam, color: sidebar ? palette.sidebarHeading || palette.heading : palette.heading }}
            descriptionStyle={{ fontSize: contentFont, fontFamily: fam }}
          />
        )
      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section).filter((g) => g.skills.length > 0)
        const editGroup = (title: string, skills: string[]) => {
          const updated = groups.map((g) => (g.title === title ? { ...g, skills } : g))
          handleSkillsChange(section.id, updated)
        }
        const groupTitleEl = (title: string) =>
          title !== "General" ? (
            <div style={{ fontSize: smallFont, fontWeight: 700, color: sidebar ? palette.sidebarHeading || palette.heading : sub, textTransform: "uppercase", marginBottom: 4, fontFamily: fam }}>
              {title}
            </div>
          ) : null
        const dotEmpty = sidebar ? "rgba(255,255,255,0.3)" : palette.divider
        const skillEdit = (g: any, j: number) => (e: React.FormEvent<HTMLElement>) => {
          const v = [...g.skills]
          v[j] = e.currentTarget.textContent || ""
          editGroup(g.title, v)
        }
        // When level indicators are turned off, bars/dots fall back to pills.
        const eff = !skillLevelsOn && (design.skillStyle === "bars" || design.skillStyle === "dots") ? "pills" : design.skillStyle
        if (eff === "bars") {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              {groups.map((g) => (
                <div key={g.title}>
                  {groupTitleEl(g.title)}
                  {g.skills.map((sk, j) => (
                    <div key={j} style={{ marginBottom: 7 }}>
                      <div style={{ fontSize: contentFont, color: tColor, fontFamily: fam, marginBottom: 3 }} contentEditable suppressContentEditableWarning onBlur={skillEdit(g, j)}>
                        {sk}
                      </div>
                      <div style={{ background: sidebar ? "rgba(255,255,255,0.22)" : palette.divider, height: 5, borderRadius: 3 }}>
                        <div style={{ background: acc, width: `${(effectiveSkillLevel((section as any).skillLevels, sk, j) / 5) * 100}%`, height: "100%", borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        }
        if (eff === "dots") {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {groups.map((g) => (
                <div key={g.title}>
                  {groupTitleEl(g.title)}
                  {g.skills.map((sk, j) => {
                    const filled = effectiveSkillLevel((section as any).skillLevels, sk, j)
                    return (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: contentFont, color: tColor, fontFamily: fam }} contentEditable suppressContentEditableWarning onBlur={skillEdit(g, j)}>
                          {sk}
                        </span>
                        <span style={{ display: "inline-flex", gap: 3, flexShrink: 0 }}>
                          {[0, 1, 2, 3, 4].map((k) => (
                            <span key={k} style={{ width: 6, height: 6, borderRadius: "50%", background: k < filled ? acc : dotEmpty }} />
                          ))}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        }
        if (eff === "pills" && !sidebar) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              {groups.map((g) => (
                <div key={g.title}>
                  {g.title !== "General" && (
                    <div style={{ fontSize: smallFont, fontWeight: 700, color: sub, textTransform: "uppercase", marginBottom: 4, fontFamily: fam }}>{g.title}</div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {g.skills.map((sk, j) => (
                      <span
                        key={j}
                        style={{ background: palette.divider, color: palette.text, padding: "3px 11px", borderRadius: 9999, fontSize: contentFont, fontFamily: fam, display: "inline-block", lineHeight: 1.2 }}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const v = [...g.skills]
                          v[j] = e.currentTarget.textContent || ""
                          editGroup(g.title, v)
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        if (design.skillStyle === "bullets" || sidebar) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {groups.map((g) => (
                <div key={g.title}>
                  {g.title !== "General" && (
                    <div style={{ fontSize: smallFont, fontWeight: 700, color: sidebar ? palette.sidebarHeading || palette.heading : sub, marginBottom: 2, fontFamily: fam }}>{g.title}</div>
                  )}
                  {bulletList(g.skills, (j, v) => {
                    const nv = [...g.skills]
                    nv[j] = v
                    editGroup(g.title, nv)
                  })}
                </div>
              ))}
            </div>
          )
        }
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {groups.map((g) => (
              <div key={g.title} style={{ fontSize: contentFont, fontFamily: fam, lineHeight: 1.45 }}>
                {g.title !== "General" && <span style={{ fontWeight: 700, color: palette.heading }}>{g.title}: </span>}
                <span
                  style={{ color: tColor }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => editGroup(g.title, (e.currentTarget.textContent || "").split(",").map((x) => x.trim()).filter(Boolean))}
                >
                  {g.skills.join(", ")}
                </span>
              </div>
            ))}
          </div>
        )
      }
      case SECTION_TYPES.LANGUAGES:
        if (design.skillStyle === "dots" && skillLevelsOn) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {(section.items || []).filter(Boolean).map((lng: string, i: number) => {
                const filled = skillDotsFilled(i)
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: contentFont, color: tColor, fontFamily: fam }} contentEditable suppressContentEditableWarning onBlur={(e) => handleListChange(section.id, i, e.currentTarget.textContent || "")}>
                      {lng}
                    </span>
                    <span style={{ display: "inline-flex", gap: 3, flexShrink: 0 }}>
                      {[0, 1, 2, 3, 4].map((k) => (
                        <span key={k} style={{ width: 6, height: 6, borderRadius: "50%", background: k < filled ? acc : sidebar ? "rgba(255,255,255,0.3)" : palette.divider }} />
                      ))}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        }
        return bulletList((section.items || []).filter(Boolean), (i, v) => handleListChange(section.id, i, v))
      case SECTION_TYPES.CERTIFICATIONS:
        return bulletList((section.items || []).filter(Boolean), (i, v) => handleListChange(section.id, i, v))
      case SECTION_TYPES.CUSTOM:
        return bulletList((section.content || []).filter(Boolean), (i, v) => handleCustomContentChange(section.id, i, v))
      case SECTION_TYPES.CUSTOM_FIELDS:
        return (
          <div style={{ fontSize: contentFont, fontFamily: fam, color: tColor, display: "flex", flexDirection: "column", gap: 3 }}>
            {Object.entries(resumeData.custom || {})
              .filter(([, fld]) => !fld.hidden && fld.content)
              .map(([key, fld]) => (
                <div key={key}>
                  <span style={{ fontWeight: 700, color: palette.heading }} contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomFieldChange(key, "title", e.currentTarget.textContent || "")}>
                    {fld.title}:
                  </span>{" "}
                  <span contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomFieldChange(key, "content", e.currentTarget.textContent || "")}>
                    {fld.content}
                  </span>
                </div>
              ))}
          </div>
        )
      default:
        return null
    }
  }

  const sectionHasContent = (section: any): boolean => {
    if (!section || section.hidden) return false
    switch (section.type) {
      case SECTION_TYPES.EXPERIENCE:
      case SECTION_TYPES.EDUCATION:
      case SECTION_TYPES.PROJECTS:
        return Array.isArray(section.items) && section.items.length > 0
      case SECTION_TYPES.SKILLS:
        return getEffectiveSkillGroupsFromSection(section).some((g) => g.skills.length > 0)
      case SECTION_TYPES.LANGUAGES:
      case SECTION_TYPES.CERTIFICATIONS:
        return Array.isArray(section.items) && section.items.filter((x: string) => x && x.trim()).length > 0
      case SECTION_TYPES.CUSTOM:
        return Array.isArray(section.content) && section.content.filter((x: string) => x && x.trim()).length > 0
      case SECTION_TYPES.CUSTOM_FIELDS:
        return Object.values(resumeData.custom || {}).some((f) => !f.hidden && f.content)
      default:
        return false
    }
  }

  const allSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
  const sidebarTypes = [SECTION_TYPES.SKILLS, SECTION_TYPES.LANGUAGES, SECTION_TYPES.CERTIFICATIONS] as string[]

  const renderSectionBlock = (section: any, sidebar: boolean) => {
    if (section.type !== SECTION_TYPES.CUSTOM_FIELDS && !sectionHasContent(section)) return null
    if (section.type === SECTION_TYPES.CUSTOM_FIELDS && !sectionHasContent(section)) return null
    return (
      <div key={section.id} style={{ marginBottom: 14 }}>
        {sectionTitleEl(section, sidebar)}
        <div style={{ marginTop: 6 }}>{renderSectionContent(section, sidebar)}</div>
      </div>
    )
  }

  // contact row for single header
  const contactPairs: { key: keyof typeof resumeData.basics; val: string }[] = [
    { key: "email", val: resumeData.basics.email },
    { key: "phone", val: resumeData.basics.phone },
    { key: "location", val: resumeData.basics.location },
    { key: "linkedin", val: resumeData.basics.linkedin },
  ]
  const contactRow = (color: string, center: boolean) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: center ? "center" : "flex-start", color, fontFamily: fam, fontSize: px(design.sizes.small) }}>
      {contactPairs
        .filter((p) => p.val)
        .map((p, i, arr) => (
          <span key={p.key} style={{ display: "inline-flex", gap: 8 }}>
            <span contentEditable suppressContentEditableWarning onBlur={(e) => handleContactInfoChange(e, p.key)}>
              {p.val}
            </span>
            {i < arr.length - 1 && <span style={{ opacity: 0.5 }}>|</span>}
          </span>
        ))}
    </div>
  )

  const summaryEl = resumeData.basics.summary ? (
    <p
      style={{ color: palette.text, fontFamily: fam, fontSize: px(design.sizes.content), lineHeight: 1.5, marginBottom: 14, textAlign: "justify" }}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleSummaryChange}
    >
      {resumeData.basics.summary}
    </p>
  ) : null

  // ---------- page shell ----------
  const page = (children: React.ReactNode) => (
    <div className={`border w-full h-full flex justify-center items-start overflow-auto bg-gray-100 py-8 ${font.className}`}>
      <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div
          ref={pdfRef}
          className="shadow-2xl relative"
          style={{ width: 595, minHeight: 842, transform: `scale(${scale})`, transformOrigin: "top center", background: "white" }}
        >
          {children}
        </div>
      </div>
    </div>
  )

  // ===== SIDEBAR (left or right) =====
  if (design.layout === "sidebar-left" || design.layout === "sidebar-right") {
    const sidebarRight = design.layout === "sidebar-right"
    const left = allSections.filter((s: any) => s.column === 1 || (!s.column && sidebarTypes.includes(s.type)))
    const right = allSections.filter((s: any) => !(s.column === 1 || (!s.column && sidebarTypes.includes(s.type))))
    const sidebarPanel = (
      <div key="sidebar" style={{ width: 188, flexShrink: 0, background: palette.sidebarBg, padding: "28px 22px", color: palette.sidebarText }}>
        {design.sidebarNameBlock ? (
          <div style={{ background: palette.accent, margin: "-28px -22px 18px -22px", padding: "26px 16px 22px", textAlign: "center", color: "#fff" }}>
            {design.monogram && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{monogramEl(58, "#fff", palette.accent)}</div>
            )}
            <div
              style={{ fontSize: px(Math.min(design.sizes.name, 19)), fontWeight: 800, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.02em", lineHeight: 1.15, color: "#fff" }}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleNameChange}
            >
              {resumeData.basics.name}
            </div>
            {firstRole && (
              <div style={{ fontSize: px(design.sizes.small), fontFamily: fam, marginTop: 5, color: "#fff", opacity: 0.92 }}>{firstRole}</div>
            )}
          </div>
        ) : design.monogram ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            {monogramEl(64, palette.sidebarAccent || palette.accent, palette.sidebarBg || "#fff")}
          </div>
        ) : null}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: px(design.sizes.section - 1), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: palette.sidebarHeading, borderBottom: `1.5px solid ${palette.sidebarAccent}`, paddingBottom: 3, marginBottom: 8, fontFamily: fam }}>
            Contact
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {contactPairs
              .filter((p) => p.val)
              .map((p) => (
                <span key={p.key} style={{ fontSize: px(design.sizes.content), color: palette.sidebarText, fontFamily: fam, wordBreak: "break-word" }} contentEditable suppressContentEditableWarning onBlur={(e) => handleContactInfoChange(e, p.key)}>
                  {p.val}
                </span>
              ))}
          </div>
        </div>
        {left.map((s: any) => renderSectionBlock(s, true))}
      </div>
    )
    const mainPanel = (
      <div key="main" style={{ flex: 1, padding: "28px 30px" }}>
        {!design.sidebarNameBlock && (
          <h1
            style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.name, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.01em", borderBottom: `2px solid ${palette.accent}`, paddingBottom: 8, marginBottom: 14, lineHeight: 1.1 }}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameChange}
          >
            {resumeData.basics.name}
          </h1>
        )}
        {summaryEl}
        {right.map((s: any) => renderSectionBlock(s, false))}
      </div>
    )
    return page(
      <div style={{ display: "flex", minHeight: 842 }}>
        {sidebarRight ? [mainPanel, sidebarPanel] : [sidebarPanel, mainPanel]}
      </div>,
    )
  }

  // ===== SINGLE COLUMN =====
  const stripe = design.accentStripe
  const roleEl = (color: string, center: boolean) =>
    design.showRole && firstRole ? (
      <div style={{ fontSize: px(design.sizes.content), color, fontFamily: fam, marginTop: -2, marginBottom: 8, textAlign: center ? "center" : "left", letterSpacing: "0.03em" }}>
        {firstRole}
      </div>
    ) : null
  const header =
    design.header === "band" ? (
      <div style={{ background: palette.headerBg, color: palette.headerText, padding: "26px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.headerText, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.06em", marginBottom: 8 }} contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
          {resumeData.basics.name}
        </h1>
        {roleEl(palette.headerText || "#fff", true)}
        {contactRow(palette.headerText || "#fff", true)}
      </div>
    ) : design.header === "geometric" ? (
      <div style={{ display: "flex", alignItems: "stretch", overflow: "hidden" }}>
        <div style={{ width: 150, background: palette.accent, display: "flex", alignItems: "center", justifyContent: "center", padding: "22px 0", flexShrink: 0 }}>
          <span style={{ color: palette.headerText || "#fff", fontWeight: 800, fontSize: px(design.sizes.name * 1.15), fontFamily: fam, letterSpacing: "0.04em" }}>
            {getInitials(resumeData.basics.name)}
          </span>
        </div>
        <div style={{ flex: 1, background: palette.headerBg, color: palette.headerText, padding: "22px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.headerText, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.04em", marginBottom: 8 }} contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
            {resumeData.basics.name}
          </h1>
          {roleEl(palette.headerText || "#fff", false)}
          {contactRow(palette.headerText || "#fff", false)}
        </div>
      </div>
    ) : design.header === "centered" ? (
      <div style={{ textAlign: "center", marginBottom: 14, borderBottom: `1.2px solid ${palette.divider}`, paddingBottom: 12 }}>
        {design.monogram && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>{monogramEl(54, palette.accent, palette.headerText || "#fff")}</div>
        )}
        <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 700, color: palette.name, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.06em", marginBottom: 8 }} contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
          {resumeData.basics.name}
        </h1>
        {roleEl(palette.accent, true)}
        {contactRow(palette.secondary, true)}
      </div>
    ) : (
      <div style={{ marginBottom: 14, borderBottom: `1.6px solid ${palette.accent}`, paddingBottom: 10 }}>
        {design.monogram ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            {monogramEl(50, palette.accent, palette.headerText || "#fff")}
            <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.name, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.01em", margin: 0, lineHeight: 1.1 }} contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
              {resumeData.basics.name}
            </h1>
          </div>
        ) : (
          <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.name, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.01em", marginBottom: 8 }} contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
            {resumeData.basics.name}
          </h1>
        )}
        {roleEl(palette.accent, false)}
        {contactRow(palette.secondary, false)}
      </div>
    )

  const sectionsBody = (
    <>
      {summaryEl}
      {allSections.map((s: any) => renderSectionBlock(s, false))}
    </>
  )

  return page(
    <div style={{ display: stripe ? "flex" : "block", minHeight: 842 }}>
      {stripe && <div style={{ width: 8, background: palette.accent, flexShrink: 0 }} />}
      <div style={{ flex: 1 }}>
        {design.header === "band" || design.header === "geometric" ? (
          <>
            {header}
            <div style={{ padding: "22px 40px 36px 40px" }}>{sectionsBody}</div>
          </>
        ) : (
          <div style={{ padding: "30px 44px 36px 44px" }}>
            {header}
            {sectionsBody}
          </div>
        )}
      </div>
    </div>,
  )
}

export default ConfigurableResume
