"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Check, ShieldCheck, FileDown, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SafeImg, CREATE_URL, TEMPLATES_URL, templateImage } from "./shared"

const TRUST = ["No sign-up", "No credit card", "PDF & DOCX", "ATS-ready"]

export function HeroV2() {
  return (
    <section className="relative overflow-hidden px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-28">
      {/* Mesh background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[360px] w-[360px] rounded-full bg-lime-300/30 blur-[110px]" />
        <div className="absolute left-[-8%] bottom-[-10%] h-[380px] w-[380px] rounded-full bg-amber-200/30 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-primary">
              <span className="h-2 w-2 animate-ping rounded-full bg-primary/60" />
            </span>
            100% Free Forever
          </div>

          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Build a resume that{" "}
            <span className="relative whitespace-nowrap text-primary">
              gets hired
              <svg className="absolute -bottom-2 left-0 h-3 w-full text-primary/30" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C60 2 140 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0 sm:text-xl">
            Professional, ATS-optimized resumes in 2 minutes — 80+ templates, live preview, instant PDF &amp; DOCX.
            No sign-up, no paywall, no watermark.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
            <Button asChild size="lg" className="h-13 w-full rounded-xl px-7 text-base font-semibold shadow-lg shadow-primary/20 sm:w-auto">
              <Link href={CREATE_URL}>
                Build my resume — free <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-13 w-full rounded-xl px-7 text-base font-semibold sm:w-auto">
              <Link href={TEMPLATES_URL}>Browse templates</Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <Check className="h-4 w-4 text-primary" /> {t}
              </span>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex -space-x-2">
              {["bg-emerald-500", "bg-teal-500", "bg-lime-500", "bg-amber-500"].map((c, i) => (
                <span key={i} className={`h-8 w-8 rounded-full ${c} ring-2 ring-white`} />
              ))}
            </div>
            <div className="text-left">
              <div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              <p className="text-xs text-muted-foreground">Loved by 120,000+ job seekers</p>
            </div>
          </div>
        </div>

        {/* Right — product visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-lime-200/30 to-transparent blur-2xl" />

          {/* Resume card */}
          <div className="relative mx-auto aspect-[3/4] w-[78%] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl ring-1 ring-black/5 lg:w-[82%]">
            <SafeImg src={templateImage("tech-teal")} alt="Resume template preview" sizes="(max-width:1024px) 80vw, 420px" priority className="object-cover object-top" />
          </div>

          {/* Floating stat cards */}
          <div className="absolute -left-2 top-10 flex items-center gap-2 rounded-xl border border-border bg-white/90 px-3 py-2 shadow-xl backdrop-blur sm:-left-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-bold leading-none text-foreground">98<span className="text-muted-foreground">/100</span></p>
              <p className="text-[11px] text-muted-foreground">ATS score</p>
            </div>
          </div>

          <div className="absolute -right-1 bottom-12 flex items-center gap-2 rounded-xl border border-border bg-white/90 px-3 py-2 shadow-xl backdrop-blur sm:-right-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileDown className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-bold leading-none text-foreground">PDF &amp; DOCX</p>
              <p className="text-[11px] text-muted-foreground">Instant download</p>
            </div>
          </div>

          <div className="absolute right-6 top-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
            <Sparkles className="h-3.5 w-3.5" /> Live preview
          </div>
        </div>
      </div>
    </section>
  )
}
