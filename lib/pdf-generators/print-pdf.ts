import type { PDFGenerationOptions } from "@/types/resume"
import { generateResumePDFBytes } from "./index"

/**
 * Print the resume by generating the REAL PDF (same design engine as the
 * download) and opening the browser print dialog for THAT PDF — not the app
 * page. This guarantees the printed output is the actual resume, pixel-identical
 * to the downloaded PDF and correctly paginated.
 *
 * Implementation: render the PDF to a Blob, load it into an off-screen iframe,
 * and call `print()` on the iframe window. Browsers that block in-iframe PDF
 * printing fall back to opening the PDF in a new tab (where the user can print).
 */
export async function printResumePDF(options: PDFGenerationOptions): Promise<void> {
  const bytes = await generateResumePDFBytes(options)
  const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)

  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "0"
  iframe.setAttribute("aria-hidden", "true")

  let settled = false
  const cleanup = () => {
    // Revoke + remove after a delay so the print dialog has time to read the blob.
    window.setTimeout(() => {
      URL.revokeObjectURL(url)
      iframe.remove()
    }, 60_000)
  }

  iframe.onload = () => {
    if (settled) return
    settled = true
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch {
      // Some browsers (e.g. Firefox) won't print a PDF embedded in an iframe.
      window.open(url, "_blank", "noopener,noreferrer")
    }
    cleanup()
  }

  iframe.src = url
  document.body.appendChild(iframe)
}
