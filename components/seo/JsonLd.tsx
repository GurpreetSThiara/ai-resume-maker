import React from "react"

/**
 * Renders a JSON-LD structured-data <script> tag.
 * Accepts a single schema object or an array of them.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data)
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject as ld+json; escape the closing
      // script sequence just in case any user-derived string contains it.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  )
}
