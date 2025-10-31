import type { ToastOptions } from "@/components/toast/toast-context"

let toastDispatcher: ((options: ToastOptions) => string) | null = null

// Register the dispatcher from the provider
export function registerToastDispatcher(dispatcher: (options: ToastOptions) => string) {
  toastDispatcher = dispatcher
}

// Utility functions for easy access
export function SHOW_SUCCESS(options: Omit<ToastOptions, "variant">) {
  if (!toastDispatcher) {
    return ""
  }
  return toastDispatcher({ ...options, variant: "success", position:"top-right" })
}

export function SHOW_ERROR(options: Omit<ToastOptions, "variant">) {
  if (!toastDispatcher) {
    console.warn("[Toast] Toast system not initialized. Make sure ToastProvider is in your layout.")
    return ""
  }
  return toastDispatcher({ ...options, variant: "error" })
}

export function SHOW_WARNING(options: Omit<ToastOptions, "variant">) {
  if (!toastDispatcher) {
    console.warn("[Toast] Toast system not initialized. Make sure ToastProvider is in your layout.")
    return ""
  }
  return toastDispatcher({ ...options, variant: "warning" })
}

export function SHOW_INFO(options: Omit<ToastOptions, "variant">) {
  if (!toastDispatcher) {
    console.warn("[Toast] Toast system not initialized. Make sure ToastProvider is in your layout.")
    return ""
  }
  return toastDispatcher({ ...options, variant: "info" })
}

export function SHOW_DEFAULT(options: Omit<ToastOptions, "variant">) {
  if (!toastDispatcher) {
    console.warn("[Toast] Toast system not initialized. Make sure ToastProvider is in your layout.")
    return ""
  }
  return toastDispatcher({ ...options, variant: "default" })
}

export function SHOW_TOAST(options: ToastOptions) {
  if (!toastDispatcher) {
    console.warn("[Toast] Toast system not initialized. Make sure ToastProvider is in your layout.")
    return ""
  }
  return toastDispatcher(options)
}
