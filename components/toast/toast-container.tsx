"use client"

import { cn } from "@/lib/utils"
import { ToastPosition, useToast } from "./toast-context"
import { ToastItem } from "./toast-item"

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
}

const flexDirections: Record<ToastPosition, string> = {
  "top-left": "flex-col",
  "top-center": "flex-col",
  "top-right": "flex-col",
  "bottom-left": "flex-col-reverse",
  "bottom-center": "flex-col-reverse",
  "bottom-right": "flex-col-reverse",
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  // Group toasts by position
  const toastsByPosition = toasts.reduce(
    (acc, toast) => {
      if (!acc[toast.position]) {
        acc[toast.position] = []
      }
      acc[toast.position].push(toast)
      return acc
    },
    {} as Record<ToastPosition, typeof toasts>,
  )

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={cn(
            "fixed pointer-events-none z-50",
            "flex gap-3",
            flexDirections[position as ToastPosition],
            positionClasses[position as ToastPosition],
          )}
        >
          {positionToasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
