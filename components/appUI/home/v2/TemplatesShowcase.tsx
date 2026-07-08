"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getResumeDesign } from "@/lib/resume-designs"
import { Section, SectionHeading, SafeImg, TEMPLATES_URL, CREATE_URL } from "./shared"

const PICKS = ["ats-pure", "tech-teal", "corporate-navy", "timeline-pro", "sidebar-emerald", "boxed-cobalt"]

const SHOWCASE = PICKS.map((id) => {
  const d = getResumeDesign(id)
  return {
    id,
    src: d?.image ?? "",
    name: d?.name ?? id,
    tag: d?.category ?? "",
    ats: d?.atsScore ?? 95,
  }
})

export function TemplatesShowcase() {
  return (
    <Section tint="muted">
      <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
        <SectionHeading
          align="left"
          eyebrow="80+ Templates"
          title="A template for every story"
          subtitle="Recruiter-tested, ATS-friendly designs across 20 categories — recolor and restyle any of them in one click."
        />
        <Button asChild variant="outline" className="shrink-0 rounded-xl">
          <Link href={TEMPLATES_URL}>See all templates <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {SHOWCASE.map((t) => (
          <Link
            key={t.name}
            href={`${CREATE_URL}/create?template=${t.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
              <SafeImg src={t.src} alt={`${t.name} resume template`} sizes="(max-width:640px) 45vw, 16vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-success shadow-sm backdrop-blur">
                <ShieldCheck className="h-3 w-3" /> {t.ats}
              </span>
              <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-primary/90 py-2 text-xs font-semibold text-primary-foreground transition-transform duration-300 group-hover:translate-y-0">
                Use this template
              </span>
            </div>
            <div className="p-2.5">
              <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">{t.tag}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}
