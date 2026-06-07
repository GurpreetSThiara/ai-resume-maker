"use client"

import React from "react"
import Link from "next/link"
import { Eye, ArrowRight, Flame, Sparkle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORY_MAP,
  formatDownloads,
  useTemplateHref,
  type MarketplaceTemplate,
} from "./data"
import { AtsBadge, PremiumBadge, Highlight, TemplateThumb } from "./shared"

interface TemplateCardProps {
  template: MarketplaceTemplate
  onPreview: (t: MarketplaceTemplate) => void
  query?: string
  priority?: boolean
  className?: string
}

function TemplateCardBase({ template, onPreview, query = "", priority, className }: TemplateCardProps) {
  const category = CATEGORY_MAP[template.category]
  const Icon = category?.icon

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
          src={template.thumbnail}
          alt={`${template.name} resume template preview`}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          priority={priority}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Top badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col items-start gap-1.5">
            <PremiumBadge isPremium={template.isPremium} />
            {template.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                <Sparkle className="h-2.5 w-2.5" aria-hidden /> New
              </span>
            )}
          </div>
          <AtsBadge score={template.atsScore} className="bg-white/95 backdrop-blur" />
        </div>

        {/* Hover overlay actions */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-900/70 via-slate-900/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex w-full items-center gap-2 p-3 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <button
              type="button"
              onClick={() => onPreview(template)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-sm font-semibold text-slate-900 shadow backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Quick preview ${template.name}`}
            >
              <Eye className="h-4 w-4" aria-hidden /> Preview
            </button>
            <Link
              href={useTemplateHref(template.templateId)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Use ${template.name} template`}
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
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500" title={`${template.popularityScore}% popularity`}>
            <Flame className="h-3 w-3 text-orange-500" aria-hidden />
            {formatDownloads(template.downloads)}
          </span>
        </div>

        <h3 className="text-[15px] font-semibold leading-tight text-slate-900">
          <Highlight text={template.name} query={query} />
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-500">
          <Highlight text={template.description} query={query} />
        </p>

        {/* Popularity bar */}
        <div className="mt-auto pt-2">
          <div className="mb-2 flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
                {tag}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100" title={`${template.popularityScore}% popularity`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500"
              style={{ width: `${template.popularityScore}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

export const TemplateCard = React.memo(TemplateCardBase)
