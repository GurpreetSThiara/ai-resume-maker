"use client"

/**
 * /dev/parity — render-parity harness.
 *
 * For a chosen template it renders the REAL PDF and the HTML canvas
 * (ConfigurableResume) at the SAME scale, side-by-side or overlaid, so drift
 * between preview and export is visible per template. Dev-only.
 *
 * The PDF is drawn at scale = PT_TO_PX (595.28pt → ~793px); the canvas is zoomed
 * so its 595px page is also ~793px — matched widths for overlay.
 */
import { useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import ConfigurableResume from "@/components/resumes/shared/ConfigurableResume"
import { getResumeDesign, mergeDesign } from "@/lib/resume-designs"
import { availableTemplates } from "@/lib/templates"
import { sampleResume } from "@/lib/examples/resume-example"
import { PT_TO_PX, PAGE_PT } from "@/lib/render-spec"
import type { ResumeData } from "@/types/resume"

const PdfPane = dynamic(() => import("./PdfPane"), {
  ssr: false,
  loading: () => <Loader2 className="mx-auto my-10 h-6 w-6 animate-spin text-gray-400" />,
})

const CANVAS_W = PAGE_PT.w * PT_TO_PX // ~793px target width for both panes

export default function ParityPage() {
  const [templateId, setTemplateId] = useState(availableTemplates[0]?.id || "classic-blue")
  const [mode, setMode] = useState<"side" | "overlay">("side")
  const [opacity, setOpacity] = useState(0.5)
  const pdfRef = useRef<HTMLDivElement>(null)
  const [data] = useState<ResumeData>(() => structuredClone(sampleResume))

  const template = useMemo(() => availableTemplates.find((t) => t.id === templateId) || availableTemplates[0], [templateId])
  const design = useMemo(() => mergeDesign(getResumeDesign(template.id) ?? getResumeDesign("classic-blue")!, data.style), [template, data.style])
  const canvasZoom = CANVAS_W / PAGE_PT.w

  const Canvas = (
    <div style={{ width: CANVAS_W }} className="shrink-0">
      <ConfigurableResume
        pdfRef={pdfRef as React.RefObject<HTMLDivElement>}
        font={{ className: "", name: "Helvetica, Arial, sans-serif" }}
        resumeData={data}
        setResumeData={() => {}}
        activeSection=""
        design={design}
        editorFit
        zoomLevel={canvasZoom}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Render parity</h1>
          <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="h-9 rounded-md border border-gray-300 px-2 text-sm">
            {availableTemplates.map((t) => <option key={t.id} value={t.id}>{t.name || t.id}</option>)}
          </select>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 text-sm">
            <button onClick={() => setMode("side")} className={`rounded px-3 py-1 ${mode === "side" ? "bg-primary text-white" : "text-gray-600"}`}>Side by side</button>
            <button onClick={() => setMode("overlay")} className={`rounded px-3 py-1 ${mode === "overlay" ? "bg-primary text-white" : "text-gray-600"}`}>Overlay</button>
          </div>
          {mode === "overlay" && (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Canvas opacity
              <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
            </label>
          )}
          <span className="text-xs text-gray-400">PDF @ {PT_TO_PX.toFixed(3)}× · Canvas zoom {canvasZoom.toFixed(3)}×</span>
        </div>

        {mode === "side" ? (
          <div className="flex gap-6 overflow-auto">
            <figure><figcaption className="mb-1 text-xs font-semibold text-gray-500">REAL PDF</figcaption><PdfPane resumeData={data} template={template} width={CANVAS_W} /></figure>
            <figure><figcaption className="mb-1 text-xs font-semibold text-gray-500">HTML CANVAS</figcaption>{Canvas}</figure>
          </div>
        ) : (
          <div className="relative" style={{ width: CANVAS_W }}>
            <PdfPane resumeData={data} template={template} width={CANVAS_W} />
            <div className="absolute inset-0" style={{ opacity }}>{Canvas}</div>
          </div>
        )}
      </div>
    </div>
  )
}
