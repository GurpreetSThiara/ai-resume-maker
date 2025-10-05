"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { ensureUserProfile } from "@/lib/profile"

let cachedUser: User | null = null // Cache user across re-renders

export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser)
  const [loading, setLoading] = useState(!cachedUser)

  useEffect(() => {
    let mounted = true

    // Only fetch if we don't already have a cached user
    if (!cachedUser) {
      console.log("fetching user")
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (mounted) {
          cachedUser = session?.user ?? null
          setUser(cachedUser)
          setLoading(false)
        }
      })
    } else {
      console.log("returned cached user")
      setLoading(false)
    }

    // Listen for auth changes once
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      cachedUser = session?.user ?? null
      if (mounted) {
        setUser(cachedUser)
        setLoading(false)
      }
      if (session?.user) {
        ensureUserProfile()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    cachedUser = null // clear cached user on sign out
    setUser(null)
  }

  return { user, loading, signOut }
}
