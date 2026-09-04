"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { PerLineStyle, ResumeData, ResumeTemplate } from "@/types/resume"
import { getResumeDesign, mergeDesign } from "@/lib/resume-designs"
import { moveSectionUp, moveSectionDown } from "@/utils/sectionOrdering"
import ConfigurableResume from "@/components/resumes/shared/ConfigurableResume"
import { IconButton } from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"
import DeleteConfirmModal from "@/components/appUI/modals/DeleteConfirmModal"
import { FloatingToolbar } from "./FloatingToolbar"
import type { Selection, SelKind } from "./studio-shared"
import { FONT_CSS } from "@/lib/render-spec"
import { Minus, Plus } from "lucide-react"

const ResumePdfPreview = dynamic(
  () => import("@/components/resume-pdf-preview").then((m) => m.ResumePdfPreview),
  { ssr: false, loading: () => <div className="p-10 text-center text-sm text-gray-400">Loading preview…</div> },
)

const A4 = 842
const KIND_LABEL: Record<string, string> = {
  name: "Name", summary: "Summary", heading: "Heading", body: "Text", section: "Section", page: "Page",
}

export function StudioCanvas({
  resumeData,
  setResumeData,
  template,
  zoom,
  setZoom,
  onSelect,
  isPreview,
  onPageCount,
}: {
  resumeData: ResumeData
  setResumeData: (v: ResumeData | ((p: ResumeData) => ResumeData)) => void
  template: ResumeTemplate
  zoom: number
  setZoom: (z: number) => void
  onSelect: (s: Selection) => void
  isPreview: boolean
  onPageCount?: (n: number) => void
}) {
  const pdfRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(1)
  const [floatRect, setFloatRect] = useState<DOMRect | null>(null)
  const [floatSel, setFloatSel] = useState<Selection>({ kind: null })

  const design = mergeDesign(getResumeDesign(template.id) ?? getResumeDesign("classic-blue")!, resumeData.style)

  // Derive page count from the rendered page height.
  useEffect(() => {
    if (isPreview) return
    const el = wrapRef.current?.querySelector("[data-resume-page]") as HTMLElement | null
    if (!el) return
    const measure = () => {
      const natural = el.getBoundingClientRect().height / (zoom || 1)
      const n = Math.max(1, Math.ceil(natural / A4 - 0.03))
      setPageCount(n)
      onPageCount?.(n)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [zoom, resumeData, template.id, isPreview])

  // Zoom with Ctrl/Cmd + wheel and trackpad pinch (which the browser reports as a
  // wheel event with ctrlKey set). Attached non-passively so we can prevent the
  // browser's own page zoom.
  useEffect(() => {
    const el = wrapRef.current
    if (!el || isPreview) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setZoom(Math.min(2, Math.max(0.5, +(zoom - e.deltaY * 0.0015).toFixed(2))))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [zoom, isPreview, setZoom])

  const resolveSel = (target: HTMLElement | null): Selection => {
    if (!target) return { kind: "page" }
    const elNode = target.closest("[data-el]") as HTMLElement | null
    const sidNode = target.closest("[data-sid]") as HTMLElement | null
    const lkNode = target.closest("[data-linekey]") as HTMLElement | null
    const kind = ((elNode?.dataset.el as SelKind) || (sidNode ? "section" : "page")) as SelKind
    return { kind, sid: sidNode?.dataset.sid, linekey: lkNode?.dataset.linekey }
  }

  const setLine = (patch: Partial<PerLineStyle>) => {
    const k = floatSel.linekey
    if (!k) return
    setResumeData((prev) => ({ ...prev, lineStyles: { ...(prev.lineStyles || {}), [k]: { ...(prev.lineStyles?.[k] || {}), ...patch } } }))
  }

  const handleFocusIn = (e: React.FocusEvent) => {
    const node = e.target as HTMLElement
    const sel = resolveSel(node)
    onSelect(sel)
    setFloatSel(sel)
    setFloatRect(sel.kind === "page" ? null : node.getBoundingClientRect())
  }
  const handleClick = (e: React.MouseEvent) => onSelect(resolveSel(e.target as HTMLElement))

  const moveSec = (dir: "up" | "down") => {
    if (!floatSel.sid) return
    setResumeData((prev) => ({ ...prev, sections: (dir === "up" ? moveSectionUp : moveSectionDown)(prev.sections, floatSel.sid!) }))
  }
  const [confirmDelSid, setConfirmDelSid] = useState<string | null>(null)
  const delSec = () => {
    if (!floatSel.sid) return
    setConfirmDelSid(floatSel.sid)
  }
  const doDelSec = () => {
    const sid = confirmDelSid
    setConfirmDelSid(null)
    if (!sid) return
    setResumeData((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== sid) }))
    setFloatRect(null)
  }

  if (isPreview) {
    return (
      <div className="flex flex-1 justify-center overflow-auto bg-gray-100 p-8">
        <ResumePdfPreview resumeData={resumeData} template={template} />
      </div>
    )
  }


  return (
    <div className="relative flex-1 overflow-hidden bg-gray-100">
      {/* decorative rulers */}
      <div className="pointer-events-none absolute left-6 right-0 top-0 z-10 h-6 border-b border-gray-200 bg-white" style={{ backgroundImage: "repeating-linear-gradient(to right,var(--ruler-line) 0 1px,transparent 1px 28.3px)" }} />
      <div className="pointer-events-none absolute bottom-0 left-0 top-6 z-10 w-6 border-r border-gray-200 bg-white" style={{ backgroundImage: "repeating-linear-gradient(to bottom,var(--ruler-line) 0 1px,transparent 1px 28.3px)" }} />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-6 w-6 border-b border-r border-gray-200 bg-white" />

      {/* page count */}
      <div className="absolute right-4 top-9 z-20 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-gray-500 shadow-sm">
        {pageCount} {pageCount === 1 ? "page" : "pages"}
      </div>

      {/* scrollable canvas */}
      <div
        ref={wrapRef}
        className="absolute bottom-0 left-6 right-0 top-6 overflow-auto"
        onFocusCapture={handleFocusIn}
        onClick={handleClick}
        onScroll={() => setFloatRect(null)}
      >
        <div className="flex min-h-full justify-center py-8">
          <ConfigurableResume
            pdfRef={pdfRef as React.RefObject<HTMLDivElement>}
            font={{ className: "", name: FONT_CSS.sans }}
            resumeData={resumeData}
            setResumeData={setResumeData}
            activeSection=""
            design={design}
            crud
            editorFit
            zoomLevel={zoom}
          />
        </div>
      </div>

      {/* zoom controls */}
      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-lg">
        <IconButton label="Zoom out" onClick={() => setZoom(Math.max(0.5, +(zoom - 0.1).toFixed(2)))}><Minus /></IconButton>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 px-0 text-xs font-medium text-gray-700"
          title="Reset to 100%"
          onClick={() => setZoom(1)}
        >
          {Math.round(zoom * 100)}%
        </Button>
        <IconButton label="Zoom in" onClick={() => setZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))}><Plus /></IconButton>
      </div>

      <FloatingToolbar
        rect={floatRect}
        label={KIND_LABEL[floatSel.kind || "page"] || "Element"}
        lineStyle={floatSel.linekey ? resumeData.lineStyles?.[floatSel.linekey] : undefined}
        onLine={floatSel.linekey ? setLine : undefined}
        onUp={floatSel.sid ? () => moveSec("up") : undefined}
        onDown={floatSel.sid ? () => moveSec("down") : undefined}
        onDelete={floatSel.sid ? delSec : undefined}
      />

      <DeleteConfirmModal
        open={!!confirmDelSid}
        onOpenChange={(open) => { if (!open) setConfirmDelSid(null) }}
        onConfirm={doDelSec}
        title="Delete this section?"
        description="The section and its content will be removed. You can bring it back with Undo (Ctrl+Z)."
      />
    </div>
  )
}

export default StudioCanvas
