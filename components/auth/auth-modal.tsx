"use client"

import React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AuthForm } from "@/components/auth/auth-form"
import { CREATE_RESUME } from "@/config/urls"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const router = useRouter()

  const handleAuthSuccess = () => {
    onOpenChange(false)
    router.push(CREATE_RESUME)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full border-0 bg-white p-0 shadow-none">
        <div className="relative mx-auto w-full rounded-2xl bg-white/90 backdrop-blur-lg shadow-2xl border border-slate-200/60">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-purple-100/70 via-blue-50/60 to-cyan-100/70" />
          <div className="relative p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-600">Create your professional resume with our easy-to-use builder</p>
            </div>
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
