"use client"

import { registerToastDispatcher } from "@/utils/toast"
import type { ReactNode } from "react"
import { createContext, useContext, useCallback, useState, useEffect, useRef } from "react"

export type ToastVariant = "success" | "error" | "warning" | "info" | "default"
export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

export interface ToastOptions {
  id?: string
  title?: string
  description?: string
  variant?: ToastVariant
  position?: ToastPosition
  duration?: number
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
  icon?: ReactNode
  showProgress?: boolean
  className?: string
}

/**
 * A queued toast. Required<> would make `action`, `onClose` and `icon`
 * mandatory, but addToast passes them straight through and they are genuinely
 * optional — so only the fields that always get a default are required here.
 */
export interface Toast extends Required<Omit<ToastOptions, "action" | "onClose" | "icon">> {
  id: string
  action?: ToastOptions["action"]
  onClose?: ToastOptions["onClose"]
  icon?: ToastOptions["icon"]
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (options: ToastOptions) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Mirrors `toasts` so removeToast can look one up without depending on the
  // state (which would make it a new function on every toast, breaking the
  // setTimeout captured in addToast).
  const toastsRef = useRef<Toast[]>([])
  useEffect(() => {
    toastsRef.current = toasts
  }, [toasts])

  const removeToast = useCallback((id: string) => {
    // onClose fires here rather than inside the setToasts updater. Updaters
    // must be pure — React is free to run one twice, which fired a consumer's
    // onClose twice with it.
    toastsRef.current.find((t) => t.id === id)?.onClose?.()
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((options: ToastOptions): string => {
    const id = options.id || `toast-${Date.now()}-${Math.random()}`

    const toast: Toast = {
      id,
      title: options.title || "",
      description: options.description || "",
      variant: options.variant || "default",
      position: options.position || "bottom-right",
      duration: options.duration ?? 5000,
      dismissible: options.dismissible ?? true,
      action: options.action,
      onClose: options.onClose,
      icon: options.icon,
      showProgress: options.showProgress ?? true,
      className: options.className || "",
    }

    setToasts((prev) => [...prev, toast])

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  useEffect(() => {
    registerToastDispatcher(addToast)
  }, [addToast])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
