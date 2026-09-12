"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Flame, ShieldCheck } from "lucide-react"
import {
  TEMPLATES,
  TRENDING,
  ATS_CHAMPIONS,
  ALL_TAGS,
  CATEGORY_MAP,
  DEFAULT_FILTERS,
  countActiveFilters,
  facetCounts,
  filterAndSort,
  groupFamilies,
  type Filters,
  type MarketplaceTemplate,
} from "./_marketplace/data"
import { FilterSidebar } from "./_marketplace/FilterSidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Hero } from "./_marketplace/Hero"
import { Toolbar } from "./_marketplace/Toolbar"
import { DiscoveryRow } from "./_marketplace/DiscoveryRow"
import { TemplateCard } from "./_marketplace/TemplateCard"
import { TemplatePreviewModal } from "./_marketplace/TemplatePreviewModal"
import { EmptyState, LoadingState } from "./_marketplace/States"

const PAGE_SIZE = 20

export function Templates() {
  const [rawQuery, setRawQuery] = useState("")
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Debounce the search query into filters.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setFilters((f) => (f.query === rawQuery ? f : { ...f, query: rawQuery }))
    }, 250)
    return () => window.clearTimeout(id)
  }, [rawQuery])

  // Recomputed per filter change so each option can show what selecting it
  // would yield, rather than a static catalog total.
  const counts = useMemo(() => facetCounts(filters), [filters])
  const results = useMemo(() => filterAndSort(TEMPLATES, filters), [filters])
  // Club color-only variants of the same layout into a single design family.
  const families = useMemo(() => groupFamilies(results), [results])

  // Reset pagination whenever the filters change, adjusted during render rather
  // than in an effect — an effect renders the previous page size against the
  // new result set first, which briefly shows the wrong number of cards.
  const [lastFilters, setLastFilters] = useState(filters)
  if (filters !== lastFilters) {
    setLastFilters(filters)
    setVisible(PAGE_SIZE)
  }

  const activeFilterCount = countActiveFilters(filters)
  const isBrowsing = filters.query === "" && filters.category === "all" && activeFilterCount === 0

  const patchFilters = useCallback((patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }))
  }, [])

  const resetAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setRawQuery("")
  }, [])

  const openPreview = useCallback((t: MarketplaceTemplate) => {
    setPreviewTemplate(t)
    setPreviewOpen(true)
  }, [])

  // Infinite reveal sentinel.
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => (v < families.length ? v + PAGE_SIZE : v))
        }
      },
      { rootMargin: "600px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [families.length])

  const shownFamilies = families.slice(0, visible)
  const activeCategory = filters.category !== "all" ? CATEGORY_MAP[filters.category] : null

  return (
    <main className="min-h-screen bg-white">
      <Hero query={rawQuery} onQueryChange={setRawQuery} resultCount={results.length} />

      <div className="mx-auto max-w-7xl px-4 pb-24">
        {/* Desktop: persistent filter rail on the left, as on a storefront.
            Below lg the rail is hidden and the same component is rendered
            inside the sheet, so there is one filter UI, not two. */}
        <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden lg:block" aria-label="Filter templates">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pb-8 pr-1">
              <FilterSidebar
                filters={filters}
                counts={counts}
                tags={ALL_TAGS}
                activeFilterCount={activeFilterCount}
                onChange={patchFilters}
                onReset={resetAll}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <Toolbar
              filters={{ ...filters, query: rawQuery }}
              resultCount={results.length}
              familyCount={families.length}
              activeFilterCount={activeFilterCount}
              onChange={patchFilters}
              onReset={resetAll}
              onOpenFilters={() => setFiltersOpen(true)}
            />

            {/* Discovery rows — only on the default browse view */}
            {isBrowsing && (
              <div className="pt-2">
                <DiscoveryRow
                  title="Trending Templates"
                  subtitle="The most popular picks right now"
                  icon={Flame}
                  accent="bg-orange-100 text-orange-600"
                  templates={TRENDING}
                  onPreview={openPreview}
                />
                <DiscoveryRow
                  title="ATS Champions"
                  subtitle="Highest-scoring templates for applicant tracking systems"
                  icon={ShieldCheck}
                  accent="bg-emerald-100 text-emerald-600"
                  templates={ATS_CHAMPIONS}
                  onPreview={openPreview}
                />
              </div>
            )}

            <section className="pt-8" aria-labelledby="all-templates-heading">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id="all-templates-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                    {activeCategory ? activeCategory.name : isBrowsing ? "All Templates" : "Search Results"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeCategory
                      ? activeCategory.description
                      : `${families.length} designs · ${results.length} colour styles`}
                  </p>
                </div>
              </div>

              {families.length === 0 ? (
                <EmptyState query={filters.query} onReset={resetAll} />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {shownFamilies.map((fam, i) => (
                      <TemplateCard
                        key={fam.familyId}
                        template={fam.variants[0]}
                        variants={fam.variants}
                        onPreview={openPreview}
                        query={filters.query}
                        priority={i < 5}
                      />
                    ))}
                  </div>

                  {visible < families.length && (
                    <div ref={sentinelRef} className="pt-4" aria-hidden>
                      <LoadingState />
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: the same rail inside a sheet. */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col gap-0 p-0">
          <SheetHeader className="border-b border-slate-200 px-4 py-3">
            <SheetTitle className="text-base">Filters</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <FilterSidebar
              filters={filters}
              counts={counts}
              tags={ALL_TAGS}
              activeFilterCount={activeFilterCount}
              onChange={patchFilters}
              onReset={resetAll}
            />
          </div>

          <div className="border-t border-slate-200 p-3">
            <Button className="w-full" onClick={() => setFiltersOpen(false)}>
              Show {families.length} {families.length === 1 ? "design" : "designs"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <TemplatePreviewModal template={previewTemplate} open={previewOpen} onOpenChange={setPreviewOpen} />
    </main>
  )
}
