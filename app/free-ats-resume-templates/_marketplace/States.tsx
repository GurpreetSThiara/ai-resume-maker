"use client"

import React from "react"
import { SearchX, RotateCcw } from "lucide-react"

export function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <SearchX className="h-9 w-9 text-slate-400" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">No templates found</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        {query
          ? `We couldn't find any templates matching “${query}”. Try a different keyword or clear your filters.`
          : "No templates match your current filters. Try broadening your selection."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <RotateCcw className="h-4 w-4" aria-hidden /> Reset filters
      </button>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-busy="true" aria-label="Loading templates">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[3/4] w-full animate-pulse bg-slate-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-1.5 w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
