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

/**
 * Drop-in replacement for sonner's `toast` API.
 *
 * Six files in the dashboard/portfolio flow called `toast.success("...")` from
 * sonner, whose <Toaster /> was never mounted — every one of those
 * notifications was a silent no-op. This adapter lets those call sites keep
 * their shape while dispatching through the toast provider that *is* mounted
 * in app/layout.tsx.
 */
type ToastMessageOptions = Omit<ToastOptions, "variant" | "title">

const withTitle =
  (show: (options: Omit<ToastOptions, "variant">) => string) =>
  (message: string, options?: ToastMessageOptions) =>
    show({ ...options, title: message })

export const toast = {
  success: withTitle(SHOW_SUCCESS),
  error: withTitle(SHOW_ERROR),
  warning: withTitle(SHOW_WARNING),
  info: withTitle(SHOW_INFO),
  message: withTitle(SHOW_DEFAULT),
}
