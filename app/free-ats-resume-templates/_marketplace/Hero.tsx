"use client"

import React from "react"
import { Search, X, FileText, LayoutGrid, ShieldCheck, Users } from "lucide-react"
import { STATS } from "./data"

interface Props {
  query: string
  onQueryChange: (q: string) => void
  resultCount: number
}

export function Hero({ query, onQueryChange, resultCount }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.04)_1px,transparent_0)] [background-size:22px_22px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          ATS-optimized • Recruiter-approved • Always free to start
        </div>

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {STATS.templates}+ Professional Resume Templates
          <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
            Designed to Help You Land More Interviews
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
          Every template is engineered for ATS systems, crafted to a premium professional standard,
          and built to help you create a polished resume in minutes — not hours.
        </p>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="group relative flex items-center rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="ml-4 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by name, category, tag or keyword…"
              aria-label="Search resume templates"
              className="w-full bg-transparent px-3 py-4 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="mr-2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {query && (
            <p className="mt-2 text-sm text-slate-500" aria-live="polite">
              {resultCount} {resultCount === 1 ? "template" : "templates"} match “{query}”
            </p>
          )}
        </div>

        {/* Stats */}
        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={FileText} value={`${STATS.templates}+`} label="Templates" />
          <StatCard icon={LayoutGrid} value={`${STATS.categories}`} label="Categories" />
          <StatCard icon={ShieldCheck} value="ATS" label="Optimized" />
          <StatCard icon={Users} value={`${Math.round(STATS.resumesCreated / 1000)}k+`} label="Resumes Created" />
        </dl>
      </div>
    </section>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: typeof FileText; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur">
      <Icon className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden />
      <dd className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</dd>
      <dt className="mt-0.5 text-xs font-medium text-slate-500">{label}</dt>
    </div>
  )
}
