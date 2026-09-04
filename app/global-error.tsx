'use client'

import { useEffect } from "react"

/**
 * Last-resort boundary for errors thrown in the root layout itself, which
 * app/error.tsx cannot catch. It replaces the whole document, so it has to
 * render its own <html>/<body> and cannot rely on globals.css being applied.
 *
 * Added after a batch of route-handler failures raised unhandledRejection with
 * nowhere to surface — see QA_AUDIT.md C1.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#ffffff",
          color: "#14191c",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>Something went wrong</h1>
          <p style={{ color: "#57646a", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            The page could not be loaded. Reloading usually fixes it — if it keeps happening,
            please let us know.
          </p>
          {error.digest ? (
            <p style={{ color: "#7d8a90", fontSize: ".8rem", marginBottom: "1.5rem" }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              font: "inherit",
              fontWeight: 600,
              padding: ".6rem 1.2rem",
              borderRadius: ".375rem",
              border: "1px solid #14191c",
              background: "#14191c",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
