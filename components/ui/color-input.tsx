"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange" | "aria-label"> {
  /** Current colour, with or without a leading `#`. */
  value: string
  onValueChange: (hex: string) => void
  /** Accessible name — a swatch has no visible text. */
  label: string
}

/** Normalises the bare-hex form used in the design specs to what `<input type="color">` needs. */
function toHex(value: string): string {
  if (!value) return "#000000"
  return value.startsWith("#") ? value : `#${value}`
}

/**
 * Colour swatch picker. The raw `<input type="color">` lives here rather than
 * being repeated across the editor panels, which also gives every swatch an
 * accessible name.
 */
export function ColorInput({ value, onValueChange, label, className, ...props }: ColorInputProps) {
  return (
    <input
      type="color"
      aria-label={label}
      title={label}
      value={toHex(value)}
      onChange={(event) => onValueChange(event.target.value)}
      className={cn(
        "h-8 w-10 cursor-pointer rounded border bg-transparent p-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    />
  )
}
