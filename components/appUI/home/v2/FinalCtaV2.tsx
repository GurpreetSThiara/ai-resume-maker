"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CREATE_URL } from "./shared"

const POINTS = ["No sign-up", "No credit card", "Unlimited downloads"]

export function FinalCtaV2() {
  return (
    <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-primary to-emerald-800 px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-lime-300/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "28px 28px" }}
          />
        </div>

        <div className="relative">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your next interview starts with a better resume
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-white/85">
            Join 120,000+ job seekers. Build a professional, ATS-ready resume in minutes — completely free.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 w-full rounded-xl bg-white px-8 text-base font-bold text-primary hover:bg-white/90 sm:w-auto">
              <Link href={CREATE_URL}>Build my resume — free <ArrowRight className="ml-1.5 h-5 w-5" /></Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {POINTS.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85">
                <Check className="h-4 w-4" /> {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
