"use client"

import React from "react"
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CATEGORY_MAP, MULTI_FILTER_KEYS, type Filters, type MultiFilterKey, type SortKey } from "./data"
import {
  COLOR_OPTIONS,
  FEATURE_OPTIONS,
  FONT_OPTIONS,
  FORMAT_OPTIONS,
  HEADER_OPTIONS,
  LAYOUT_OPTIONS,
  PRICE_OPTIONS,
  SKILL_STYLE_OPTIONS,
} from "./facets"

interface Props {
  filters: Filters
  resultCount: number
  familyCount: number
  activeFilterCount: number
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
  /** Opens the filter sheet on small screens, where the rail is hidden. */
  onOpenFilters: () => void
}

const SORT_LABELS: Record<SortKey, string> = {
  popular: "Most popular",
  ats: "Highest ATS score",
  recent: "Recently added",
  az: "Alphabetical A–Z",
  za: "Alphabetical Z–A",
}

const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[]

/**
 * Human labels for each multi-select facet value, so an active-filter chip can
 * read "Sidebar left" rather than the raw `sidebar-left` it filters on.
 */
const VALUE_LABELS: Record<MultiFilterKey, Record<string, string>> = {
  layouts: Object.fromEntries(LAYOUT_OPTIONS.map((o) => [o.value, o.label])),
  fonts: Object.fromEntries(FONT_OPTIONS.map((o) => [o.value, o.label])),
  headers: Object.fromEntries(HEADER_OPTIONS.map((o) => [o.value, o.label])),
  skillStyles: Object.fromEntries(SKILL_STYLE_OPTIONS.map((o) => [o.value, o.label])),
  colors: Object.fromEntries(COLOR_OPTIONS.map((o) => [o.value, o.label])),
  prices: Object.fromEntries(PRICE_OPTIONS.map((o) => [o.value, o.label])),
  formats: Object.fromEntries(FORMAT_OPTIONS.map((o) => [o.value, o.label])),
  features: Object.fromEntries(FEATURE_OPTIONS.map((o) => [o.value, o.label])),
  tags: {},
}

interface ActiveChip {
  key: string
  label: string
  onRemove: () => void
}

export function Toolbar({
  filters,
  resultCount,
  familyCount,
  activeFilterCount,
  onChange,
  onReset,
  onOpenFilters,
}: Props) {
  const chips: ActiveChip[] = []

  if (filters.category !== "all") {
    chips.push({
      key: `category-${filters.category}`,
      label: CATEGORY_MAP[filters.category]?.name ?? filters.category,
      onRemove: () => onChange({ category: "all" }),
    })
  }

  if (filters.minAts !== 0) {
    chips.push({
      key: `ats-${filters.minAts}`,
      label: `ATS ${filters.minAts}+`,
      onRemove: () => onChange({ minAts: 0 }),
    })
  }

  for (const key of MULTI_FILTER_KEYS) {
    for (const value of filters[key] as string[]) {
      chips.push({
        key: `${key}-${value}`,
        label: VALUE_LABELS[key][value] ?? value,
        onRemove: () =>
          onChange({ [key]: (filters[key] as string[]).filter((v) => v !== value) } as Partial<Filters>),
      })
    }
  }

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFilters}
            className={cn("lg:hidden", activeFilterCount > 0 && "border-primary/40 bg-primary/5 text-primary")}
          >
            <SlidersHorizontal aria-hidden />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{familyCount}</span>{" "}
            {familyCount === 1 ? "design" : "designs"}
            <span className="hidden text-slate-400 sm:inline"> · {resultCount} colour styles</span>
          </p>
        </div>

        <label className="relative inline-flex items-center">
          <ArrowUpDown className="pointer-events-none absolute left-2.5 h-4 w-4 text-slate-400" aria-hidden />
          <span className="sr-only">Sort templates</span>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortKey })}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-8 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {SORT_KEYS.map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap items-center gap-1.5 pb-3 pl-1">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {chip.label}
                <X className="h-3 w-3 text-slate-400" aria-hidden />
                <span className="sr-only">Remove filter</span>
              </button>
            </li>
          ))}
          <li>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-auto px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              Clear all
            </Button>
          </li>
        </ul>
      )}
    </div>
  )
}
