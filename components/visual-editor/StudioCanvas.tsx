"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { PerLineStyle, ResumeData, ResumeTemplate } from "@/types/resume"
import { getResumeDesign, mergeDesign } from "@/lib/resume-designs"
import { moveSectionUp, moveSectionDown } from "@/utils/sectionOrdering"
import ConfigurableResume from "@/components/resumes/shared/ConfigurableResume"
import { FloatingToolbar } from "./FloatingToolbar"
import type { Selection, SelKind } from "./studio-shared"
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

  const zoomBtn = "flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"

  return (
    <div className="relative flex-1 overflow-hidden bg-gray-100">
      {/* decorative rulers */}
      <div className="pointer-events-none absolute left-6 right-0 top-0 z-10 h-6 border-b border-gray-200 bg-white" style={{ backgroundImage: "repeating-linear-gradient(to right,#d1d5db 0 1px,transparent 1px 28.3px)" }} />
      <div className="pointer-events-none absolute bottom-0 left-0 top-6 z-10 w-6 border-r border-gray-200 bg-white" style={{ backgroundImage: "repeating-linear-gradient(to bottom,#d1d5db 0 1px,transparent 1px 28.3px)" }} />
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
            font={{ className: "", name: "Helvetica, Arial, sans-serif" }}
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
        <button className={zoomBtn} onClick={() => setZoom(Math.max(0.5, +(zoom - 0.1).toFixed(2)))} aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
        <button className="w-12 text-center text-xs font-medium text-gray-700" onClick={() => setZoom(1)} title="Reset to 100%">{Math.round(zoom * 100)}%</button>
        <button className={zoomBtn} onClick={() => setZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))} aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
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

      {confirmDelSid && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50" onClick={() => setConfirmDelSid(null)}>
          <div className="w-[340px] max-w-[90%] rounded-xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-gray-900">Delete this section?</p>
            <p className="mt-1.5 mb-4 text-sm leading-relaxed text-gray-500">
              The section and its content will be removed. You can bring it back with Undo (Ctrl+Z).
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelSid(null)} className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={doDelSec} className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioCanvas
