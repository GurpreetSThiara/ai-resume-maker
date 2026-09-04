export const RESUME_NAMES = {
     GOOGLE: "Google",
     ATS_CLASSIC : "ats_classic",
     ATS_GREEN_HEADERS: "ats_green",
     ATS_COMPACT_LINES: "ats_compact_lines"
}

/** Shown by the marketing download counter when MongoDB is unreachable. */
export const DOWNLOAD_COUNT_FALLBACK = 50000


/**
 * Defaults for per-line document styling. Literal hex on purpose: these values
 * are written into the resume data and consumed by the PDF and DOCX engines,
 * neither of which can resolve a CSS variable.
 */
export const DEFAULT_TEXT_COLOR = '#000000'
export const DEFAULT_HIGHLIGHT_COLOR = '#fff2a8'
