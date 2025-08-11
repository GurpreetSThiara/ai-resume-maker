import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./types"

export function createServerComponentClient() {
  const cookieStore = cookies()

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // Ensure auth cookies persist for 30 days by default
        const THIRTY_DAYS = 60 * 60 * 24 * 30
        cookieStore.set({
          name,
          value,
          path: "/",
          sameSite: "lax",
          maxAge: THIRTY_DAYS,
          ...options,
        })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
