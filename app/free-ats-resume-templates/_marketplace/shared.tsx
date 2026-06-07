"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ShieldCheck, ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Thumbnail with a graceful fallback. If the image is missing or fails to
 * load, a clean "Preview not available" placeholder is shown instead of a
 * broken image. Designed to fill an `aspect-[3/4]` (or similar) container.
 */
export function TemplateThumb({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src?: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={`${alt} — preview not available`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400"
      >
        <ImageOff className="h-8 w-8" aria-hidden />
        <span className="px-3 text-center text-[11px] font-medium leading-tight text-slate-500">
          Preview not available
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      priority={priority}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

/** Highlights occurrences of `query` inside `text`. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  try {
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="rounded bg-primary/15 px-0.5 text-primary">
              {part}
            </mark>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          ),
        )}
      </>
    )
  } catch {
    return <>{text}</>
  }
}

export function atsTone(score: number): string {
  if (score >= 98) return "text-emerald-700 bg-emerald-50 border-emerald-200"
  if (score >= 95) return "text-green-700 bg-green-50 border-green-200"
  if (score >= 90) return "text-amber-700 bg-amber-50 border-amber-200"
  return "text-orange-700 bg-orange-50 border-orange-200"
}

export function AtsBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        atsTone(score),
        className,
      )}
      title={`ATS score ${score}/100`}
    >
      <ShieldCheck className="h-3 w-3" aria-hidden />
      {score} ATS
    </span>
  )
}

export function PremiumBadge({ isPremium }: { isPremium: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        isPremium
          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm"
          : "bg-slate-900/85 text-white",
      )}
    >
      {isPremium ? "Premium" : "Free"}
    </span>
  )
}
