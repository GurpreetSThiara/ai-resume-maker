export const CONSENT_REGION_COOKIE = "consent-region"

/**
 * "opt-in"  — analytics may only load after an explicit Accept (GDPR/UK GDPR/FADP).
 * "opt-out" — analytics load by default; the visitor can turn them off.
 */
export type ConsentRegion = "opt-in" | "opt-out"

/** EU 27 + EEA (Iceland, Liechtenstein, Norway) + UK + Switzerland. */
const OPT_IN_COUNTRIES = new Set([
  // EU 27
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA (non-EU)
  "IS", "LI", "NO",
  // UK + Switzerland
  "GB", "CH",
])

/**
 * Maps an ISO country code to a consent regime.
 *
 * An unknown or missing code resolves to "opt-in". That is the fail-safe
 * direction: it means local development and any host that does not provide a
 * geo header show the banner and withhold analytics, rather than silently
 * tracking someone who may be covered by GDPR.
 */
export function consentRegionForCountry(country: string | null | undefined): ConsentRegion {
  if (!country) return "opt-in"
  return OPT_IN_COUNTRIES.has(country.toUpperCase()) ? "opt-in" : "opt-out"
}

/** Reads the region cookie stamped by middleware. Fails safe to "opt-in". */
export function readConsentRegion(): ConsentRegion {
  if (typeof document === "undefined") return "opt-in"
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_REGION_COOKIE}=([^;]*)`))
  return match?.[1] === "opt-out" ? "opt-out" : "opt-in"
}

/**
 * True when the browser is broadcasting an opt-out preference.
 *
 * Global Privacy Control is legally binding in several US states (California,
 * Colorado, Connecticut among them), so it is honoured everywhere rather than
 * only in opt-out regions. Do Not Track is not binding but is treated as the
 * same intent.
 */
export function hasGlobalPrivacySignal(): boolean {
  if (typeof navigator === "undefined") return false
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1"
}
