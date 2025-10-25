"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { Toast } from "./toast-context"
import { cn } from "@/lib/utils"

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

const variantStyles = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-900 dark:text-emerald-100",
    title: "text-emerald-950 dark:text-emerald-50",
    progress: "bg-emerald-500",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-900 dark:text-red-100",
    title: "text-red-950 dark:text-red-50",
    progress: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-100",
    title: "text-amber-950 dark:text-amber-50",
    progress: "bg-amber-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-900 dark:text-blue-100",
    title: "text-blue-950 dark:text-blue-50",
    progress: "bg-blue-500",
  },
  default: {
    bg: "bg-slate-50 dark:bg-slate-900/30",
    border: "border-slate-200 dark:border-slate-800",
    text: "text-slate-900 dark:text-slate-100",
    title: "text-slate-950 dark:text-slate-50",
    progress: "bg-slate-500",
  },
}

export function ToastItem({ toast, onClose }: ToastItemProps) {
  const [progress, setProgress] = useState(100)
  const styles = variantStyles[toast.variant]

  useEffect(() => {
    if (!toast.showProgress || toast.duration <= 0) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100)
      setProgress(remaining)

      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [toast.duration, toast.showProgress])

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-right-full duration-300 group",
        "w-full max-w-sm rounded-lg border shadow-lg",
        styles.bg,
        styles.border,
        toast.className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex gap-3 p-4">
        {/* Icon */}
        {toast.icon && <div className="flex-shrink-0 flex items-center justify-center">{toast.icon}</div>}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && <h3 className={cn("font-semibold text-sm", styles.title)}>{toast.title}</h3>}
          {toast.description && <p className={cn("text-sm mt-1", styles.text)}>{toast.description}</p>}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick()
                onClose(toast.id)
              }}
              className={cn("mt-2 text-xs font-medium underline hover:no-underline", styles.text)}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {toast.dismissible && (
          <button
            onClick={() => onClose(toast.id)}
            className={cn(
              "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-black/10 dark:hover:bg-white/10 rounded p-1",
            )}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {toast.showProgress && toast.duration > 0 && (
        <div className="h-1 bg-black/5 dark:bg-white/5 overflow-hidden">
          <div className={cn("h-full transition-all", styles.progress)} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}
