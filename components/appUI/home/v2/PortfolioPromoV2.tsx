"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, Eyebrow, SafeImg, CREATE_URL, templateImage } from "./shared"

const POINTS = ["5 ready-made designs", "Your own shareable link", "Built from your resume data", "Free to publish"]

export function PortfolioPromoV2() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <Eyebrow>Bonus</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            One profile. A resume <span className="text-primary">and</span> a portfolio.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Publish a polished personal site from the exact same content — no extra work. Pick a design, get a link, share it
            anywhere.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-3.5 w-3.5" /></span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-xl px-7 shadow-lg shadow-primary/20">
              <Link href={CREATE_URL}><Globe className="mr-2 h-5 w-5" /> Create your portfolio <ArrowRight className="ml-1.5 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>

        {/* Visual — stacked browser mockup */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/15 via-teal-200/30 to-amber-100/40 blur-2xl" />
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center gap-1.5 border-b border-border bg-slate-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200">createfreecv.com/p/your-name</span>
            </div>
            <div className="relative aspect-[16/11] w-full bg-slate-100">
              <SafeImg src={templateImage("sidebar-emerald")} alt="Portfolio preview" sizes="(max-width:1024px) 90vw, 520px" className="object-cover object-top" />
            </div>
          </div>
          <div className="absolute -bottom-5 -left-4 hidden w-40 rotate-[-6deg] overflow-hidden rounded-xl border border-border bg-white shadow-xl sm:block">
            <div className="relative aspect-[3/4] w-full bg-slate-100">
              <SafeImg src={templateImage("accent-stripe-indigo")} alt="Portfolio design variant" sizes="160px" className="object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
