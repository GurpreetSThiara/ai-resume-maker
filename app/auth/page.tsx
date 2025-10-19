"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"

import { CREATE_RESUME } from "@/config/urls"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push(CREATE_RESUME)
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <AuthForm onSuccess={() => router.push(CREATE_RESUME)} />
    </div>
  )
}
