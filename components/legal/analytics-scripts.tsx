"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { CONSENT_CHANGED_EVENT, getStoredConsent, type ConsentValue } from "@/lib/analytics-consent"

const GTM_ID = "GTM-W6W84N5N"
const GA_ID = "G-YYGPPFLBZW"

export function AnalyticsScripts() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(getStoredConsent() === "accepted")

    const handleConsentChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentValue>).detail
      setEnabled(detail === "accepted")
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange)
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange)
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>

      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
