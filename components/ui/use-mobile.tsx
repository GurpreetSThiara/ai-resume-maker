import * as React from "react"

export const MOBILE_BREAKPOINT = 768
/** Tailwind's `lg` — the point where the app switches to side-by-side layouts. */
export const LG_BREAKPOINT = 1024

/**
 * True once mounted and the viewport is narrower than `breakpoint`.
 *
 * Deliberately starts `false` rather than measuring during render. The server
 * has no viewport, so a component that branches on a measured width renders a
 * different tree on the server than on the client's first render, and React
 * discards the server HTML — the hydration bug fixed in bed273d. Starting
 * false means both sides agree, and the effect corrects it on mount.
 *
 * So: the wide layout is what renders first. Where that matters, prefer a CSS
 * breakpoint, which needs no JavaScript at all.
 */
export function useIsBelow(breakpoint: number) {
  const [isBelow, setIsBelow] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const sync = () => setIsBelow(query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [breakpoint])

  return isBelow
}

export function useIsMobile() {
  return useIsBelow(MOBILE_BREAKPOINT)
}
