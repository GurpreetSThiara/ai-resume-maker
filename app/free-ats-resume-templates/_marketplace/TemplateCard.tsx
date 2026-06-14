"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, ArrowRight, Flame, Sparkle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORY_MAP,
  formatDownloads,
  useTemplateHref,
  type MarketplaceTemplate,
} from "./data"
import { PremiumBadge, Highlight, TemplateThumb } from "./shared"

interface TemplateCardProps {
  /** Representative template (also used when there is a single variant). */
  template: MarketplaceTemplate
  /** Colour variants of the same design family. When >1, swatches are shown. */
  variants?: MarketplaceTemplate[]
  onPreview: (t: MarketplaceTemplate) => void
  query?: string
  priority?: boolean
  className?: string
}

function TemplateCardBase({ template, variants, onPreview, query = "", priority, className }: TemplateCardProps) {
  const list = variants && variants.length ? variants : [template]
  const multi = list.length > 1
  const [activeId, setActiveId] = useState(list[0].id)
  const active = list.find((v) => v.id === activeId) ?? list[0]

  const category = CATEGORY_MAP[active.category]
  const Icon = category?.icon
  const title = multi ? active.familyName : active.name

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white",
        "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl",
        "focus-within:ring-2 focus-within:ring-primary/40",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <TemplateThumb
          key={active.id}
          src={active.thumbnail}
          alt={`${active.name} resume template preview`}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          priority={priority}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Top badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col items-start gap-1.5">
            <PremiumBadge isPremium={active.isPremium} />
            {active.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                <Sparkle className="h-2.5 w-2.5" aria-hidden /> New
              </span>
            )}
          </div>
        </div>

        {/* Hover overlay actions */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-900/70 via-slate-900/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex w-full items-center gap-2 p-3 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <button
              type="button"
              onClick={() => onPreview(active)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-sm font-semibold text-slate-900 shadow backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Quick preview ${active.name}`}
            >
              <Eye className="h-4 w-4" aria-hidden /> Preview
            </button>
            <Link
              href={useTemplateHref(active.templateId)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Use ${active.name} template`}
            >
              Use <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {Icon && <Icon className="h-3 w-3" aria-hidden />}
            {category?.name}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500" title={`${active.popularityScore}% popularity`}>
            <Flame className="h-3 w-3 text-orange-500" aria-hidden />
            {formatDownloads(active.downloads)}
          </span>
        </div>

        <h3 className="text-[15px] font-semibold leading-tight text-slate-900">
          <Highlight text={title} query={query} />
          {multi && <span className="ml-1 font-normal text-slate-400">· {active.colorName}</span>}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-500">
          <Highlight text={active.description} query={query} />
        </p>

        {/* Colour swatches (design family variants) */}
        {multi && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5" role="group" aria-label="Colour variants">
            {list.map((v) => {
              const selected = v.id === active.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveId(v.id)}
                  title={v.colorName}
                  aria-label={`${v.colorName} colour`}
                  aria-pressed={selected}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 transition",
                    selected ? "ring-2 ring-offset-1 ring-slate-900" : "hover:scale-110",
                  )}
                  style={{ backgroundColor: v.accentHex }}
                >
                  {selected && <Check className="h-3 w-3 text-white drop-shadow" aria-hidden />}
                </button>
              )
            })}
            <span className="ml-0.5 text-[10px] font-medium text-slate-400">{list.length} colors</span>
          </div>
        )}

        {/* Tags + popularity */}
        <div className="mt-auto pt-2">
          <div className="mb-2 flex flex-wrap gap-1">
            {active.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
                {tag}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100" title={`${active.popularityScore}% popularity`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500"
              style={{ width: `${active.popularityScore}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

export const TemplateCard = React.memo(TemplateCardBase)
