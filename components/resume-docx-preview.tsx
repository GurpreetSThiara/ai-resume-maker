"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FileWarning, Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { generateResumeDOCXBytes } from "@/lib/docx-generators"
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { Button } from "@/components/ui/button"

const DEBOUNCE_MS = 500
const MIN_ZOOM = 0.5
const MAX_ZOOM = 1.6
const ZOOM_STEP = 0.1

type Props = { resumeData: ResumeData; template: ResumeTemplate }

export function ResumeDocxPreview({ resumeData, template }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null) // measures available width
  const hostRef = useRef<HTMLDivElement>(null) // docx-preview renders here
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fit, setFit] = useState(1) // auto fit-to-width factor
  const [zoom, setZoom] = useState(1) // user multiplier

  const measure = useCallback(() => {
    const wrap = wrapRef.current
    const host = hostRef.current
    if (!wrap || !host) return
    const page = host.querySelector(".docx") as HTMLElement | null
    const pageW = page?.offsetWidth || 816 // letter @96dpi fallback
    const avail = wrap.clientWidth - 24 // padding allowance
    setFit(Math.min(1, avail > 0 ? avail / pageW : 1))
  }, [])

  useEffect(() => {
    let cancelled = false
    setError(null)
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        const bytes = await generateResumeDOCXBytes({ resumeData, template, filename: "preview.docx" })
        const { renderAsync } = await import("docx-preview")
        if (cancelled || !hostRef.current) return
        hostRef.current.innerHTML = ""
        await renderAsync(new Blob([bytes as unknown as BlobPart]), hostRef.current, undefined, {
          className: "docxpv",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          experimental: true,
          renderHeaders: true,
          renderFooters: true,
        })
        if (cancelled) return
        setLoading(false)
        requestAnimationFrame(measure)
      } catch (e) {
        console.error("[ResumeDocxPreview] render failed:", e)
        if (!cancelled) {
          setError("Could not render the DOCX preview.")
          setLoading(false)
        }
      }
    }, DEBOUNCE_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [resumeData, template, measure])

  useEffect(() => {
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  const effective = Math.max(0.1, fit * zoom)

  return (
    <div className="relative mx-auto flex w-full max-w-[860px] flex-col">
      {/* Zoom controls */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-center gap-2 rounded-t-lg border border-gray-200 bg-gray-50/95 px-1 py-2 backdrop-blur-sm">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))}
          disabled={zoom <= MIN_ZOOM + 0.001}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="min-w-[3.25rem] text-center text-sm tabular-nums text-gray-700">{Math.round(effective * 100)}%</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))}
          disabled={zoom >= MAX_ZOOM - 0.001}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={wrapRef}
        className="relative max-h-[calc(100dvh-16rem)] min-h-[40vh] overflow-auto rounded-b-lg border border-t-0 border-gray-200 bg-gray-100 sm:min-h-[50vh]"
      >
        {error ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 py-16 text-center text-gray-500">
            <FileWarning className="h-10 w-10" aria-hidden />
            <p className="text-sm">{error}</p>
            <p className="max-w-sm text-xs text-gray-400">The Word file can still be downloaded — only the in-browser render failed.</p>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/70">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" aria-label="Rendering DOCX" />
              </div>
            )}
            {/* zoom affects layout (no trailing gap) */}
            <div ref={hostRef} className="docx-host" style={{ zoom: effective } as React.CSSProperties} />
          </>
        )}
      </div>
    </div>
  )
}
