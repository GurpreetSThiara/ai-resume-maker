"use client"

import React from "react"
import Link from "next/link"
import { ShieldCheck, Lock, FileDown, Palette, Layout, Share2, Sparkles, Check, PenLine, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Section, SectionHeading, COVER_LETTER_URL } from "./shared"

function Tile({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("group relative overflow-hidden rounded-3xl border border-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl", className)}>
      {children}
    </div>
  )
}

function IconBadge({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "amber" | "teal" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    teal: "bg-teal-500/10 text-teal-600",
  }
  return <span className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", tones[tone])}>{children}</span>
}

export function FeatureBento() {
  return (
    <Section tint="muted">
      <SectionHeading
        eyebrow="Why CreateFreeCV"
        title="Everything you need. Nothing you don't."
        subtitle="A focused toolkit built around one goal — getting you more interviews."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {/* Hero tile — ATS */}
        <Tile className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary to-emerald-600 text-white">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white"><ShieldCheck className="h-6 w-6" /></span>
          <h3 className="text-2xl font-bold">Engineered to beat the bots</h3>
          <p className="mt-2 max-w-md text-white/85">
            Every template is structured for clean ATS parsing — real, scored designs from 88 to 99. Pick a high-scorer and
            stop getting filtered out before a human ever sees you.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Semantic structure", "Parser-safe fonts", "Standard sections", "Scored 88–99"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Check className="h-3.5 w-3.5" /> {t}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        </Tile>

        <Tile>
          <IconBadge><Lock className="h-6 w-6" /></IconBadge>
          <h3 className="text-lg font-bold text-foreground">No sign-up, ever</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">Start instantly. No email walls, no credit card. Your data stays in your browser.</p>
        </Tile>

        <Tile>
          <IconBadge tone="teal"><FileDown className="h-6 w-6" /></IconBadge>
          <h3 className="text-lg font-bold text-foreground">PDF &amp; DOCX export</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">Pixel-perfect PDF or a fully editable Word file — unlimited downloads, no watermark.</p>
        </Tile>

        <Tile>
          <IconBadge tone="amber"><Palette className="h-6 w-6" /></IconBadge>
          <h3 className="text-lg font-bold text-foreground">Make it yours</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">Live theme customizer — swap accent colors, fonts and density, with instant preview.</p>
        </Tile>

        <Tile>
          <IconBadge><Layout className="h-6 w-6" /></IconBadge>
          <h3 className="text-lg font-bold text-foreground">One-page fit</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">Tighten spacing to land everything on a single, clean page in one tap.</p>
        </Tile>

        <Link href={COVER_LETTER_URL} className="group relative overflow-hidden rounded-3xl border border-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <IconBadge tone="amber"><PenLine className="h-6 w-6" /></IconBadge>
          <h3 className="text-lg font-bold text-foreground">Matching cover letters</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">Write a cover letter that matches your resume — in the same clean style.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Write one <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Tile className="md:col-span-2 flex flex-col justify-between sm:flex-row sm:items-center">
          <div>
            <IconBadge tone="teal"><Share2 className="h-6 w-6" /></IconBadge>
            <h3 className="text-lg font-bold text-foreground">Turn it into a portfolio</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">Publish a shareable personal site from the same data — 5 designs, your own link.</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary sm:mt-0">
            <Sparkles className="h-3.5 w-3.5" /> New
          </span>
        </Tile>
      </div>
    </Section>
  )
}
