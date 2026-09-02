import { NextResponse, type NextRequest } from 'next/server'
import { CONSENT_REGION_COOKIE, consentRegionForCountry } from '@/lib/consent-region'

/**
 * Stamps a cookie describing whether the visitor's region requires opt-in
 * consent before analytics may load.
 *
 * Done here rather than by reading headers() in the root layout on purpose:
 * reading request headers during render would opt every page out of static
 * generation. This runs ahead of the cache, so pages stay static and the
 * client still gets a per-visitor answer.
 *
 * Named `proxy` because Next 16 renamed the `middleware` file convention —
 * the entry template resolves `mod.proxy || mod.default` for a proxy file.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Vercel sets x-vercel-ip-country; cf-ipcountry covers a Cloudflare front.
  // Neither exists on localhost, which is why local dev falls back below.
  const country =
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry') ??
    (process.env.NODE_ENV !== 'production' ? process.env.DEV_CONSENT_COUNTRY ?? '' : '')

  response.cookies.set(CONSENT_REGION_COOKIE, consentRegionForCountry(country), {
    // Readable by the client so the banner can decide without a round trip.
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // Re-evaluated daily so travel/VPN changes are picked up.
  })

  return response
}

export const config = {
  // Skip static assets and API routes — they never render the banner.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webmanifest|mjs)$).*)'],
}
