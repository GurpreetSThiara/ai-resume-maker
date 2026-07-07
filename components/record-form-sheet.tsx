"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface RecordFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Form fields — rendered in a scrollable body. */
  children: React.ReactNode
  /** Action buttons (Save / Cancel) — pinned to the bottom of the sheet. */
  footer?: React.ReactNode
}

/**
 * Mobile bottom-sheet used to add or edit a record (a job, degree, project…).
 * Callers guard usage with `useIsMobile()` so desktop keeps its inline form.
 * The `app-mobile-form` class opts the fields into the native mobile styling
 * defined in globals.css (soft filled inputs, tap-friendly sizing).
 */
export function RecordFormSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: RecordFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="app-mobile-form flex max-h-[94vh] flex-col gap-0 rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-gray-100 px-5 py-4 text-left">
          <SheetTitle className="text-lg">{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer ? (
          <div
            className="border-t border-gray-100 bg-white px-5 pt-3"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
