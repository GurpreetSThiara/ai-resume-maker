"use client"

import React from "react"

const STATS = [
  { value: "80+", label: "Templates" },
  { value: "20", label: "Categories" },
  { value: "99", label: "Top ATS score" },
  { value: "120k+", label: "Resumes created" },
]

export function StatsBand() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-700 to-emerald-900 px-6 py-12 shadow-xl sm:px-12">
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{s.value}</div>
              <div className="mt-1 text-sm font-medium uppercase tracking-wider text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
