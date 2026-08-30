// instrumentation-client.js
import posthog from 'posthog-js'
import { CONSENT_CHANGED_EVENT, getStoredConsent } from '@/lib/analytics-consent'

let initialized = false

function initPostHog() {
    if (initialized) return
    initialized = true
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24'
    })
}

// Only runs in production, and only after the user accepts the cookie consent banner.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    if (getStoredConsent() === 'accepted') {
        initPostHog()
    }
    window.addEventListener(CONSENT_CHANGED_EVENT, (event) => {
        if (event.detail === 'accepted') {
            initPostHog()
        }
    })
}
