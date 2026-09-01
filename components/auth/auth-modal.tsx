"use client"

import React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AuthForm } from "@/components/auth/auth-form"
import { CREATE_RESUME } from "@/config/urls"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
}

export function AuthModal({ open, onOpenChange, redirectTo }: AuthModalProps) {
  const router = useRouter()

  const handleAuthSuccess = () => {
    onOpenChange(false)
    router.push(redirectTo ?? CREATE_RESUME)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          flex h-[100dvh] max-h-[100dvh] w-screen flex-col overflow-y-auto border-0 bg-background p-0
          sm:h-auto sm:max-h-[92vh] sm:w-full sm:max-w-md sm:rounded-2xl sm:border sm:shadow-2xl
        "
      >
        {/* Radix needs a title for screen readers; the visible heading lives in
            AuthForm because it changes with the active tab. */}
        <DialogTitle className="sr-only">Sign in or create an account</DialogTitle>
        <AuthForm onSuccess={handleAuthSuccess} />
      </DialogContent>
    </Dialog>
  )
}
