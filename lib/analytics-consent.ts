export const CONSENT_STORAGE_KEY = "cookie-consent"
export const CONSENT_CHANGED_EVENT = "cookie-consent-changed"

export type ConsentValue = "accepted" | "declined"

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  return value === "accepted" || value === "declined" ? value : null
}

export function setStoredConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_CHANGED_EVENT, { detail: value }))
}
