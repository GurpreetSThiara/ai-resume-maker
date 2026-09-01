import React from "react"
import { FileText, LayoutGrid, Trophy, Users } from "lucide-react"
import { STATS as TEMPLATE_STATS } from "@/app/free-ats-resume-templates/_marketplace/data"

/**
 * Server component (no interactivity) so the template/category counts come
 * straight from the catalog and never drift from what the gallery shows.
 * This is the only place on the site that states a resumes-downloaded figure.
 */
const STATS = [
  { icon: FileText, value: String(TEMPLATE_STATS.templates), label: "Templates" },
  { icon: LayoutGrid, value: String(TEMPLATE_STATS.categories), label: "Categories" },
  { icon: Trophy, value: "99", label: "Top ATS Score" },
  { icon: Users, value: "12k+", label: "Resumes Downloaded" },
]

export function StatsBand() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Mesh background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/15 blur-[110px]" />
        <div className="absolute right-[10%] top-0 h-64 w-64 rounded-full bg-emerald-300/20 blur-[100px]" />
        <div className="absolute right-[25%] bottom-0 h-56 w-56 rounded-full bg-lime-200/25 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="relative flex items-center gap-4 rounded-2xl bg-white py-4 pl-6 pr-5 shadow-[0_12px_30px_-12px_rgba(21,128,61,0.35)]"
          >
            <span className="absolute left-0 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <s.icon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
