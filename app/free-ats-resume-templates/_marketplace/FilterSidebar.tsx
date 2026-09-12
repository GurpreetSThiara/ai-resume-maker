"use client"

import React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CATEGORIES,
  availableOptions,
  type CategoryId,
  type FacetCounts,
  type Filters,
  type MultiFilterKey,
} from "./data"
import {
  ATS_THRESHOLDS,
  COLOR_OPTIONS,
  FEATURE_OPTIONS,
  FONT_OPTIONS,
  FORMAT_OPTIONS,
  HEADER_OPTIONS,
  LAYOUT_OPTIONS,
  PRICE_OPTIONS,
  SKILL_STYLE_OPTIONS,
  type FacetOption,
} from "./facets"

interface Props {
  filters: Filters
  counts: Record<string, FacetCounts>
  tags: string[]
  activeFilterCount: number
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
  /** Groups open by default. The rest stay collapsed so the rail stays scannable. */
  defaultOpen?: string[]
}

const ATS_LABELS: Record<number, string> = { 90: "90+", 95: "95+", 98: "98+ (best)" }

/**
 * Faceted filter rail for the template gallery.
 *
 * Rendered once and placed by the parent — as a sticky left column on desktop,
 * and inside the mobile filter sheet — so there is a single source for the
 * filter UI rather than a desktop copy and a mobile copy that drift.
 *
 * Every group is driven by a config array from ./facets, so adding a facet is a
 * data change, not new markup.
 */
export function FilterSidebar({
  filters,
  counts,
  tags,
  activeFilterCount,
  onChange,
  onReset,
  defaultOpen = ["category", "ats", "price", "layout", "color"],
}: Props) {
  const toggle = <T extends string>(key: MultiFilterKey, value: T) => {
    const current = filters[key] as T[]
    onChange({
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    } as Partial<Filters>)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-auto gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5" aria-hidden /> Clear all
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
        <Group value="category" label="Category">
          <ul className="flex flex-col gap-0.5">
            <li>
              <RadioRow
                name="category"
                checked={filters.category === "all"}
                onSelect={() => onChange({ category: "all" })}
                label="All categories"
                count={counts.category?.all}
              />
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <RadioRow
                  name="category"
                  checked={filters.category === cat.id}
                  onSelect={() => onChange({ category: cat.id as CategoryId })}
                  label={cat.name}
                  count={counts.category?.[cat.id]}
                />
              </li>
            ))}
          </ul>
        </Group>

        <Group value="ats" label="ATS score">
          <ul className="flex flex-col gap-0.5">
            <li>
              <RadioRow
                name="ats"
                checked={filters.minAts === 0}
                onSelect={() => onChange({ minAts: 0 })}
                label="Any score"
              />
            </li>
            {ATS_THRESHOLDS.map((threshold) => (
              <li key={threshold}>
                <RadioRow
                  name="ats"
                  checked={filters.minAts === threshold}
                  onSelect={() => onChange({ minAts: threshold as Filters["minAts"] })}
                  label={ATS_LABELS[threshold]}
                  count={counts.minAts?.[threshold]}
                />
              </li>
            ))}
          </ul>
        </Group>

        <CheckGroup
          value="price"
          label="Price"
          options={PRICE_OPTIONS}
          countsKey="prices"
          selected={filters.prices}
          counts={counts.prices}
          onToggle={(v) => toggle("prices", v)}
        />

        <CheckGroup
          value="layout"
          label="Layout"
          options={LAYOUT_OPTIONS}
          countsKey="layouts"
          selected={filters.layouts}
          counts={counts.layouts}
          onToggle={(v) => toggle("layouts", v)}
        />

        <Group value="color" label="Accent colour">
          <ul className="grid grid-cols-3 gap-2">
            {availableOptions("colors", COLOR_OPTIONS).map((option) => {
              const active = filters.colors.includes(option.value)
              const count = counts.colors?.[option.value] ?? 0
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    disabled={count === 0 && !active}
                    aria-pressed={active}
                    onClick={() => toggle("colors", option.value)}
                    className={cn(
                      "flex w-full flex-col items-center gap-1 rounded-lg border p-2 text-[11px] font-medium transition",
                      "disabled:cursor-not-allowed disabled:opacity-35",
                      active
                        ? "border-slate-900 bg-slate-50 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    <span
                      className="relative flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-inset ring-black/10"
                      style={{ background: option.swatch }}
                    >
                      {active && <Check className="h-3.5 w-3.5 text-white" aria-hidden />}
                    </span>
                    <span className="leading-none">{option.label}</span>
                    <span className="leading-none text-slate-400">{count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Group>

        <CheckGroup
          value="font"
          label="Typeface"
          options={FONT_OPTIONS}
          countsKey="fonts"
          selected={filters.fonts}
          counts={counts.fonts}
          onToggle={(v) => toggle("fonts", v)}
        />

        <CheckGroup
          value="header"
          label="Header style"
          options={HEADER_OPTIONS}
          countsKey="headers"
          selected={filters.headers}
          counts={counts.headers}
          onToggle={(v) => toggle("headers", v)}
        />

        <CheckGroup
          value="skills"
          label="Skills display"
          options={SKILL_STYLE_OPTIONS}
          countsKey="skillStyles"
          selected={filters.skillStyles}
          counts={counts.skillStyles}
          onToggle={(v) => toggle("skillStyles", v)}
        />

        <CheckGroup
          value="format"
          label="Download formats"
          options={FORMAT_OPTIONS}
          countsKey="formats"
          selected={filters.formats}
          counts={counts.formats}
          onToggle={(v) => toggle("formats", v)}
        />

        <CheckGroup
          value="features"
          label="Design features"
          options={FEATURE_OPTIONS}
          countsKey="features"
          selected={filters.features}
          counts={counts.features}
          onToggle={(v) => toggle("features", v)}
        />

        <Group value="tags" label="Tags">
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const active = filters.tags.includes(tag)
              const count = counts.tags?.[tag] ?? 0
              return (
                <li key={tag}>
                  <button
                    type="button"
                    disabled={count === 0 && !active}
                    aria-pressed={active}
                    onClick={() => toggle("tags", tag)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                      "disabled:cursor-not-allowed disabled:opacity-35",
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {active && <Check className="h-3 w-3" aria-hidden />}
                    {tag}
                    <span className={active ? "text-white/60" : "text-slate-400"}>{count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Group>
      </Accordion>
    </div>
  )
}

/* ── building blocks ────────────────────────────────────────────────────── */

function Group({ value, label, children }: { value: string; label: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="border-slate-200">
      <AccordionTrigger className="py-3 text-sm font-semibold text-slate-800 hover:no-underline">
        {label}
      </AccordionTrigger>
      <AccordionContent className="pb-4">{children}</AccordionContent>
    </AccordionItem>
  )
}

function CheckGroup<T extends string>({
  value,
  label,
  options,
  selected,
  counts,
  countsKey,
  onToggle,
}: {
  value: string
  label: string
  options: FacetOption<T>[]
  selected: T[]
  counts?: FacetCounts
  countsKey: string
  onToggle: (value: T) => void
}) {
  return (
    <Group value={value} label={label}>
      <ul className="flex flex-col gap-1.5">
        {availableOptions(countsKey, options).map((option) => {
          const active = selected.includes(option.value)
          const count = counts?.[option.value] ?? 0
          const disabled = count === 0 && !active
          const id = `${value}-${option.value}`
          return (
            <li key={option.value}>
              <div
                className={cn(
                  "flex items-start gap-2.5 rounded-md px-1 py-1 transition",
                  disabled ? "opacity-40" : "hover:bg-slate-50",
                )}
              >
                <Checkbox
                  id={id}
                  checked={active}
                  disabled={disabled}
                  onCheckedChange={() => onToggle(option.value)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={id}
                  className={cn(
                    "flex flex-1 cursor-pointer flex-col gap-0.5 text-sm font-normal leading-tight text-slate-700",
                    disabled && "cursor-not-allowed",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      {option.icon && <option.icon className="h-3.5 w-3.5 text-slate-400" aria-hidden />}
                      {option.label}
                    </span>
                    <span className="text-xs tabular-nums text-slate-400">{count}</span>
                  </span>
                  {option.hint && <span className="text-xs text-slate-400">{option.hint}</span>}
                </Label>
              </div>
            </li>
          )
        })}
      </ul>
    </Group>
  )
}

function RadioRow({
  name,
  checked,
  onSelect,
  label,
  count,
}: {
  name: string
  checked: boolean
  onSelect: () => void
  label: string
  count?: number
}) {
  const disabled = count === 0 && !checked
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      name={name}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition",
        "disabled:cursor-not-allowed disabled:opacity-40",
        checked ? "bg-slate-900 font-medium text-white" : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={cn("text-xs tabular-nums", checked ? "text-white/60" : "text-slate-400")}>{count}</span>
      )}
    </button>
  )
}
