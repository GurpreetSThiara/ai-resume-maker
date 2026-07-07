"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ZoomIn, ZoomOut, RotateCcw, ArrowRight, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  CATEGORY_MAP,
  formatDownloads,
  useTemplateHref,
  previewTemplateHref,
  type MarketplaceTemplate,
} from "./data"
import { PremiumBadge, TemplateThumb } from "./shared"

interface Props {
  template: MarketplaceTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ZOOM_MIN = 0.6
const ZOOM_MAX = 2
const ZOOM_STEP = 0.2

export function TemplatePreviewModal({ template, open, onOpenChange }: Props) {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (open) setZoom(1)
  }, [open, template?.id])

  if (!template) return null
  const category = CATEGORY_MAP[template.category]
  const Icon = category?.icon
  const templateHref = useTemplateHref(template.templateId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex flex-col gap-0 overflow-hidden p-0 w-full max-w-full h-[92vh] rounded-b-none rounded-t-2xl !bottom-0 !top-auto !translate-y-0 sm:h-auto sm:max-h-[88vh] sm:max-w-5xl sm:rounded-2xl sm:!top-1/2 sm:!bottom-auto sm:!-translate-y-1/2"
        aria-describedby={`preview-desc-${template.id}`}
      >
        <DialogTitle className="sr-only">{template.name} template preview</DialogTitle>
        <DialogDescription id={`preview-desc-${template.id}`} className="sr-only">
          {template.description}
        </DialogDescription>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[1.4fr_1fr]">
          {/* Preview pane */}
          <div className="relative flex min-h-[40vh] flex-col bg-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-2 backdrop-blur">
              <span className="text-xs font-medium text-slate-500">Live preview</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
                  disabled={zoom <= ZOOM_MIN}
                  className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="min-w-[3rem] text-center text-xs tabular-nums text-slate-600">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
                  disabled={zoom >= ZOOM_MAX}
                  className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div
                className="mx-auto w-full max-w-sm origin-top transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-200">
                  <div className="relative aspect-[3/4] w-full">
                    <TemplateThumb
                      src={template.thumbnail}
                      alt={`${template.name} full preview`}
                      sizes="400px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details pane */}
          <div className="flex flex-col overflow-y-auto p-6">
            <div className="flex items-center gap-2">
              <PremiumBadge isPremium={template.isPremium} />
              {template.isNew && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">New</span>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{template.name}</h2>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
              {Icon && <Icon className="h-4 w-4" aria-hidden />}
              {category?.name}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">{template.description}</p>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat label="Popularity" value={`${template.popularityScore}%`} />
              <Stat label="Downloads" value={formatDownloads(template.downloads)} />
            </div>


            {/* Tags */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs (desktop — mobile uses the sticky footer below) */}
            <div className="mt-auto hidden space-y-2 pt-6 md:block">
              <Link
                href={templateHref}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Use this template <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={previewTemplateHref(template.templateId)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" aria-hidden /> Open full preview
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky action footer (mobile) */}
        <div
          className="flex items-center gap-2 border-t border-slate-200 bg-white p-3 md:hidden"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <Link
            href={previewTemplateHref(template.templateId)}
            aria-label="Open full preview"
            className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-slate-700"
          >
            <Eye className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            href={templateHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            Use this template <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
      <div className={cn("text-xl font-bold tabular-nums text-slate-900", accent)}>{value}</div>
      <div className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</div>
    </div>
  )
}

