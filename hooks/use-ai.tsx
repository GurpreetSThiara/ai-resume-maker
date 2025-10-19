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
  const [aiEnabled, setAiEnabled] = useState<boolean>(false)
  const [usage, setUsage] = useState<AiUsage | null>(null)

  const effectiveAiEnabled = useMemo(() => {
    return false
  }, [user, aiEnabled])

  const refreshUsage = async () => {
    setUsage(null)
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
