"use client"

import { useAuth } from "@/contexts/auth-context"
import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react"

export interface AiUsage {
  monthUsdRemaining: number
  monthUsdLimit: number
  totalUsdUsedThisMonth: number
  requestsThisMonth: number
}

interface AiContextValue {
  aiEnabled: boolean
  setAiEnabled: (v: boolean) => void
  effectiveAiEnabled: boolean
  usage: AiUsage | null
  refreshUsage: () => Promise<void>
}

const AiContext = createContext<AiContextValue | undefined>(undefined)

export function AiProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [aiEnabled, setAiEnabled] = useState<boolean>(true)
  const [usage, setUsage] = useState<AiUsage | null>(null)

  const effectiveAiEnabled = useMemo(() => {
    // AI can only be enabled if user is logged in
    return Boolean(user) && aiEnabled
  }, [user, aiEnabled])

  const refreshUsage = async () => {
    if (!user) {
      setUsage(null)
      return
    }
    try {
      const res = await fetch("/api/ai/usage", { method: "GET" })
      if (!res.ok) throw new Error("Failed to load AI usage")
      const data = await res.json()
      setUsage(data.usage)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    refreshUsage()
  }, [user])

  const value: AiContextValue = {
    aiEnabled,
    setAiEnabled,
    effectiveAiEnabled,
    usage,
    refreshUsage,
  }

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>
}

export function useAi() {
  const ctx = useContext(AiContext)
  if (!ctx) throw new Error("useAi must be used within AiProvider")
  return ctx
}


