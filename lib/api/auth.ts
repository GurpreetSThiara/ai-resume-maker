import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { MESSAGES } from '@/constants/messages'

type AuthorizedCaller = { supabase: SupabaseClient; user: User; response?: never }
type RejectedCaller = { supabase?: never; user?: never; response: NextResponse }

export type RequireUserResult = AuthorizedCaller | RejectedCaller

/**
 * Resolve the caller for a route handler, or the 401 to return instead.
 *
 * Two things every caller needs to get right, in one place:
 *
 *  - `cookies()` returns a Promise in Next 16, so it has to be awaited before
 *    being handed to auth-helpers. Passing it un-awaited throws
 *    `this.context.cookies is not a function` *before* the auth check runs,
 *    which is how the cover-letter routes ended up answering 500 to
 *    unauthenticated requests instead of 401.
 *  - `getUser()` revalidates the token against the auth server; `getSession()`
 *    only reads the cookie, and Supabase documents it as untrustworthy on the
 *    server.
 *
 * Usage:
 *   const { supabase, user, response } = await requireUser()
 *   if (response) return response
 */
export async function requireUser(): Promise<RequireUserResult> {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      response: NextResponse.json({ error: MESSAGES.AUTH_UNAUTHORIZED }, { status: 401 }),
    }
  }

  return { supabase, user }
}
