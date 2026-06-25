# Render Parity Standard (canvas ↔ PDF ↔ DOCX)

One `ResumeDesign` is rendered by **three independent engines**:

| Renderer | File | Unit | Layout model |
|---|---|---|---|
| HTML canvas (preview/editor) | `components/resumes/shared/ConfigurableResume.tsx` | CSS px | browser flow/flexbox |
| PDF | `lib/pdf-generators/design-pdf-engine.ts` | points (pt) | hand-rolled cursor (manual x/y + wrap) |
| DOCX | `lib/docx-generators/design-docx-engine.ts` | half-points / twips | Word paragraphs/tables |

Because each engine re-implements layout, they drift. This doc defines the contract that keeps them in sync, plus the harness that enforces it.

## Root cause of drift

1. **Coordinate-system mismatch (the big one).** The PDF page is `595.28 × 841.89 pt` with text in pt (e.g. 11pt on a 595pt page). The canvas page was `595 px` (1pt→1px) **but text was `pt × 1.34`** — so glyphs are ~33% larger *relative to the columns* than in the PDF. Result: the preview wraps sooner and looks more spread out than the export. **Fix: every canvas dimension — page, columns, margins, gaps AND fonts — must use one scale (`PT_TO_PX`).**
2. **Duplicated constants.** pt→px ratio, sidebar width (188), colours, font maps, skill-bar track colour were each declared in 2–3 places and fell out of step (e.g. PDF track `rgb(0.42)` vs canvas `rgba(255,255,255,0.22)`).
3. **Independently hand-coded structure.** Contact block (labelled vs single heading), skill-group casing, etc. were authored separately per renderer.
4. **Font metrics.** pdf-lib measures with StandardFonts (Helvetica/Times/Courier); the browser uses its own. Close but not identical → minor residual wrap differences even after (1).

## The standard: `lib/render-spec.ts`

Single source of truth for everything that must agree:

- **Units:** `PAGE_PT`, `PT_TO_PX = 96/72`, `px(pt)`, `halfPt(pt)`.
- **Geometry (in pt):** `GEO` — sidebar width, margins, skill-bar height.
- **Colour:** `cssHex` / `docxHex` / `hexToRgb01`; `SIDEBAR_TRACK_HEX`.
- **Fonts:** `FONT_CSS`, `FONT_DOCX`, `FONT_PDF_STANDARD`.

**Rule:** renderers import from `render-spec`; they never re-declare a unit, colour conversion, font map or shared dimension. A canvas size is `px(designValuePt)`, never a raw px literal.

## Verification harness ("screenshot every PDF, match the preview 1:1")

`/dev/parity` (dev-only) iterates every template in `availableTemplates` with one fixed sample resume and, per template:
1. renders the **real PDF** (`generateResumePDFBytes` → pdf.js → bitmap),
2. renders the **HTML canvas** at the PDF's scale (non-editing) → bitmap,
3. normalises both to the same size and **pixel-diffs** (pixelmatch) → score + overlay.

Output: a table sorted by diff %, with side-by-side + diff overlay per template. A CI check fails if any template exceeds a threshold — so drift can't regress silently.

## Migration to full parity (phased; gated by the harness)

- **P0 (done):** `render-spec.ts`; route `lineStyle` + `ConfigurableResume` font/px/track colour through it; unify contact (per-field labels) + skill-group casing + bar/track colours.
- **P1:** adopt the coordinate contract on the canvas — derive page (`px(PAGE_PT.w/h)`), columns (`px(GEO.sidebarWPt)`), margins and **all inter-element spacing** from pt × `PT_TO_PX`. Re-base pagination + zoom-fit on the scaled height. This removes the density/wrapping drift.
- **P2:** stand up `/dev/parity`; drive the remaining per-template diffs to < threshold; add the CI gate.

## Strategic alternative (true 1:1, bigger change)

Generate the PDF **from the HTML** via headless Chromium (`page.pdf()`). The preview *is* the PDF source, eliminating this entire drift class and deleting the hand-rolled pdf-lib layout engine. Text stays real/selectable/ATS-friendly. Cost: a server-side browser (heavier infra, per-render latency) vs today's free client-side pdf-lib. Recommended only if the spec+harness approach proves too costly to maintain.
