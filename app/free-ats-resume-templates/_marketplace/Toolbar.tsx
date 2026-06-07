"use client"

import React, { useState } from "react"
import { SlidersHorizontal, ArrowUpDown, X, Check, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORIES,
  ALL_TAGS,
  type CategoryId,
  type Filters,
  type SortKey,
  type AccessFilter,
} from "./data"

interface Props {
  filters: Filters
  counts: Record<string, number>
  resultCount: number
  activeFilterCount: number
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
}

const SORT_LABELS: Record<SortKey, string> = {
  popular: "Most Popular",
  ats: "Highest ATS Score",
  recent: "Recently Added",
  downloads: "Most Downloaded",
  az: "Alphabetical A–Z",
  za: "Alphabetical Z–A",
}

const ACCESS_OPTIONS: { value: AccessFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "premium", label: "Premium" },
]

const ATS_OPTIONS: { value: Filters["minAts"]; label: string }[] = [
  { value: 0, label: "Any" },
  { value: 90, label: "90+" },
  { value: 95, label: "95+" },
  { value: 98, label: "98+" },
]

export function Toolbar({ filters, counts, resultCount, activeFilterCount, onChange, onReset }: Props) {
  const [showFilters, setShowFilters] = useState(false)

  const setCategory = (c: CategoryId | "all") => onChange({ category: c })

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      {/* Category pills */}
      <div className="mx-auto max-w-7xl px-4">
        <div
          className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Template categories"
        >
          <Pill
            active={filters.category === "all"}
            onClick={() => setCategory("all")}
            icon={<LayoutGrid className="h-3.5 w-3.5" />}
            label="All"
            count={counts.all}
          />
          {CATEGORIES.map((cat) => (
            <Pill
              key={cat.id}
              active={filters.category === cat.id}
              onClick={() => setCategory(cat.id)}
              icon={<cat.icon className="h-3.5 w-3.5" />}
              label={cat.name}
              count={counts[cat.id] ?? 0}
            />
          ))}
        </div>
      </div>

      {/* Controls bar */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{resultCount}</span> templates
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                showFilters || activeFilterCount > 0
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <label className="relative inline-flex items-center">
              <ArrowUpDown className="pointer-events-none absolute left-2.5 h-4 w-4 text-slate-400" aria-hidden />
              <span className="sr-only">Sort templates</span>
              <select
                value={filters.sort}
                onChange={(e) => onChange({ sort: e.target.value as SortKey })}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-8 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABELS[k]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl space-y-4 px-4 py-4">
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                <FilterGroup label="Access">
                  <Segmented
                    options={ACCESS_OPTIONS}
                    value={filters.access}
                    onChange={(v) => onChange({ access: v })}
                  />
                </FilterGroup>

                <FilterGroup label="ATS Score">
                  <Segmented
                    options={ATS_OPTIONS}
                    value={filters.minAts}
                    onChange={(v) => onChange({ minAts: v })}
                  />
                </FilterGroup>
              </div>

              <FilterGroup label="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TAGS.map((tag) => {
                    const active = filters.tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          onChange({
                            tags: active ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag],
                          })
                        }
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                          active
                            ? "border-primary bg-primary text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                        )}
                        aria-pressed={active}
                      >
                        {active && <Check className="h-3 w-3" aria-hidden />}
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </FilterGroup>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
                >
                  <X className="h-4 w-4" aria-hidden /> Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Pill({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      {icon}
      {label}
      <span className={cn("text-xs", active ? "text-white/70" : "text-slate-400")}>{count}</span>
    </button>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      {children}
    </div>
  )
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            "rounded-md px-3 py-1 text-sm font-medium transition",
            value === opt.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
