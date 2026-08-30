"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getStoredConsent, setStoredConsent, type ConsentValue } from "@/lib/analytics-consent"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getStoredConsent() === null)
  }, [])

  if (!visible) return null

  const handleChoice = (value: ConsentValue) => {
    setStoredConsent(value)
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[100] border-t border-border bg-background shadow-lg md:bottom-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use analytics cookies to improve CreateFreeCV. Read our{" "}
          <Link href="/cookie-policy" className="underline underline-offset-2 hover:text-foreground">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => handleChoice("declined")}>
            Decline
          </Button>
          <Button size="sm" onClick={() => handleChoice("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
