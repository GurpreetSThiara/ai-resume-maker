"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { getResumeDesign } from "@/lib/resume-designs"

export const CREATE_URL = "/free-ats-resume-templates"
export const TEMPLATES_URL = "/free-ats-resume-templates"
export const COVER_LETTER_URL = "/cover-letter"
export const BLOG_URL = "/blog"

/** Real, uploaded preview image for a config-driven design (templates/images/NN-id.png). */
export function templateImage(id: string): string {
  return getResumeDesign(id)?.image ?? ""
}

/** Small uppercase label above a section title. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  )
}

/** Centered section heading with eyebrow + title + optional subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-pretty text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

/** Section wrapper with consistent rhythm + optional tinted background. */
export function Section({
  children,
  className,
  tint,
  id,
}: {
  children: React.ReactNode
  className?: string
  tint?: "muted" | "none"
  id?: string
}) {
  return (
    <section id={id} className={cn("px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28", tint === "muted" && "bg-card/40", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** next/image with a graceful gradient fallback when the asset is missing. */
export function SafeImg({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const [failed, setFailed] = useState(!src)
  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-500/70">
        <ImageOff className="h-7 w-7" aria-hidden />
        <span className="text-[11px] font-medium">Preview</span>
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
