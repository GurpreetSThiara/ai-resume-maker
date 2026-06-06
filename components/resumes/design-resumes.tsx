"use client"

import type React from "react"
import { ConfigurableResume } from "./shared/ConfigurableResume"
import { RESUME_DESIGNS, type ResumeDesign } from "@/lib/resume-designs"

type PreviewProps = Omit<React.ComponentProps<typeof ConfigurableResume>, "design">

/** Build a baked-in preview component for a given design. */
const makeDesignResume = (design: ResumeDesign): React.FC<PreviewProps> => {
  const Comp: React.FC<PreviewProps> = (props) => <ConfigurableResume {...props} design={design} />
  Comp.displayName = `DesignResume(${design.id})`
  return Comp
}

export const DESIGN_RESUME_COMPONENTS: Record<string, React.FC<PreviewProps>> = RESUME_DESIGNS.reduce(
  (acc, design) => {
    acc[design.id] = makeDesignResume(design)
    return acc
  },
  {} as Record<string, React.FC<PreviewProps>>,
)
