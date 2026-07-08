"use client"

import type { PerLineStyle, ResumeData, ResumeStyleOverrides } from "@/types/resume"
import { getResumeDesign } from "@/lib/resume-designs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RotateCcw, AlignLeft, AlignCenter, Bold, Italic, Underline, Target, Globe } from "lucide-react"
import { DENSITY_OPTS, FONT_OPTS, LAYOUT_OPTS, MARGIN_OPTS, SKILL_OPTS, type Selection } from "./studio-shared"

const clean = (h: string) => (h || "").replace("#", "")

function Group({ title, scope, children }: { title: string; scope?: "element" | "global"; children: React.ReactNode }) {
  return (
    <div className={`border-b border-gray-100 px-4 py-4 ${scope === "element" ? "border-l-[3px] border-l-primary bg-primary/[0.04]" : ""}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{title}</p>
        {scope === "element" && (
          <span className="flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-primary">
            <Target className="h-2.5 w-2.5" /> This element
          </span>
        )}
        {scope === "global" && (
          <span className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-gray-400">
            <Globe className="h-2.5 w-2.5" /> Whole résumé
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-500">{label}</span>
      {children}
    </div>
  )
}

export function StudioRightPanel({
  resumeData,
  setResumeData,
  templateId,
  selection,
}: {
  resumeData: ResumeData
  setResumeData: (v: ResumeData | ((p: ResumeData) => ResumeData)) => void
  templateId: string
  selection: Selection
}) {
  const base = getResumeDesign(templateId) ?? getResumeDesign("classic-blue")!
  const style = resumeData.style || {}
  const setStyle = (patch: Partial<ResumeStyleOverrides>) =>
    setResumeData((prev) => ({ ...prev, style: { ...(prev.style || {}), ...patch } }))
  const reset = () => setResumeData((prev) => ({ ...prev, style: undefined }))

  // Per-line formatting for the currently selected line.
  const lk = selection.linekey
  const line: PerLineStyle = (lk && resumeData.lineStyles?.[lk]) || {}
  const setLine = (patch: Partial<PerLineStyle>) => {
    if (!lk) return
    setResumeData((prev) => ({ ...prev, lineStyles: { ...(prev.lineStyles || {}), [lk]: { ...(prev.lineStyles?.[lk] || {}), ...patch } } }))
  }
  const clearLine = () => {
    if (!lk) return
    setResumeData((prev) => {
      const ls = { ...(prev.lineStyles || {}) }
      delete ls[lk]
      return { ...prev, lineStyles: ls }
    })
  }
  const lineColor = line.color ? (line.color.startsWith("#") ? line.color : `#${line.color}`) : "#000000"

  const kind = selection.kind || "page"
  const textTitle =
    kind === "name" ? "Name" : kind === "heading" ? "Heading" : kind === "summary" || kind === "body" ? "Body text" : "Document"

  // contextual size/color targets
  const sizeKey = kind === "name" ? "nameSize" : kind === "heading" ? "headingSize" : "bodySize"
  const sizeBase = kind === "name" ? base.sizes.name : kind === "heading" ? base.sizes.section : base.sizes.content
  const sizeVal = (style as any)[sizeKey] ?? sizeBase
  const colorKey = kind === "name" ? "nameColor" : kind === "heading" ? "headingColor" : kind === "page" ? "accent" : "textColor"
  const colorBase = kind === "name" ? base.colors.name : kind === "heading" ? base.colors.heading : kind === "page" ? base.colors.accent : base.colors.text
  const colorVal = (style as any)[colorKey] ?? colorBase
  const showSize = kind === "name" || kind === "heading" || kind === "summary" || kind === "body"
  const upperKey = kind === "name" ? "uppercaseName" : kind === "heading" ? "uppercaseTitles" : null
  const upperVal = upperKey ? (style as any)[upperKey] ?? (base as any)[upperKey] : false

  const eff = {
    font: style.font ?? base.font,
    density: style.density ?? "normal",
    layout: style.layout ?? base.layout,
    skillStyle: style.skillStyle ?? base.skillStyle,
    sectionTitle: style.sectionTitle ?? base.sectionTitle,
  }
  const dividerOn = eff.sectionTitle !== "plain"

  const sel = (value: string, opts: { v: string; label: string }[], onChange: (v: string) => void, w = 132) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs" style={{ width: w }}><SelectValue /></SelectTrigger>
      <SelectContent>{opts.map((o) => <SelectItem key={o.v} value={o.v} className="text-xs">{o.label}</SelectItem>)}</SelectContent>
    </Select>
  )

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-l bg-white">
      {/* TEXT — when an element is selected, edits THAT element only (per-line);
          otherwise edits the document-wide defaults for its kind. */}
      <Group title={lk ? "Selected text" : `Text · ${textTitle}`} scope={lk ? "element" : "global"}>
        {lk && (
          <p className="-mt-1 text-[11px] leading-snug text-gray-400">Restyles only the element you selected.</p>
        )}

        {/* Bold / Italic / Underline — per-line only */}
        {lk && (
          <div className="flex items-center gap-1.5">
            {(["bold", "italic", "underline"] as const).map((k) => {
              const Icon = k === "bold" ? Bold : k === "italic" ? Italic : Underline
              const active = !!(line as any)[k]
              return (
                <button key={k} onClick={() => setLine({ [k]: !active } as any)} title={k} className={`flex h-8 w-8 items-center justify-center rounded border ${active ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  <Icon className="h-4 w-4" />
                </button>
              )
            })}
          </div>
        )}

        {/* Font */}
        <div>
          <span className="mb-1 block text-[11px] text-gray-400">Font</span>
          {lk ? (
            <Select value={line.font ?? "inherit"} onValueChange={(v) => setLine({ font: v === "inherit" ? undefined : (v as any) })}>
              <SelectTrigger className="h-8 text-xs" style={{ width: 256 }}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit" className="text-xs">Default (document font)</SelectItem>
                <SelectItem value="sans" className="text-xs">Sans</SelectItem>
                <SelectItem value="serif" className="text-xs">Serif</SelectItem>
                <SelectItem value="mono" className="text-xs">Mono</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            sel(eff.font, FONT_OPTS, (v) => setStyle({ font: v as any }), 256)
          )}
        </div>

        {/* Size (+ document uppercase) */}
        {(lk || showSize) && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="mb-1 block text-[11px] text-gray-400">Size</span>
              {lk ? (
                <Input type="number" className="h-8 text-xs" placeholder="auto" value={line.size ?? ""} onChange={(e) => setLine({ size: e.target.value ? Number(e.target.value) : undefined })} />
              ) : (
                <div className="flex items-center gap-1">
                  <Input type="number" className="h-8 text-xs" value={Math.round(sizeVal)} onChange={(e) => setStyle({ [sizeKey]: Number(e.target.value) || sizeBase } as any)} />
                  <span className="text-[11px] text-gray-400">pt</span>
                </div>
              )}
            </div>
            {!lk && upperKey && (
              <div>
                <span className="mb-1 block text-[11px] text-gray-400">Uppercase</span>
                <div className="flex h-8 items-center"><Switch checked={!!upperVal} onCheckedChange={(c) => setStyle({ [upperKey]: c } as any)} /></div>
              </div>
            )}
          </div>
        )}

        {/* Colour */}
        <div>
          <span className="mb-1 block text-[11px] text-gray-400">{!lk && kind === "page" ? "Accent" : "Colour"}</span>
          <div className="flex items-center gap-2">
            {lk ? (
              <input type="color" value={lineColor} onChange={(e) => setLine({ color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0.5" />
            ) : (
              <input type="color" value={`#${clean(colorVal)}`} onChange={(e) => setStyle({ [colorKey]: e.target.value } as any)} className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0.5" />
            )}
            <span className="font-mono text-xs uppercase text-gray-500">{lk ? lineColor : `#${clean(colorVal)}`}</span>
          </div>
        </div>

        {!lk && kind === "heading" && (
          <Row label="Align">
            <div className="flex gap-1">
              <button className={`flex h-8 w-8 items-center justify-center rounded border ${eff.sectionTitle !== "centered" ? "border-primary text-primary" : "border-gray-200 text-gray-400"}`} onClick={() => setStyle({ sectionTitle: "underline" })} title="Left"><AlignLeft className="h-4 w-4" /></button>
              <button className={`flex h-8 w-8 items-center justify-center rounded border ${eff.sectionTitle === "centered" ? "border-primary text-primary" : "border-gray-200 text-gray-400"}`} onClick={() => setStyle({ sectionTitle: "centered" })} title="Center"><AlignCenter className="h-4 w-4" /></button>
            </div>
          </Row>
        )}

        {/* Per-element: case, shadow, highlight, spacing */}
        {lk && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="mb-1 block text-[11px] text-gray-400">Case</span>
                <Select value={line.transform ?? "none"} onValueChange={(v) => setLine({ transform: v === "none" ? undefined : (v as any) })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">Default</SelectItem>
                    <SelectItem value="upper" className="text-xs">UPPERCASE</SelectItem>
                    <SelectItem value="lower" className="text-xs">lowercase</SelectItem>
                    <SelectItem value="title" className="text-xs">Title Case</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="mb-1 block text-[11px] text-gray-400">Shadow</span>
                <div className="flex h-8 items-center"><Switch checked={!!line.shadow} onCheckedChange={(c) => setLine({ shadow: c || undefined })} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="mb-1 block text-[11px] text-gray-400">Highlight</span>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={line.background ? (line.background.startsWith("#") ? line.background : `#${line.background}`) : "#fff2a8"} onChange={(e) => setLine({ background: e.target.value })} className="h-8 w-9 cursor-pointer rounded border bg-transparent p-0.5" />
                  {line.background && <button onClick={() => setLine({ background: undefined })} title="Remove highlight" className="text-gray-400 hover:text-gray-700"><RotateCcw className="h-3.5 w-3.5" /></button>}
                </div>
              </div>
              <div>
                <span className="mb-1 block text-[11px] text-gray-400">Letter spacing</span>
                <Input type="number" step="0.5" className="h-8 text-xs" placeholder="0" value={line.letterSpacing ?? ""} onChange={(e) => setLine({ letterSpacing: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-gray-400">Line spacing</span>
              <Select value={String(line.lineHeight ?? "1")} onValueChange={(v) => setLine({ lineHeight: v === "1" ? undefined : Number(v) })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-xs">Default</SelectItem>
                  <SelectItem value="1.15" className="text-xs">1.15</SelectItem>
                  <SelectItem value="1.4" className="text-xs">1.4</SelectItem>
                  <SelectItem value="1.6" className="text-xs">1.6</SelectItem>
                  <SelectItem value="2" className="text-xs">2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {lk && (
          <Button variant="ghost" size="sm" className="w-full gap-1.5 text-gray-500" onClick={clearLine}>
            <RotateCcw className="h-3.5 w-3.5" /> Clear this element's formatting
          </Button>
        )}
      </Group>

      {/* WHOLE-RÉSUMÉ ZONE */}
      <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-1.5">
        <Globe className="h-3 w-3 text-gray-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Whole-résumé settings</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      {/* SECTION */}
      <Group title="Layout & spacing" scope="global">
        <Row label="Spacing">{sel(eff.density, DENSITY_OPTS, (v) => setStyle({ density: v as any }), 120)}</Row>
        <Row label="Divider"><Switch checked={dividerOn} onCheckedChange={(c) => setStyle({ sectionTitle: c ? "underline" : "plain" })} /></Row>
        <Row label="Condensed education"><Switch checked={style.condensedEducation ?? base.condensedEducation ?? false} onCheckedChange={(c) => setStyle({ condensedEducation: c })} /></Row>
        <Row label="Layout">{sel(eff.layout, LAYOUT_OPTS, (v) => setStyle({ layout: v as any }), 140)}</Row>
        <Row label="Skills">{sel(eff.skillStyle, SKILL_OPTS, (v) => setStyle({ skillStyle: v as any }), 120)}</Row>
      </Group>

      {/* PAGE */}
      <Group title="Page & theme" scope="global">
        <Row label="Accent">
          <input type="color" value={`#${clean(style.accent ?? base.colors.accent)}`} onChange={(e) => setStyle({ accent: e.target.value })} className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0.5" />
        </Row>
        <Row label="Page size"><span className="text-xs text-gray-400">A4 (210×297mm)</span></Row>
        <Row label="Margins">{sel(style.pageMargin ?? "normal", MARGIN_OPTS, (v) => setStyle({ pageMargin: v as any }), 120)}</Row>
      </Group>

      <div className="px-4 py-4">
        <Button variant="ghost" size="sm" className="w-full gap-1.5 text-gray-600" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset styling
        </Button>
        <div className="mt-3 rounded-lg bg-primary/5 p-3 text-[11px] leading-relaxed text-gray-500">
          💡 Select any text on the resume — the controls above then restyle just that element. Click an empty area to edit document-wide defaults &amp; the theme accent. All styling is reflected in your PDF &amp; DOCX downloads.
        </div>
      </div>
    </aside>
  )
}

export default StudioRightPanel
