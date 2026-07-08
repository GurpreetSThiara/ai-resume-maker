"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { ResumeData } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"
import ProjectSection from "../../resume-components/project-section"
import type { ResumeDesign } from "@/lib/resume-designs"
import { skillDotsFilled, effectiveSkillLevel, DEFAULT_MARGIN_SCALE, DEFAULT_CONDENSED_EDUCATION } from "@/lib/resume-designs"
import { DEFAULT_EDUCATION, DEFAULT_EXPERIENCE, DEFAULT_PROJECT } from "@/constants/resumeConstants"
import { lineKey, cssFor } from "@/utils/lineStyle"
import { px as ptToPx, FONT_CSS, SIDEBAR_TRACK_HEX, type FontKey } from "@/lib/render-spec"
import { Plus, Trash2 } from "lucide-react"

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
  /** Visual editor: show add/delete affordances for full CRUD on the preview. */
  crud?: boolean
  /** Visual editor: size the page to the available WIDTH (comfortable to edit) and
   * scroll vertically, instead of shrinking to fit the container height. */
  editorFit?: boolean
  /** Studio: explicit zoom (overrides the auto width-fit when editorFit is on). */
  zoomLevel?: number
}

const hx = (h?: string) => (h ? `#${h}` : undefined)

export const ConfigurableResume: React.FC<ConfigurableResumeProps> = ({
  pdfRef,
  font,
  resumeData,
  setResumeData,
  design,
  crud = false,
  editorFit = false,
  zoomLevel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  // After an add, scroll the new (empty) field into view and focus it, so it's
  // obvious the add worked and the user can type immediately.
  const pendingFocusKey = useRef<string | null>(null)
  // Deletes route through a confirmation modal.
  const [confirmDel, setConfirmDel] = useState<{ label: string; fn: () => void } | null>(null)
  const requestDelete = (label: string, fn: () => void) => setConfirmDel({ label, fn })

  // Per-line formatting overrides → CSS for a given lineKey.
  const LS = resumeData.lineStyles || {}
  const lcss = (k: string) => cssFor(LS[k])

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const parent = containerRef.current.parentElement
      if (!parent) return
      if (editorFit) {
        if (zoomLevel != null) return // studio drives zoom explicitly
        // Fit to width at a comfortable, readable size; let the page scroll vertically.
        const z = Math.min(1.35, Math.max(0.85, (parent.clientWidth - 56) / 595))
        setZoom(z)
        return
      }
      const widthScale = parent.clientWidth / 595
      const heightScale = parent.clientHeight / 842
      let newScale = Math.min(widthScale, heightScale, 1)
      if (window.innerWidth >= 768 && newScale > 0.92) newScale = 0.92
      setScale(newScale)
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [editorFit])

  // Focus a freshly-added field once it has rendered.
  useEffect(() => {
    const k = pendingFocusKey.current
    if (!k) return
    pendingFocusKey.current = null
    const el = (containerRef.current || document).querySelector(`[data-linekey="${k}"]`) as HTMLElement | null
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "center" })
    el.focus()
    const sel = window.getSelection?.()
    if (sel) {
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [resumeData])

  // ---------- editing handlers ----------
  const handleNameChange = (e: React.FormEvent<HTMLElement>) =>
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, name: e.currentTarget?.textContent || "" } }))

  const handleSummaryChange = (e: React.FormEvent<HTMLElement>) =>
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, summary: e.currentTarget?.textContent || "" } }))

  const handleContactInfoChange = (e: React.FormEvent<HTMLElement>, key: keyof typeof resumeData.basics) =>
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: e.currentTarget?.textContent || "" } }))

  // The headline/role under the name mirrors the first experience entry's role.
  const handleFirstRoleChange = (e: React.FormEvent<HTMLElement>) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const exp: any = updated.sections.find((s: any) => s.type === SECTION_TYPES.EXPERIENCE)
      const val = e.currentTarget?.textContent || ""
      if (exp && Array.isArray(exp.items) && exp.items[0]) exp.items[0].role = val
      return updated
    })

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

  // ---------- CRUD handlers (visual editor) ----------
  const genId = () => `sec-${Math.random().toString(36).slice(2, 9)}`
  const defaultTitle = (type: string) =>
    (({
      [SECTION_TYPES.EXPERIENCE]: "Experience",
      [SECTION_TYPES.EDUCATION]: "Education",
      [SECTION_TYPES.PROJECTS]: "Projects",
      [SECTION_TYPES.SKILLS]: "Skills",
      [SECTION_TYPES.LANGUAGES]: "Languages",
      [SECTION_TYPES.CERTIFICATIONS]: "Certifications",
      [SECTION_TYPES.CUSTOM]: "Custom Section",
    }) as Record<string, string>)[type] || "Section"

  const addEntry = (sectionId: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      if (!s) return prev
      const blank =
        s.type === SECTION_TYPES.EXPERIENCE ? DEFAULT_EXPERIENCE
          : s.type === SECTION_TYPES.EDUCATION ? DEFAULT_EDUCATION
            : s.type === SECTION_TYPES.PROJECTS ? DEFAULT_PROJECT
              : null
      if (!blank) return prev
      s.items = [...(s.items || []), structuredClone(blank)]
      return updated
    })

  const removeEntry = (sectionId: string, index: number) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      if (!s || !Array.isArray(s.items)) return prev
      s.items.splice(index, 1)
      return updated
    })

  const addBullet = (sectionId: string, index: number, field: string) => {
    const cur: any = resumeData.sections.find((x) => x.id === sectionId)
    const newIdx = cur?.items?.[index]?.[field]?.length ?? 0
    pendingFocusKey.current = lineKey(sectionId, { item: index, field: "bullet", bullet: newIdx })
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      const it = s?.items?.[index]
      if (!it) return prev
      it[field] = [...(it[field] || []), ""]
      return updated
    })
  }

  const removeBullet = (sectionId: string, index: number, field: string, bi: number) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      const it = s?.items?.[index]
      if (!it || !Array.isArray(it[field])) return prev
      it[field].splice(bi, 1)
      return updated
    })

  const addListItem = (sectionId: string, field: "items" | "content") => {
    const cur: any = resumeData.sections.find((x) => x.id === sectionId)
    const newIdx = cur?.[field]?.length ?? 0
    pendingFocusKey.current = lineKey(sectionId, { item: newIdx })
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      if (!s) return prev
      s[field] = [...(s[field] || []), ""]
      return updated
    })
  }

  const removeListItem = (sectionId: string, field: "items" | "content", idx: number) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      if (!s || !Array.isArray(s[field])) return prev
      s[field].splice(idx, 1)
      return updated
    })

  const addSkill = (sectionId: string, groupTitle: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      if (!s) return prev
      const groups = getEffectiveSkillGroupsFromSection(s as any).map((g) =>
        g.title === groupTitle ? { ...g, skills: [...g.skills, ""] } : g,
      )
      s.groups = groups
      s.items = groups.flatMap((g) => g.skills)
      return updated
    })

  const removeSkill = (sectionId: string, groupTitle: string, idx: number) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      if (!s) return prev
      const groups = getEffectiveSkillGroupsFromSection(s as any).map((g) =>
        g.title === groupTitle ? { ...g, skills: g.skills.filter((_, i) => i !== idx) } : g,
      )
      s.groups = groups
      s.items = groups.flatMap((g) => g.skills)
      return updated
    })

  // Set a skill's proficiency (1–5) for the bars/dots styles. Stored per name in
  // section.skillLevels and read by effectiveSkillLevel in all three renderers.
  const setSkillLevel = (sectionId: string, name: string, level: number) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const s: any = updated.sections.find((x) => x.id === sectionId)
      if (!s) return prev
      s.skillLevels = { ...(s.skillLevels || {}), [name]: Math.max(1, Math.min(5, level)) }
      return updated
    })

  const removeSectionById = (sectionId: string) =>
    setResumeData((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== sectionId) }))

  const addSection = (type: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const base = { id: genId(), title: defaultTitle(type), type, order: updated.sections.length, hidden: false }
      let sec: any
      if (type === SECTION_TYPES.CUSTOM) sec = { ...base, content: [""] }
      else if (type === SECTION_TYPES.SKILLS) sec = { ...base, items: [], groups: [{ id: genId(), title: "General", skills: [""] }] }
      else if (type === SECTION_TYPES.LANGUAGES || type === SECTION_TYPES.CERTIFICATIONS) sec = { ...base, items: [""] }
      else sec = { ...base, items: [] }
      updated.sections.push(sec as any)
      return updated
    })

  // small affordance button styles
  const xBtn: React.CSSProperties = { cursor: "pointer", border: "none", background: "transparent", color: "#dc2626", fontSize: 13, lineHeight: 1, padding: "0 2px", marginLeft: 6, fontFamily: "system-ui" }
  const addBtn: React.CSSProperties = { cursor: "pointer", border: "1px dashed #cbd5e1", background: "transparent", color: "#64748b", fontSize: 11, borderRadius: 6, padding: "3px 9px", marginTop: 6, fontFamily: "system-ui" }
  const Del = ({ onClick, title }: { onClick: () => void; title: string }) =>
    crud ? (
      <button type="button" contentEditable={false} onMouseDown={(e) => e.preventDefault()} onClick={() => requestDelete(title, onClick)} title={title} style={xBtn} className="cfc-x" aria-label={title}>×</button>
    ) : null
  const Add = ({ onClick, label }: { onClick: () => void; label: string }) =>
    crud ? (
      <button type="button" contentEditable={false} onMouseDown={(e) => e.preventDefault()} onClick={onClick} style={addBtn} className="cfc-add">+ {label}</button>
    ) : null

  // EnhanCV-style contextual section toolbar (appears on hover over a section).
  const sectionAddAction = (section: any): null | { fn: () => void; title: string } => {
    switch (section.type) {
      case SECTION_TYPES.EXPERIENCE:
      case SECTION_TYPES.EDUCATION:
      case SECTION_TYPES.PROJECTS:
        return { fn: () => addEntry(section.id), title: "Add entry" }
      case SECTION_TYPES.SKILLS:
        return { fn: () => { const g = getEffectiveSkillGroupsFromSection(section)[0]; addSkill(section.id, g?.title || "General") }, title: "Add skill" }
      case SECTION_TYPES.LANGUAGES:
      case SECTION_TYPES.CERTIFICATIONS:
        return { fn: () => addListItem(section.id, "items"), title: "Add item" }
      case SECTION_TYPES.CUSTOM:
        return { fn: () => addListItem(section.id, "content"), title: "Add item" }
      default:
        return null
    }
  }
  const SectionTools = ({ section }: { section: any }) => {
    if (!crud || section.type === SECTION_TYPES.CUSTOM_FIELDS) return null
    const add = sectionAddAction(section)
    return (
      <div className="cfc-tools" contentEditable={false}>
        {add && (
          <button type="button" className="cfc-tbtn" title={add.title} onMouseDown={(e) => e.preventDefault()} onClick={add.fn}>
            <Plus size={13} strokeWidth={2.5} />
          </button>
        )}
        <button type="button" className="cfc-tbtn cfc-tbtn-danger" title="Delete section" onMouseDown={(e) => e.preventDefault()} onClick={() => requestDelete(`Delete the "${section.title || "section"}" section`, () => removeSectionById(section.id))}>
          <Trash2 size={12} strokeWidth={2} />
        </button>
      </div>
    )
  }

  // Scoped styles for the visual-editor affordances (only injected in CRUD mode).
  const crudStyleTag = crud ? (
    <style>{`
      .cfc-sec{position:relative;border-radius:8px;padding:4px 10px;margin:0 -10px 4px;transition:background .15s,box-shadow .15s;}
      .cfc-sec:hover{background:rgba(37,99,235,.045);box-shadow:inset 0 0 0 1px rgba(37,99,235,.18);}
      .cfc-tools{position:absolute;top:-13px;right:10px;display:flex;gap:3px;background:#111827;padding:4px;border-radius:9px;box-shadow:0 8px 20px rgba(0,0,0,.24);opacity:0;transform:translateY(5px);transition:opacity .14s,transform .14s;z-index:6;}
      .cfc-sec:hover .cfc-tools{opacity:1;transform:translateY(0);}
      .cfc-tbtn{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:none;border-radius:6px;background:transparent;color:#fff;cursor:pointer;}
      .cfc-tbtn:hover{background:rgba(255,255,255,.16);}
      .cfc-tbtn-danger:hover{background:#dc2626;}
      .cfc-x{opacity:.45;transition:opacity .12s;}
      .cfc-x:hover{opacity:1;}
      .cfc-add{opacity:.7;transition:opacity .12s;}
      .cfc-add:hover{opacity:1;border-color:#94a3b8;}
      [data-ph]:empty:before{content:attr(data-ph);color:#aeb6c2;font-style:italic;pointer-events:none;}
    `}</style>
  ) : null

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
  const fam = FONT_CSS[(design.font as FontKey)] || FONT_CSS.sans
  const px = (pt: number) => `${ptToPx(pt)}px`
  // Vertical-gap multiplier driven by the density setting (tight by default).
  const gapScale = design.gapScale ?? 0.75
  const gp = (n: number) => Math.round(n * gapScale)
  // Page-margin multiplier driven by the pageMargin setting.
  const marginScale = design.marginScale ?? DEFAULT_MARGIN_SCALE
  const sm = (n: number) => Math.round(n * marginScale)

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
        data-ph="Section title"
        data-el="heading"
        data-sid={section.id}
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
        <div key={key} style={{ marginBottom: gp(10), position: useTimeline ? "relative" : undefined, paddingLeft: useTimeline ? 18 : 0 }}>
          {useTimeline && (
            <>
              <span style={{ position: "absolute", left: 0, top: 4, width: 8, height: 8, borderRadius: "50%", background: palette.accent }} />
              <span style={{ position: "absolute", left: 3.5, top: 12, bottom: 0, width: 1.5, background: palette.divider }} />
            </>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontWeight: 700, color: sidebar ? palette.sidebarHeading || palette.heading : palette.heading, fontSize: itemFont, fontFamily: fam }} data-ph="Title" data-el="body" contentEditable suppressContentEditableWarning onBlur={(e) => edit(opts.titleField, e.currentTarget.textContent || "")}>
              {opts.title}
            </span>
            <span style={{ color: sub, fontSize: smallFont, fontFamily: fam, whiteSpace: "nowrap" }}>
              <span data-ph="Start" contentEditable suppressContentEditableWarning onBlur={(e) => edit("startDate", e.currentTarget.textContent || "")}>{opts.startDate}</span>
              {(opts.startDate || opts.endDate) && " - "}
              <span data-ph="End" contentEditable suppressContentEditableWarning onBlur={(e) => edit("endDate", e.currentTarget.textContent || "")}>{opts.endDate}</span>
            </span>
            <Del onClick={() => removeEntry(opts.sectionId, opts.index)} title="Delete entry" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ color: acc, fontWeight: 600, fontSize: contentFont, fontFamily: fam }} data-ph="Company / Institution" data-el="body" contentEditable suppressContentEditableWarning onBlur={(e) => edit(opts.subtitleField, e.currentTarget.textContent || "")}>
              {opts.subtitle}
            </span>
            {opts.location !== undefined && (
              <span style={{ color: sub, fontSize: smallFont, fontFamily: fam }} data-ph="Location" contentEditable suppressContentEditableWarning onBlur={(e) => edit("location", e.currentTarget.textContent || "")}>
                {opts.location}
              </span>
            )}
          </div>
          {children}
        </div>
      )
    }

    const bulletList = (
      items: string[],
      onEdit: (i: number, v: string) => void,
      crudOps?: { onAdd: () => void; onRemove: (i: number) => void },
      keyFor?: (i: number) => string,
    ) => (
      <ul style={{ listStyle: "disc", marginLeft: 16, marginTop: 4 }}>
        {items.map((it, i) => {
          const lk = keyFor?.(i)
          return (
          <li key={i} style={{ color: tColor, fontSize: contentFont, fontFamily: fam, lineHeight: 1.45 }}>
            <span data-ph="Add a detail — quantify your impact where possible." data-el="body" data-linekey={lk} style={lk ? lcss(lk) : undefined} contentEditable suppressContentEditableWarning onBlur={(e) => onEdit(i, e.currentTarget.textContent || "")}>
              {it}
            </span>
            {crudOps && <Del onClick={() => crudOps.onRemove(i)} title="Delete line" />}
          </li>
        )})}
        {crudOps && (
          <li style={{ listStyle: "none", marginLeft: -16 }}>
            <Add label="Add line" onClick={crudOps.onAdd} />
          </li>
        )}
      </ul>
    )

    switch (section.type) {
      case SECTION_TYPES.EXPERIENCE:
        return (
          <>
            {(section.items || []).map((exp: any, i: number) =>
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
                (crud || (exp.achievements && exp.achievements.length))
                  ? bulletList(
                      exp.achievements || [],
                      (j, v) => handleAchievementChange(section.id, i, j, v),
                      crud ? { onAdd: () => addBullet(section.id, i, "achievements"), onRemove: (j) => removeBullet(section.id, i, "achievements", j) } : undefined,
                      (j) => lineKey(section.id, { item: i, field: "bullet", bullet: j }),
                    )
                  : null,
              ),
            )}
            <Add label="Add experience" onClick={() => addEntry(section.id)} />
          </>
        )
      case SECTION_TYPES.EDUCATION:
        // Condensed = everything on one line: Institution — Degree, Year, CGPA.
        if (design.condensedEducation ?? DEFAULT_CONDENSED_EDUCATION) {
          return (
            <>
              {(section.items || []).map((edu: any, i: number) => {
                const yr = [edu.startDate, edu.endDate].filter(Boolean).join(" – ")
                const rest = [edu.degree, yr, edu.gpa].filter(Boolean).join(", ")
                return (
                  <div key={i} style={{ marginBottom: gp(6), display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: contentFont, fontFamily: fam, color: palette.text, flex: 1 }}>
                      <span
                        style={{ fontWeight: 700, color: sidebar ? palette.sidebarHeading || palette.heading : palette.heading }}
                        data-el="body"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleSectionItemChange(section.id, i, "institution", e.currentTarget.textContent || "")}
                      >
                        {edu.institution}
                      </span>
                      {rest && <span style={{ color: sub }}>{" — "}{rest}</span>}
                    </span>
                    {crud && <Del onClick={() => removeEntry(section.id, i)} title="Delete entry" />}
                  </div>
                )
              })}
              <Add label="Add education" onClick={() => addEntry(section.id)} />
            </>
          )
        }
        return (
          <>
            {(section.items || []).map((edu: any, i: number) =>
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
                (crud || (edu.highlights && edu.highlights.length))
                  ? bulletList(
                      edu.highlights || [],
                      (j, v) => handleHighlightChange(section.id, i, j, v),
                      crud ? { onAdd: () => addBullet(section.id, i, "highlights"), onRemove: (j) => removeBullet(section.id, i, "highlights", j) } : undefined,
                      (j) => lineKey(section.id, { item: i, field: "bullet", bullet: j }),
                    )
                  : null,
              ),
            )}
            <Add label="Add education" onClick={() => addEntry(section.id)} />
          </>
        )
      case SECTION_TYPES.PROJECTS:
        return (
          <>
            {crud && (section.items || []).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                {(section.items || []).map((p: any, i: number) => (
                  <span key={i} contentEditable={false} style={{ fontSize: 11, color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 6, padding: "1px 4px 1px 8px", fontFamily: "system-ui" }}>
                    {p.name || `Project ${i + 1}`}
                    <Del onClick={() => removeEntry(section.id, i)} title="Delete project" />
                  </span>
                ))}
              </div>
            )}
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
            <Add label="Add project" onClick={() => addEntry(section.id)} />
          </>
        )
      case SECTION_TYPES.SKILLS: {
        const groups = getEffectiveSkillGroupsFromSection(section).filter((g) => g.skills.length > 0)
        const editGroup = (title: string, skills: string[]) => {
          const updated = groups.map((g) => (g.title === title ? { ...g, skills } : g))
          handleSkillsChange(section.id, updated)
        }
        const editGroupTitle = (oldTitle: string, newTitle: string) => {
          const updated = groups.map((g) => (g.title === oldTitle ? { ...g, title: newTitle } : g))
          handleSkillsChange(section.id, updated)
        }
        const groupTitleProps = (title: string) =>
          crud
            ? { contentEditable: true, suppressContentEditableWarning: true, "data-el": "heading", onBlur: (e: React.FormEvent<HTMLElement>) => editGroupTitle(title, e.currentTarget.textContent || "") }
            : {}
        const groupTitleEl = (title: string) =>
          title !== "General" || crud ? (
            <div {...groupTitleProps(title)} data-ph="Category" style={{ fontSize: smallFont, fontWeight: 700, color: sub, marginBottom: 4, fontFamily: fam }}>
              {title === "General" ? "" : title}
            </div>
          ) : null
        const dotEmpty = sidebar ? SIDEBAR_TRACK_HEX : palette.divider
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
                      <div
                        title={crud ? "Click to set level (1–5)" : undefined}
                        onMouseDown={crud ? (e) => e.preventDefault() : undefined}
                        onClick={crud ? (e) => { const r = e.currentTarget.getBoundingClientRect(); setSkillLevel(section.id, sk, Math.ceil(((e.clientX - r.left) / r.width) * 5)) } : undefined}
                        style={{ background: sidebar ? SIDEBAR_TRACK_HEX : palette.divider, height: 5, borderRadius: 3, cursor: crud ? "pointer" : undefined }}
                      >
                        <div style={{ background: acc, width: `${(effectiveSkillLevel((section as any).skillLevels, sk, j) / 5) * 100}%`, height: "100%", borderRadius: 3, pointerEvents: "none" }} />
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
                            <span
                              key={k}
                              title={crud ? `Set level ${k + 1}` : undefined}
                              onMouseDown={crud ? (e) => e.preventDefault() : undefined}
                              onClick={crud ? () => setSkillLevel(section.id, sk, k + 1) : undefined}
                              style={{ width: crud ? 9 : 6, height: crud ? 9 : 6, borderRadius: "50%", background: k < filled ? acc : dotEmpty, cursor: crud ? "pointer" : undefined }}
                            />
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
                  {(g.title !== "General" || crud) && (
                    <div {...groupTitleProps(g.title)} data-ph="Category" style={{ fontSize: smallFont, fontWeight: 700, color: sub, marginBottom: 4, fontFamily: fam }}>{g.title === "General" ? "" : g.title}</div>
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
                  {(g.title !== "General" || crud) && (
                    <div {...groupTitleProps(g.title)} data-ph="Category" style={{ fontSize: smallFont, fontWeight: 700, color: sidebar ? palette.sidebarHeading || palette.heading : sub, marginBottom: 2, fontFamily: fam }}>{g.title === "General" ? "" : g.title}</div>
                  )}
                  {bulletList(
                    g.skills,
                    (j, v) => {
                      const nv = [...g.skills]
                      nv[j] = v
                      editGroup(g.title, nv)
                    },
                    crud ? { onAdd: () => addSkill(section.id, g.title), onRemove: (j) => removeSkill(section.id, g.title, j) } : undefined,
                  )}
                </div>
              ))}
            </div>
          )
        }
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {groups.map((g) => (
              <div key={g.title} style={{ fontSize: contentFont, fontFamily: fam, lineHeight: 1.45 }}>
                {(g.title !== "General" || crud) && (
                  <span {...groupTitleProps(g.title)} data-ph="Category" style={{ fontWeight: 700, color: palette.heading }}>{g.title === "General" ? "" : g.title}</span>
                )}
                {g.title !== "General" && <span style={{ fontWeight: 700, color: palette.heading }}>: </span>}
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
                        <span key={k} style={{ width: 6, height: 6, borderRadius: "50%", background: k < filled ? acc : sidebar ? SIDEBAR_TRACK_HEX : palette.divider }} />
                      ))}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        }
        return bulletList(
          crud ? (section.items || []) : (section.items || []).filter(Boolean),
          (i, v) => handleListChange(section.id, i, v),
          crud ? { onAdd: () => addListItem(section.id, "items"), onRemove: (i) => removeListItem(section.id, "items", i) } : undefined,
          (i) => lineKey(section.id, { item: i }),
        )
      case SECTION_TYPES.CERTIFICATIONS:
        return bulletList(
          crud ? (section.items || []) : (section.items || []).filter(Boolean),
          (i, v) => handleListChange(section.id, i, v),
          crud ? { onAdd: () => addListItem(section.id, "items"), onRemove: (i) => removeListItem(section.id, "items", i) } : undefined,
          (i) => lineKey(section.id, { item: i }),
        )
      case SECTION_TYPES.CUSTOM:
        return bulletList(
          crud ? (section.content || []) : (section.content || []).filter(Boolean),
          (i, v) => handleCustomContentChange(section.id, i, v),
          crud ? { onAdd: () => addListItem(section.id, "content"), onRemove: (i) => removeListItem(section.id, "content", i) } : undefined,
          (i) => lineKey(section.id, { item: i }),
        )
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
    const isCustomFields = section.type === SECTION_TYPES.CUSTOM_FIELDS
    const empty = !sectionHasContent(section)
    // In CRUD mode, still show empty (non-hidden) sections so the user can add to them.
    if (empty && !(crud && !section.hidden && !isCustomFields)) return null
    return (
      <div key={section.id} className={crud ? "cfc-sec" : undefined} data-sid={section.id} style={{ marginBottom: gp(14) }}>
        <SectionTools section={section} />
        {sectionTitleEl(section, sidebar)}
        <div style={{ marginTop: gp(6) }}>{renderSectionContent(section, sidebar)}</div>
      </div>
    )
  }

  // "Add a section" bar (visual editor only) — rendered at the end of the body.
  const SECTION_TYPE_OPTS: { type: string; label: string }[] = [
    { type: SECTION_TYPES.EXPERIENCE, label: "Experience" },
    { type: SECTION_TYPES.EDUCATION, label: "Education" },
    { type: SECTION_TYPES.PROJECTS, label: "Projects" },
    { type: SECTION_TYPES.SKILLS, label: "Skills" },
    { type: SECTION_TYPES.LANGUAGES, label: "Languages" },
    { type: SECTION_TYPES.CERTIFICATIONS, label: "Certifications" },
    { type: SECTION_TYPES.CUSTOM, label: "Custom" },
  ]
  const addSectionBar = crud ? (
    <div contentEditable={false} style={{ marginTop: 18, paddingTop: 12, borderTop: "1px dashed #e2e8f0" }}>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontFamily: "system-ui" }}>Add a section</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {SECTION_TYPE_OPTS.map((t) => (
          <button key={t.type} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => addSection(t.type)} style={addBtn}>+ {t.label}</button>
        ))}
      </div>
    </div>
  ) : null

  // contact row for single header
  const CONTACT_LABELS: Record<string, string> = { email: "Email", phone: "Phone", location: "Location", linkedin: "LinkedIn" }
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
            <span data-ph={p.key} data-el="body" data-linekey={lineKey("basics", { field: p.key })} style={lcss(lineKey("basics", { field: p.key }))} contentEditable suppressContentEditableWarning onBlur={(e) => handleContactInfoChange(e, p.key)}>
              {p.val}
            </span>
            {i < arr.length - 1 && <span style={{ opacity: 0.5 }}>|</span>}
          </span>
        ))}
    </div>
  )

  const summaryEl = (resumeData.basics.summary || crud) ? (
    <p
      data-ph="Briefly explain why you're a great fit for the role."
      data-el="summary"
      data-linekey="basics:summary"
      style={{ color: palette.text, fontFamily: fam, fontSize: px(design.sizes.content), lineHeight: 1.5, marginBottom: 14, textAlign: "justify", ...lcss("basics:summary") }}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleSummaryChange}
    >
      {resumeData.basics.summary}
    </p>
  ) : null

  // ---------- page shell ----------
  const page = (children: React.ReactNode) => (
    <div className={`border w-full h-full flex justify-center items-start overflow-auto bg-gray-100 ${editorFit ? "py-6" : "py-8"} ${font.className}`}>
      {crudStyleTag}
      <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div
          ref={pdfRef}
          data-resume-page
          className="shadow-2xl relative"
          style={{
            width: 595,
            minHeight: 842,
            background: "white",
            ...(editorFit
              ? ({ zoom: zoomLevel ?? zoom } as React.CSSProperties)
              : { transform: `scale(${scale})`, transformOrigin: "top center" }),
          }}
        >
          {children}
        </div>
      </div>
      {confirmDel && (
        <div
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setConfirmDel(null)}
          style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.5)", fontFamily: "system-ui" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 22, width: 340, maxWidth: "90%", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Delete this?</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 18, lineHeight: 1.5 }}>{confirmDel.label}. You can bring it back with Undo (Ctrl+Z).</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setConfirmDel(null)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Cancel</button>
              <button type="button" onClick={() => { confirmDel.fn(); setConfirmDel(null) }} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
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
            {(firstRole || crud) && (
              <div data-el="body" data-ph="Your professional title" contentEditable suppressContentEditableWarning onBlur={handleFirstRoleChange} style={{ fontSize: px(design.sizes.small), fontFamily: fam, marginTop: 5, color: "#fff", opacity: 0.92 }}>{firstRole}</div>
            )}
          </div>
        ) : design.monogram ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            {monogramEl(64, palette.sidebarAccent || palette.accent, palette.sidebarBg || "#fff")}
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {contactPairs
            .filter((p) => p.val || crud)
            .map((p) => (
              <div key={p.key}>
                <div style={{ fontSize: px(design.sizes.small), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: palette.sidebarHeading, marginBottom: 2, fontFamily: fam }}>
                  {CONTACT_LABELS[p.key as string] || (p.key as string)}
                </div>
                <span data-ph={p.key} data-el="body" data-linekey={lineKey("basics", { field: p.key })} contentEditable suppressContentEditableWarning onBlur={(e) => handleContactInfoChange(e, p.key)} style={{ display: "block", fontSize: px(design.sizes.content), color: palette.sidebarText, fontFamily: fam, wordBreak: "break-word", ...lcss(lineKey("basics", { field: p.key })) }}>
                  {p.val}
                </span>
              </div>
            ))}
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
        {addSectionBar}
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
    design.showRole && (firstRole || crud) ? (
      <div data-el="body" data-ph="Your professional title" contentEditable suppressContentEditableWarning onBlur={handleFirstRoleChange} style={{ fontSize: px(design.sizes.content), color, fontFamily: fam, marginTop: -2, marginBottom: 8, textAlign: center ? "center" : "left", letterSpacing: "0.03em" }}>
        {firstRole}
      </div>
    ) : null
  const header =
    design.header === "band" ? (
      <div style={{ background: palette.headerBg, color: palette.headerText, padding: "26px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.headerText, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.06em", marginBottom: 8 }} data-ph="YOUR NAME" data-el="name" contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
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
          <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.headerText, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.04em", marginBottom: 8 }} data-ph="YOUR NAME" data-el="name" contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
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
        <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 700, color: palette.name, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.06em", marginBottom: 8 }} data-ph="YOUR NAME" data-el="name" contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
          {resumeData.basics.name}
        </h1>
        {roleEl(palette.accent, true)}
        {contactRow(palette.secondary, true)}
      </div>
    ) : (
      <div style={{ marginBottom: 14, borderBottom: design.sectionTitle === "plain" ? undefined : `1.6px solid ${palette.accent}`, paddingBottom: 10 }}>
        {design.monogram ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            {monogramEl(50, palette.accent, palette.headerText || "#fff")}
            <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.name, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.01em", margin: 0, lineHeight: 1.1 }} data-ph="YOUR NAME" data-el="name" contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
              {resumeData.basics.name}
            </h1>
          </div>
        ) : (
          <h1 style={{ fontSize: px(design.sizes.name), fontWeight: 800, color: palette.name, fontFamily: fam, textTransform: design.uppercaseName ? "uppercase" : "none", letterSpacing: "0.01em", marginBottom: 8 }} data-ph="YOUR NAME" data-el="name" contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
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
      {addSectionBar}
    </>
  )

  return page(
    <div style={{ display: stripe ? "flex" : "block", minHeight: 842 }}>
      {stripe && <div style={{ width: 8, background: palette.accent, flexShrink: 0 }} />}
      <div style={{ flex: 1 }}>
        {design.header === "band" || design.header === "geometric" ? (
          <>
            {header}
            <div style={{ padding: `22px ${sm(40)}px 36px ${sm(40)}px` }}>{sectionsBody}</div>
          </>
        ) : (
          <div style={{ padding: `30px ${sm(44)}px 36px ${sm(44)}px` }}>
            {header}
            {sectionsBody}
          </div>
        )}
      </div>
    </div>,
  )
}

export default ConfigurableResume
