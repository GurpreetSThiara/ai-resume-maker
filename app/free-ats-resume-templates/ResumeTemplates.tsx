"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Flame, ShieldCheck, Download } from "lucide-react"
import {
  TEMPLATES,
  TRENDING,
  ATS_CHAMPIONS,
  MOST_DOWNLOADED,
  CATEGORY_MAP,
  DEFAULT_FILTERS,
  categoryCounts,
  filterAndSort,
  type Filters,
  type MarketplaceTemplate,
} from "./_marketplace/data"
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

  // Debounce the search query into filters.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setFilters((f) => (f.query === rawQuery ? f : { ...f, query: rawQuery }))
    }, 250)
    return () => window.clearTimeout(id)
  }, [rawQuery])

  const counts = useMemo(() => categoryCounts(), [])
  const results = useMemo(() => filterAndSort(TEMPLATES, filters), [filters])

  // Reset pagination whenever the result set changes.
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [filters])

  const isBrowsing =
    filters.query === "" &&
    filters.category === "all" &&
    filters.access === "all" &&
    filters.minAts === 0 &&
    filters.tags.length === 0

  const activeFilterCount =
    (filters.access !== "all" ? 1 : 0) + (filters.minAts !== 0 ? 1 : 0) + filters.tags.length

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
          setVisible((v) => (v < results.length ? v + PAGE_SIZE : v))
        }
      },
      { rootMargin: "600px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [results.length])

  const shown = results.slice(0, visible)
  const activeCategory = filters.category !== "all" ? CATEGORY_MAP[filters.category] : null

  return (
    <main className="min-h-screen bg-white">
      <Hero query={rawQuery} onQueryChange={setRawQuery} resultCount={results.length} />

      <Toolbar
        filters={{ ...filters, query: rawQuery }}
        counts={counts}
        resultCount={results.length}
        activeFilterCount={activeFilterCount}
        onChange={patchFilters}
        onReset={resetAll}
      />

      <div className="mx-auto max-w-7xl px-4 pb-24">
        <>
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
                <DiscoveryRow
                  title="Most Downloaded"
                  subtitle="Trusted by thousands of job seekers"
                  icon={Download}
                  accent="bg-indigo-100 text-indigo-600"
                  templates={MOST_DOWNLOADED}
                  onPreview={openPreview}
                />
              </div>
            )}

            {/* Section heading */}
            <section className="pt-8" aria-labelledby="all-templates-heading">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id="all-templates-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                    {activeCategory ? activeCategory.name : isBrowsing ? "All Templates" : "Search Results"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeCategory ? activeCategory.description : `${results.length} templates available`}
                  </p>
                </div>
              </div>

              {results.length === 0 ? (
                <EmptyState query={filters.query} onReset={resetAll} />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {shown.map((t, i) => (
                      <TemplateCard key={t.id} template={t} onPreview={openPreview} query={filters.query} priority={i < 5} />
                    ))}
                  </div>

                  {visible < results.length && (
                    <div ref={sentinelRef} className="pt-4" aria-hidden>
                      <LoadingState />
                    </div>
                  )}
                </>
              )}
            </section>
        </>
      </div>

      <TemplatePreviewModal template={previewTemplate} open={previewOpen} onOpenChange={setPreviewOpen} />
    </main>
  )
}
