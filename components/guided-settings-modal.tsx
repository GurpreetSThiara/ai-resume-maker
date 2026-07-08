"use client"

import type { ResumeStyleOverrides } from "@/types/resume"
import type { ResumeDesign } from "@/lib/resume-designs"
import { DEFAULT_CONDENSED_EDUCATION } from "@/lib/resume-designs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import {
  FONT_OPTS,
  DENSITY_OPTS,
  MARGIN_OPTS,
  LAYOUT_OPTS,
  SKILL_OPTS,
} from "@/components/visual-editor/studio-shared"

const clean = (h: string) => (h || "").replace("#", "")

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-sm text-gray-700">{label}</p>
        {hint && <p className="text-[11px] leading-snug text-gray-400">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 first:mt-0">{children}</p>
}

export function GuidedSettingsModal({
  open,
  onOpenChange,
  base,
  style,
  setStyle,
  reset,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  base: ResumeDesign
  style: ResumeStyleOverrides
  setStyle: (patch: Partial<ResumeStyleOverrides>) => void
  reset: () => void
}) {
  const eff = {
    font: style.font ?? base.font,
    density: style.density ?? "normal",
    pageMargin: style.pageMargin ?? "wide",
    layout: style.layout ?? base.layout,
    skillStyle: style.skillStyle ?? base.skillStyle,
    sectionTitle: style.sectionTitle ?? base.sectionTitle,
  }
  const dividerOn = eff.sectionTitle !== "plain"

  const sel = (value: string, opts: { v: string; label: string }[], onChange: (v: string) => void) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
      <SelectContent>
        {opts.map((o) => (
          <SelectItem key={o.v} value={o.v} className="text-xs">{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md font-sans">
        <DialogHeader>
          <DialogTitle>Resume settings</DialogTitle>
          <DialogDescription>Applies to the live preview and your PDF &amp; DOCX downloads.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto pr-1">
          <GroupTitle>Typography &amp; spacing</GroupTitle>
          <div className="divide-y divide-gray-100">
            <Row label="Font">{sel(eff.font, FONT_OPTS, (v) => setStyle({ font: v as any }))}</Row>
            <Row label="Spacing" hint="Vertical density of the whole page">
              {sel(eff.density, DENSITY_OPTS, (v) => setStyle({ density: v as any }))}
            </Row>
            <Row label="Margins" hint="Page edge whitespace">
              {sel(eff.pageMargin, MARGIN_OPTS, (v) => setStyle({ pageMargin: v as any }))}
            </Row>
            <Row label="Section divider" hint="Line under section headings">
              <Switch checked={dividerOn} onCheckedChange={(c) => setStyle({ sectionTitle: c ? "underline" : "plain" })} />
            </Row>
            <Row label="Condensed education" hint="Tight 1–2 line entries, no bullets">
              <Switch checked={style.condensedEducation ?? DEFAULT_CONDENSED_EDUCATION} onCheckedChange={(c) => setStyle({ condensedEducation: c })} />
            </Row>
          </div>

          <GroupTitle>Layout</GroupTitle>
          <div className="divide-y divide-gray-100">
            <Row label="Columns">{sel(eff.layout, LAYOUT_OPTS, (v) => setStyle({ layout: v as any }))}</Row>
            <Row label="Skills style">{sel(eff.skillStyle, SKILL_OPTS, (v) => setStyle({ skillStyle: v as any }))}</Row>
          </div>

          <GroupTitle>Color</GroupTitle>
          <div className="divide-y divide-gray-100">
            <Row label="Accent">
              <input
                type="color"
                value={`#${clean(style.accent ?? base.colors.accent)}`}
                onChange={(e) => setStyle({ accent: e.target.value })}
                className="h-8 w-12 cursor-pointer rounded border bg-transparent p-0.5"
                aria-label="Accent color"
              />
            </Row>
          </div>
        </div>

        <div className="mt-2 border-t border-gray-100 pt-3">
          <Button variant="ghost" size="sm" className="w-full gap-1.5 text-gray-600" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset all styling
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
