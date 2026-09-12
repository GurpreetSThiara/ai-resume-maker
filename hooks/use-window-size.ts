import { useState, useEffect } from "react"

export function useWindowSize() {
    // Seeded with zeros on purpose, NOT with window.innerWidth.
    //
    // Reading the real size here makes the first client render disagree with
    // the server render (which has no window), and React treats that as a
    // hydration mismatch — it was reported as error #418 on every page, since
    // the navbar derives how many links to show from this width.
    //
    // The effect below fills in the true size immediately after mount, so the
    // only cost is one extra render rather than a broken hydration.
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener("resize", handleResize)

        // Call handler right away so state gets updated with initial window size
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return windowSize
}
