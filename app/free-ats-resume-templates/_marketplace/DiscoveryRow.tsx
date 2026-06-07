"use client"

import React, { useRef } from "react"
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react"
import { TemplateCard } from "./TemplateCard"
import type { MarketplaceTemplate } from "./data"

interface Props {
  title: string
  subtitle: string
  icon: LucideIcon
  accent: string
  templates: MarketplaceTemplate[]
  onPreview: (t: MarketplaceTemplate) => void
}

export function DiscoveryRow({ title, subtitle, icon: Icon, accent, templates, onPreview }: Props) {
  const scroller = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 720), behavior: "smooth" })
  }

  return (
    <section className="py-6" aria-labelledby={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 id={`row-${title.replace(/\s+/g, "-").toLowerCase()}`} className="text-xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {templates.map((t, i) => (
          <div key={t.id} role="listitem" className="w-[230px] shrink-0 snap-start sm:w-[250px]">
            <TemplateCard template={t} onPreview={onPreview} priority={i < 3} />
          </div>
        ))}
      </div>
    </section>
  )
}
