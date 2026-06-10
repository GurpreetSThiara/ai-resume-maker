"use client"

import React from "react"
import Link from "next/link"
import { FilePlus2, PencilLine, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeading, CREATE_URL } from "./shared"

const STEPS = [
  { icon: FilePlus2, title: "Pick a template", desc: "Choose from 80+ ATS-ready designs. Switch anytime — your content carries over." },
  { icon: PencilLine, title: "Fill it in (or import)", desc: "Edit inline with a live preview, or import an existing resume to start 80% done." },
  { icon: Download, title: "Download instantly", desc: "Export a pixel-perfect PDF or editable DOCX. No sign-up, no watermark." },
]

export function StepsV2() {
  return (
    <Section>
      <SectionHeading eyebrow="How it works" title="From blank page to hired in 3 steps" subtitle="No accounts. No friction. Just a great resume, fast." />

      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        {/* connector line */}
        <div aria-hidden className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent md:block" />
        {STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={s.title} className="relative flex flex-col items-center rounded-2xl border border-border bg-white p-7 text-center shadow-sm">
              <div className="relative mb-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white shadow-lg shadow-primary/25">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white ring-2 ring-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="rounded-xl px-7 shadow-lg shadow-primary/20">
          <Link href={CREATE_URL}>Start building — it&apos;s free <ArrowRight className="ml-1.5 h-5 w-5" /></Link>
        </Button>
      </div>
    </Section>
  )
}
