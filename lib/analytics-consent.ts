import { hasGlobalPrivacySignal, readConsentRegion } from "@/lib/consent-region"

export const CONSENT_STORAGE_KEY = "cookie-consent"
export const CONSENT_CHANGED_EVENT = "cookie-consent-changed"
/** Fired by the footer control to open the banner on demand. */
export const CONSENT_OPEN_EVENT = "cookie-consent-open"

export type ConsentValue = "accepted" | "declined"

/**
 * How long a stored choice stands before we ask again.
 *
 * A refusal is remembered for the same period as an acceptance: re-prompting a
 * user who already declined on every visit is treated by EU regulators as
 * pressure that undermines "freely given" consent, so the banner stays away
 * until the choice has aged out.
 */
const CONSENT_TTL_DAYS = 180
const CONSENT_TTL_MS = CONSENT_TTL_DAYS * 24 * 60 * 60 * 1000

interface StoredConsent {
  value: ConsentValue
  /** Epoch milliseconds the choice was made. */
  at: number
}

function parse(raw: string | null): StoredConsent | null {
  if (!raw) return null

  // Legacy format: a bare string, written before choices carried a timestamp.
  // Treated as "no choice" so it self-heals — stamping it on read instead would
  // reset the age on every load and the choice could never expire. Failing to
  // "unset" rather than "accepted" also means we never assume consent.
  if (raw === "accepted" || raw === "declined") return null

  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>
    if ((parsed?.value === "accepted" || parsed?.value === "declined") && typeof parsed.at === "number") {
      return { value: parsed.value, at: parsed.at }
    }
  } catch {
    // Corrupt or hand-edited value — treat as no choice and ask again.
  }
  return null
}

/** The active choice, or null when none was made or it has expired. */
export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null

  let stored: StoredConsent | null = null
  try {
    stored = parse(window.localStorage.getItem(CONSENT_STORAGE_KEY))
  } catch {
    // Storage can throw in private mode or when site data is blocked.
    return null
  }
  if (!stored) return null

  if (Date.now() - stored.at > CONSENT_TTL_MS) return null
  return stored.value
}

export function setStoredConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return
  try {
    const payload: StoredConsent = { value, at: Date.now() }
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Non-fatal: the banner still closes for this session, we just can't persist.
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_CHANGED_EVENT, { detail: value }))
}

/**
 * Whether analytics (GTM, GA, PostHog) may load right now.
 *
 * One decision function so the banner, the script tags and the PostHog
 * bootstrap can never disagree:
 *
 *   - A browser privacy signal (GPC / DNT) blocks analytics everywhere. GPC is
 *     legally binding in several US states, so it is not treated as advisory.
 *   - Opt-in regions (EU/EEA/UK/CH) require a stored "accepted".
 *   - Everywhere else analytics run unless the visitor stored "declined".
 */
export function shouldLoadAnalytics(): boolean {
  if (typeof window === "undefined") return false
  if (hasGlobalPrivacySignal()) return false

  const stored = getStoredConsent()
  if (readConsentRegion() === "opt-in") return stored === "accepted"
  return stored !== "declined"
}

/**
 * Whether the banner should be shown unprompted — only in opt-in regions, and
 * only while no choice is on record. Elsewhere the footer's "Cookie Settings"
 * control opens it on demand instead. A browser privacy signal already settles
 * the question, so there is nothing to ask.
 */
export function shouldPromptForConsent(): boolean {
  if (typeof window === "undefined") return false
  if (hasGlobalPrivacySignal()) return false
  return readConsentRegion() === "opt-in" && getStoredConsent() === null
}

/**
 * Opens the banner on demand from the footer's "Cookie Settings" control.
 *
 * Deliberately does not clear the stored choice first: in an opt-out region
 * clearing would briefly re-enable analytics for someone who opened the panel
 * precisely to turn them off. The banner is shown instead and the next Accept
 * or Decline overwrites the stored value.
 *
 * This is also the opt-out path required outside the EU — withdrawing consent
 * has to be as easy as giving it.
 */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))
}
