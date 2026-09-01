export const CONSENT_STORAGE_KEY = "cookie-consent"
export const CONSENT_CHANGED_EVENT = "cookie-consent-changed"

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
 * Clears the stored choice so the banner reappears — used by the footer's
 * "Cookie settings" control. Withdrawing consent has to be as easy as giving it.
 */
export function clearStoredConsent(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    // Ignore — the event below still resets the in-memory state.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: null }))
}
