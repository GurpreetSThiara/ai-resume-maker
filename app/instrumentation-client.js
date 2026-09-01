// instrumentation-client.js
import posthog from 'posthog-js'
import { CONSENT_CHANGED_EVENT, shouldLoadAnalytics } from '@/lib/analytics-consent'

let initialized = false

function initPostHog() {
    if (initialized) return
    initialized = true
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24'
    })
}

// Production only, and only when the shared consent rules allow it: an explicit
// Accept in EU/EEA/UK/CH, the absence of a Decline elsewhere, and no Global
// Privacy Control signal in either case.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    const evaluate = () => {
        if (shouldLoadAnalytics()) initPostHog()
    }

    evaluate()

    // PostHog cannot be un-initialised, so a later opt-out is handled by opting
    // the user out of capturing rather than by tearing the library down.
    window.addEventListener(CONSENT_CHANGED_EVENT, () => {
        if (shouldLoadAnalytics()) {
            evaluate()
            if (initialized) posthog.opt_in_capturing()
        } else if (initialized) {
            posthog.opt_out_capturing()
        }
    })
}
