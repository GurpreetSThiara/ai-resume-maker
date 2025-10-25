"use client"

import { registerToastDispatcher } from "@/utils/toast"
import type { ReactNode } from "react"
import { createContext, useContext, useCallback, useState, useEffect } from "react"

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

export interface Toast extends Required<ToastOptions> {
  id: string
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

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id)
      if (toast?.onClose) {
        toast.onClose()
      }
      return prev.filter((t) => t.id !== id)
    })
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
