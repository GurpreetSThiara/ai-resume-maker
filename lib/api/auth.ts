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

  // The cast is deliberate. auth-helpers-nextjs types `cookies` as
  // `() => Promise<ReadonlyRequestCookies>`, but its runtime calls the result
  // synchronously — passing the promise-returning form that satisfies the type
  // throws `nextCookies.get is not a function`. Verified both ways against a
  // running server: only the resolved-store form works. The package is
  // deprecated in favour of @supabase/ssr, which is the real fix.
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
  } as never)

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
