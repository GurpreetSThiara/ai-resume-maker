"use client"

import { useToast as useToastContext, type ToastOptions } from "@/components/toast/toast-context"
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"

export function useToastCustom() {
  const { addToast, removeToast, clearAll } = useToastContext()

  return {
    success: (options: Omit<ToastOptions, "variant">) => {
      return addToast({
        ...options,
        variant: "success",
        icon: options.icon || <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      })
    },
    error: (options: Omit<ToastOptions, "variant">) => {
      return addToast({
        ...options,
        variant: "error",
        icon: options.icon || <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      })
    },
    warning: (options: Omit<ToastOptions, "variant">) => {
      return addToast({
        ...options,
        variant: "warning",
        icon: options.icon || <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      })
    },
    info: (options: Omit<ToastOptions, "variant">) => {
      return addToast({
        ...options,
        variant: "info",
        icon: options.icon || <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      })
    },
    custom: (options: ToastOptions) => {
      return addToast(options)
    },
    remove: removeToast,
    clearAll,
  }
}
