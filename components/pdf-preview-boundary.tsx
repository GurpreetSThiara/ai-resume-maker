"use client"

import React from "react"
import { FileWarning, RefreshCw } from "lucide-react"

interface Props {
  children: React.ReactNode
  /** Label used in the fallback copy, e.g. "PDF" or "DOCX". */
  label?: string
}

interface State {
  hasError: boolean
  attempt: number
}

/**
 * Isolates the pdf-lib / react-pdf preview so a failure there (e.g. the
 * PDF.js worker chunk being invalidated by a Turbopack HMR update, which can
 * surface intermittently in some browsers) NEVER crashes the surrounding
 * editor. Instead the PDF tab shows a friendly, recoverable message. The
 * editable preview and PDF/DOCX downloads are unaffected.
 */
export class PdfPreviewErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, attempt: 0 }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Surface for debugging without bubbling up to the app.
    console.error("[ResumePdfPreview] preview failed to render:", error)
  }

  private handleRetry = () => {
    this.setState((s) => ({ hasError: false, attempt: s.attempt + 1 }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto flex min-h-[40vh] w-full max-w-md flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-amber-200 bg-amber-50/60 px-6 py-12 text-center"
        >
          <FileWarning className="h-10 w-10 text-amber-500" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-800">{this.props.label ?? "Live"} preview couldn&apos;t load</p>
            <p className="text-xs leading-relaxed text-amber-700">
              We couldn&apos;t render the live preview in this browser. Your resume is safe — keep editing in the{" "}
              <span className="font-medium">Editable</span> tab, or download the PDF/DOCX, which are unaffected.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Try again
          </button>
        </div>
      )
    }

    // Changing the key on retry forces a fresh remount (and a fresh dynamic
    // import of the preview), which typically recovers after an HMR reload.
    return (
      <div key={this.state.attempt} className="contents">
        {this.props.children}
      </div>
    )
  }
}

export default PdfPreviewErrorBoundary
