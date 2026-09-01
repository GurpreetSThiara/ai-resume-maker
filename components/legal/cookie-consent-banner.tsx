"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_OPEN_EVENT,
  getStoredConsent,
  setStoredConsent,
  shouldPromptForConsent,
  type ConsentValue,
} from "@/lib/analytics-consent"
import { hasGlobalPrivacySignal, readConsentRegion } from "@/lib/consent-region"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  // Opt-in regions get "we need your consent" framing; elsewhere the same panel
  // is an opt-out control, so the copy and default emphasis differ.
  const [optInRegion, setOptInRegion] = useState(true)
  const [currentChoice, setCurrentChoice] = useState<ConsentValue | null>(null)

  const sync = useCallback(() => {
    setOptInRegion(readConsentRegion() === "opt-in")
    setCurrentChoice(getStoredConsent())
  }, [])

  useEffect(() => {
    sync()
    setVisible(shouldPromptForConsent())

    const handleOpen = () => {
      sync()
      setVisible(true)
    }
    const handleChange = () => sync()

    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen)
    window.addEventListener(CONSENT_CHANGED_EVENT, handleChange)
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen)
      window.removeEventListener(CONSENT_CHANGED_EVENT, handleChange)
    }
  }, [sync])

  if (!visible) return null

  const handleChoice = (value: ConsentValue) => {
    setStoredConsent(value)
    setVisible(false)
  }

  // A browser-level opt-out overrides any button here, so say so rather than
  // offering a choice that would not be honoured.
  const privacySignalActive = hasGlobalPrivacySignal()

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[100] border-t border-border bg-background shadow-lg md:bottom-0"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {privacySignalActive ? (
            <p>
              Your browser is sending a Global Privacy Control signal, so analytics stay off. Read our{" "}
              <Link href="/cookie-policy" className="underline underline-offset-2 hover:text-foreground">
                Cookie Policy
              </Link>
              .
            </p>
          ) : (
            <p>
              {optInRegion
                ? "We'd like to use analytics cookies to understand how CreateFreeCV is used. They're only set if you accept."
                : "We use analytics cookies to understand how CreateFreeCV is used. You can turn them off at any time."}{" "}
              <Link href="/cookie-policy" className="underline underline-offset-2 hover:text-foreground">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>
              .
              {currentChoice ? (
                <span className="ml-1 font-medium text-foreground">
                  Currently: {currentChoice === "accepted" ? "allowed" : "turned off"}.
                </span>
              ) : null}
            </p>
          )}
        </div>

        {privacySignalActive ? (
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => setVisible(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleChoice("declined")}>
              {optInRegion ? "Decline" : "Turn off"}
            </Button>
            <Button size="sm" onClick={() => handleChoice("accepted")}>
              {optInRegion ? "Accept" : "Keep on"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
