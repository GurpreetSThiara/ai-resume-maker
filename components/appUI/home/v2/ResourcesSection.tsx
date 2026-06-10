"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, ShieldCheck, Code2, GraduationCap, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeading, BLOG_URL, COVER_LETTER_URL } from "./shared"

const POSTS = [
  { href: "/blog/ats-resume-guide", icon: ShieldCheck, tag: "ATS", title: "The complete ATS resume guide", desc: "How applicant tracking systems read resumes — and how to pass every time." },
  { href: "/blog/software-engineer-resume", icon: Code2, tag: "Engineering", title: "Software engineer resume guide", desc: "Structure, skills and bullet points that land dev interviews." },
  { href: "/blog/resume-for-freshers", icon: GraduationCap, tag: "Students", title: "Resume for freshers", desc: "No experience? Here's how to build a strong first resume." },
]

export function ResourcesSection() {
  return (
    <Section>
      <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
        <SectionHeading
          align="left"
          eyebrow="Guides & Resources"
          title="Free advice to land the interview"
          subtitle="Expert guides on resumes, ATS, and writing — plus a built-in cover letter writer."
        />
        <Button asChild variant="outline" className="shrink-0 rounded-xl">
          <Link href={BLOG_URL}>
            <BookOpen className="mr-2 h-4 w-4" /> Visit the blog
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {POSTS.map((p) => {
          const Icon = p.icon
          return (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary/70">{p.tag}</span>
              <h3 className="mt-1 text-lg font-bold leading-snug text-foreground">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </div>

      {/* Cover letter banner */}
      <div className="mt-6 flex flex-col items-center justify-between gap-5 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-card to-white p-6 sm:flex-row sm:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <PenLine className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-foreground">Need a cover letter too?</h3>
            <p className="text-sm text-muted-foreground">Generate a polished, matching cover letter in minutes — also free.</p>
          </div>
        </div>
        <Button asChild className="shrink-0 rounded-xl px-6">
          <Link href={COVER_LETTER_URL}>Write a cover letter <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
      </div>
    </Section>
  )
}
