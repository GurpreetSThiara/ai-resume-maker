import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

/**
 * Anon Supabase client for routes that authenticate by bearer token.
 *
 * This used to pass a `cookies` adapter as a client option, which
 * `@supabase/supabase-js` does not accept — it was silently ignored, so the
 * client never read a session from cookies despite appearing to. Its only
 * consumer (app/api/openrouter) passes the token to `getUser(token)`
 * explicitly, so the adapter was dead code that only made the client look
 * cookie-aware.
 *
 * For cookie-based session auth in a route handler, use requireUser() from
 * lib/api/auth.ts instead.
 */
export function createServerAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Nothing to persist: every call carries its own bearer token.
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
