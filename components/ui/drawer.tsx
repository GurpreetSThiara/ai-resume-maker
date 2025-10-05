"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

type DrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  direction?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
}

function Drawer({ open, onOpenChange, direction = "bottom", children }: DrawerProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("keydown", handleEsc)
    }
  }, [onOpenChange])

  if (!mounted) return null

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange(false)}
        data-slot="drawer-overlay"
      />

      {/* Drawer Content */}
      <div
        data-slot="drawer-content"
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-lg transition-transform duration-300",
          direction === "bottom" &&
            "inset-x-0 bottom-0 max-h-[80vh] rounded-t-lg border-t " +
              (open ? "translate-y-0" : "translate-y-full"),
          direction === "top" &&
            "inset-x-0 top-0 max-h-[80vh] rounded-b-lg border-b " +
              (open ? "translate-y-0" : "-translate-y-full"),
          direction === "right" &&
            "inset-y-0 right-0 w-3/4 sm:max-w-sm rounded-l-lg border-l " +
              (open ? "translate-x-0" : "translate-x-full"),
          direction === "left" &&
            "inset-y-0 left-0 w-3/4 sm:max-w-sm rounded-r-lg border-r " +
              (open ? "translate-x-0" : "-translate-x-full")
        )}
      >
        {children}
      </div>
    </>,
    document.body
  )
}

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-slot="drawer-trigger"
      {...props}
    >
      {children}
    </button>
  )
);

DrawerTrigger.displayName = 'DrawerTrigger'

function DrawerClose({
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="drawer-close"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4 text-center md:text-left", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
