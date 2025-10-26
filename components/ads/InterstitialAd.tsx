'use client'
export function loadInterstitialAd(zoneId: string) {
  if (typeof window === 'undefined') return

  const existing = document.querySelector(`script[data-zone="${zoneId}"]`)
  if (existing) existing.remove() // remove old script

  const script = document.createElement('script')
  script.dataset.zone = zoneId
  script.src = 'https://groleegni.net/vignette.min.js'
  script.async = true
  document.body.appendChild(script)
}


// <script>(function(s){s.dataset.zone='10097033',s.src='https://groleegni.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>