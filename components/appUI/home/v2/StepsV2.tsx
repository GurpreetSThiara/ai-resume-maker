"use client"

import React from "react"
import Link from "next/link"
import { FilePlus2, PencilLine, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading, CREATE_URL } from "./shared"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

type Accent = "primary" | "secondary" | "accent"

const STEPS: Array<{ icon: typeof FilePlus2; title: string; desc: string; accent: Accent }> = [
  {
    icon: FilePlus2,
    title: "Pick a template",
    desc: "Choose from 90 ATS-ready designs. Switch anytime — your content carries over.",
    accent: "primary",
  },
  {
    icon: PencilLine,
    title: "Fill it in (or import)",
    desc: "Edit inline with a live preview, or import an existing resume to start 80% done.",
    accent: "secondary",
  },
  {
    icon: Download,
    title: "Download instantly",
    desc: "Export a pixel-perfect PDF or editable DOCX. No sign-up, no watermark.",
    accent: "accent",
  },
]

const ACCENT_STYLES: Record<Accent, { badge: string; dashed: string }> = {
  primary: { badge: "bg-primary text-primary-foreground", dashed: "text-primary/30" },
  secondary: { badge: "bg-secondary text-secondary-foreground", dashed: "text-secondary/40" },
  accent: { badge: "bg-accent text-accent-foreground", dashed: "text-accent/35" },
}

export function StepsV2() {
  const { ref: headingRef, inView: headingInView } = useInView<HTMLDivElement>(0.4)
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>(0.15)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-card via-card/40 to-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      {/* Organic decorative shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 animate-[float_9s_ease-in-out_infinite] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-primary/10 blur-2xl" />
        <div
          className="absolute -bottom-28 -right-16 h-80 w-80 animate-[float_11s_ease-in-out_infinite] rounded-[40%_60%_70%_30%/50%_60%_30%_50%] bg-secondary/15 blur-2xl"
          style={{ animationDelay: "1.5s" }}
        />
        {/* Dotted pattern, top-right */}
        <div
          className="absolute right-6 top-6 h-28 w-28 opacity-[0.35] sm:right-10 sm:top-10"
          style={{ backgroundImage: "radial-gradient(circle, var(--primary) 1.5px, transparent 0)", backgroundSize: "14px 14px" }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <div
          ref={headingRef}
          className={cn(
            "transition-all duration-700 ease-out",
            headingInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <SectionHeading
            eyebrow="How it works"
            title="From blank page to hired in 3 steps"
            subtitle="No accounts. No friction. Just a great resume, fast."
          />
        </div>

        <div ref={gridRef} className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* connector line — draws in left to right once in view */}
          <div
            aria-hidden
            className={cn(
              "absolute left-0 right-0 top-9 hidden h-px origin-left bg-gradient-to-r from-transparent via-primary/25 to-transparent transition-transform duration-1000 ease-out md:block",
              gridInView ? "scale-x-100" : "scale-x-0",
            )}
          />
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const accent = ACCENT_STYLES[s.accent]
            return (
              <div
                key={s.title}
                className={cn(
                  "group relative flex flex-col items-center rounded-2xl border border-border bg-white p-7 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl",
                  gridInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                )}
                style={{ transitionDelay: gridInView ? `${i * 150}ms` : "0ms" }}
              >
                <div className="relative mb-5">
                  <svg
                    aria-hidden
                    className={cn("absolute -inset-3 -z-10", accent.dashed)}
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
                  </svg>
                  <span
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white shadow-lg shadow-primary/25 transition-all duration-500 ease-out group-hover:rotate-6 group-hover:scale-110",
                      gridInView ? "scale-100 opacity-100" : "scale-50 opacity-0",
                    )}
                    style={{ transitionDelay: gridInView ? `${i * 150 + 200}ms` : "0ms" }}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <span
                    className={cn(
                      "absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold shadow-md ring-2 ring-white",
                      accent.badge,
                    )}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="relative inline-block">
            <Button
              asChild
              size="lg"
              className="group rounded-xl px-7 shadow-lg shadow-primary/20 transition-shadow duration-300 hover:shadow-primary/40"
            >
              <Link href={CREATE_URL}>
                Start building — it&apos;s free{" "}
                <ArrowRight className="ml-1.5 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <svg
              aria-hidden
              className="pointer-events-none absolute -bottom-3 left-1/2 h-3 w-24 -translate-x-1/2 text-primary/30"
              viewBox="0 0 200 12"
              fill="none"
            >
              <path d="M2 6C40 -2 80 12 120 4C150 -2 180 10 198 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
