"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        /** On a light surface. */
        ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
        /** On a dark floating surface, e.g. the editor's contextual toolbar. */
        toolbar: "text-white/90 hover:bg-white/15",
        /** Bordered toggle, as used for the formatting controls. */
        outline: "border border-gray-200 text-gray-500 hover:bg-gray-50",
        /** Destructive action. */
        danger: "text-gray-400 hover:bg-red-50 hover:text-red-600",
      },
      size: {
        sm: "h-7 w-7 [&_svg]:size-3.5",
        md: "h-8 w-8 [&_svg]:size-4",
      },
      /** Pressed state for toggles — also sets aria-pressed. */
      active: { true: "", false: "" },
    },
    compoundVariants: [
      { variant: "toolbar", active: true, class: "bg-white/20 text-white" },
      { variant: "outline", active: true, class: "border-primary bg-primary/10 text-primary" },
      { variant: "ghost", active: true, class: "bg-gray-100 text-gray-900" },
    ],
    defaultVariants: { variant: "ghost", size: "md", active: false },
  },
)

export interface IconButtonProps
  extends Omit<React.ComponentProps<"button">, "aria-label" | "title" | "children">,
    VariantProps<typeof iconButtonVariants> {
  /**
   * Accessible name. Required — an icon-only control has no text for a screen
   * reader to fall back on, and `title` alone is not a reliable substitute.
   * Used for both `aria-label` and the hover tooltip.
   */
  label: string
  /** The icon. */
  children: React.ReactNode
}

/**
 * Icon-only button.
 *
 * Exists so icon controls are not hand-rolled as raw `<button>` per feature —
 * the visual editor had 20-odd of them, six with no accessible name at all.
 * Making `label` a required prop means that cannot regress silently.
 */
export function IconButton({
  className,
  variant,
  size,
  active,
  label,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active === true ? true : active === false ? false : undefined}
      className={cn(iconButtonVariants({ variant, size, active }), className)}
      {...props}
    >
      {children}
    </button>
  )
}

export { iconButtonVariants }
