import type { ResumeStyleOverrides } from "@/types/resume"

export type SelKind = "name" | "summary" | "heading" | "body" | "section" | "page" | null
export interface Selection {
  kind: SelKind
  sid?: string
  /** lineKey of the focused line/field, when one is selected. */
  linekey?: string
}

type Opt<T extends string> = { v: T; label: string }

export const FONT_OPTS: Opt<NonNullable<ResumeStyleOverrides["font"]>>[] = [
  { v: "sans", label: "Sans" },
  { v: "serif", label: "Serif" },
]
export const DENSITY_OPTS: Opt<NonNullable<ResumeStyleOverrides["density"]>>[] = [
  { v: "compact", label: "Compact" },
  { v: "normal", label: "Normal" },
  { v: "relaxed", label: "Relaxed" },
]
export const MARGIN_OPTS: Opt<NonNullable<ResumeStyleOverrides["pageMargin"]>>[] = [
  { v: "compact", label: "Compact" },
  { v: "normal", label: "Normal" },
  { v: "wide", label: "Wide" },
]
export const LAYOUT_OPTS: Opt<NonNullable<ResumeStyleOverrides["layout"]>>[] = [
  { v: "single", label: "Single column" },
  { v: "sidebar-left", label: "Left sidebar" },
  { v: "sidebar-right", label: "Right sidebar" },
]
export const TITLE_OPTS: Opt<NonNullable<ResumeStyleOverrides["sectionTitle"]>>[] = [
  { v: "rule-full", label: "Rule" },
  { v: "underline", label: "Underline" },
  { v: "left-bar", label: "Left bar" },
  { v: "plain", label: "Plain" },
  { v: "boxed", label: "Boxed" },
  { v: "centered", label: "Centered" },
  { v: "pill", label: "Pill" },
]
export const SKILL_OPTS: Opt<NonNullable<ResumeStyleOverrides["skillStyle"]>>[] = [
  { v: "grouped-line", label: "Grouped" },
  { v: "pills", label: "Pills" },
  { v: "bullets", label: "Bullets" },
  { v: "bars", label: "Bars" },
  { v: "dots", label: "Dots" },
]
