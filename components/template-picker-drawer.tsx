"use client"

import React, { useMemo, useState } from "react"
import { LayoutGrid, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { TEMPLATES, CATEGORY_MAP, type MarketplaceTemplate } from "@/app/free-ats-resume-templates/_marketplace/data"
import { TemplateThumb, AtsBadge, PremiumBadge } from "@/app/free-ats-resume-templates/_marketplace/shared"

interface TemplatePickerDrawerProps {
  selectedId: string
  onSelect: (id: string) => void
  triggerClassName?: string
}

export function TemplatePickerDrawer({ selectedId, onSelect, triggerClassName }: TemplatePickerDrawerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TEMPLATES
    return TEMPLATES.filter((t) => {
      const hay = `${t.name} ${t.description} ${CATEGORY_MAP[t.category]?.name ?? ""} ${t.tags.join(" ")}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query])

  const selected = TEMPLATES.find((t) => t.id === selectedId)

  const choose = (t: MarketplaceTemplate) => {
    onSelect(t.id)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className={cn("h-10 px-4 rounded-md text-sm flex items-center gap-2", triggerClassName)}>
          <LayoutGrid className="w-4 h-4" />
          <span className="truncate max-w-[9rem]">{selected ? selected.name : "Change Template"}</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full p-0 sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col gap-0"
      >
        {/* Header (sticky) */}
        <div className="shrink-0 border-b bg-background px-4 pt-4 pb-3">
          <SheetTitle className="text-base text-slate-900 pr-8">Choose a template</SheetTitle>
          <SheetDescription className="mt-0.5 text-xs text-slate-500">
            {TEMPLATES.length} designs · tap a preview to switch instantly
          </SheetDescription>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates, categories, tags…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
              aria-label="Search templates"
            />
          </div>
        </div>

        {/* Grid (scrollable) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {results.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-slate-400">
              <Search className="h-7 w-7" aria-hidden />
              <p className="text-sm">No templates match “{query}”.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {results.map((t) => {
                const isActive = t.id === selectedId
                const category = CATEGORY_MAP[t.category]
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => choose(t)}
                    aria-pressed={isActive}
                    aria-label={`Use ${t.name} template`}
                    className={cn(
                      "group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all",
                      "hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive ? "border-primary ring-2 ring-primary" : "border-slate-200 hover:border-slate-300",
                    )}
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                      <TemplateThumb
                        src={t.thumbnail}
                        alt={`${t.name} preview`}
                        sizes="(max-width: 640px) 45vw, 200px"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-1.5">
                        <PremiumBadge isPremium={t.isPremium} />
                        <AtsBadge score={t.atsScore} className="bg-white/95 backdrop-blur" />
                      </div>
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                            <Check className="h-5 w-5" aria-hidden />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 p-2">
                      <span className="truncate text-[13px] font-semibold leading-tight text-slate-900">{t.name}</span>
                      <span className="truncate text-[11px] text-slate-500">{category?.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default TemplatePickerDrawer
