# Resume Maker — UX / Product / QA Audit

**Auditor role:** Senior QA + UX/Product + Accessibility + Frontend + Resume-industry review.
**App:** CreateFreeCV — Next.js 16 (App Router) resume builder.
**Audit type:** **Static code review** (four parallel reviewers across marketing/content, create/guided editor, dashboard/auth/misc, and global layout), consolidated and de-duplicated, with headline findings re-verified in source.

> ⚠️ **Method caveat — read this first.** This audit was performed by reading the code, not by driving the running app (the dev server holds the Next `.next/dev/lock` and no browser was connected for automation). So: broken links, missing labels, hardcoded colors, dead code, keys, viewport config, and content strings are **high-confidence** (re-verified). Anything about *rendered* pixels, animation smoothness, real device breakpoints, actual PDF/DOCX visual output, and perceived performance is **inferred from code** and marked ❓ where it needs a live pass. The full responsive matrix (320→1920px) and export-quality checks require a live device/browser run.

**Confidence legend:** ✅ verified in source · ⚠︎ reported by reviewer, plausible · ❓ needs live verification.

---

## Executive Summary

| Dimension | Score (0–10) | Basis |
|---|---:|---|
| **Overall product readiness** | **6.0** | Solid architecture and a genuinely good guided flow, undermined by shipped-broken content (dead CTA links, placeholder blog posts), a non-functional dark mode, and several accessibility failures. |
| UI (visual) | 7.0 | Modern, consistent primary components (Radix + Tailwind); some inconsistent one-off styles and dead/hidden controls. |
| UX (flow) | 6.5 | Guided step flow is clear; friction from settings discoverability, confusing template history, and dead buttons. |
| Accessibility | 4.0 | Zoom disabled site-wide, no reduced-motion, icon-only buttons unlabeled, no skip link, sub-44px targets. |
| Performance (perceived) | 6.0 ❓ | Can't measure live; images served unoptimized by config; blog content inlined as large JSX. Needs Lighthouse. |
| Content quality | 5.0 | Core UI copy is decent; **live blog posts contain placeholder/blank content**; some contradictory microcopy. |
| ATS friendliness | 7.5 | Real strength: dedicated single-column ATS templates, plain headings, selectable PDF text, non-ATS templates flagged. |

**One-line verdict:** A capable builder with a strong engine and ATS story, but **not launch-ready as-is** — it ships with user-facing broken links and placeholder blog content, and fails several basic accessibility checks. These are mostly quick fixes.

---

## Critical Issues (block or mislead users)

### C-1 — Dead CTA links to a non-existent route ✅
- **Category:** Broken navigation / Content
- **Location:** [app/blog/BlogPostDetail.tsx:64](app/blog/BlogPostDetail.tsx:64), [app/blog/data/blogPosts.tsx:487](app/blog/data/blogPosts.tsx:487)
- **Problem:** "Build a resume" CTAs link to `/dashboard/resume/create`, which does not exist. Correct route is `/free-ats-resume-templates/create`.
- **Why it's a problem:** The primary conversion action inside blog posts 404s.
- **Impact:** Lost conversions from the exact users reading "how to build a resume" content — the highest-intent traffic.
- **Fix:** Replace with `/free-ats-resume-templates/create` (and `...?template=ats-classic-compact` for the second).

### C-2 — Live blog posts show placeholder / blank content ✅
- **Category:** Content
- **Location:** [app/blog/data/blogPosts.tsx](app/blog/data/blogPosts.tsx) — `ats-resume-guide` (L301 `"Detailed guide content here..."`), `software-engineer-resume` (L313 same), `resume-rejected-without-interview` (L339 `"Detailed content..."`), `ats-resume-explained` (L326 `content: null` → blank).
- **Why it's a problem:** These posts are in the blog listing **and** the sitemap (search-indexed), so users and Google land on empty pages.
- **Impact:** Destroys trust ("looks unfinished"), wastes SEO, high bounce.
- **Fix:** Write real content, or filter drafts out of the listing + sitemap until ready (e.g., a `draft: true` flag).

### C-3 — Dark mode is advertised but non-functional ✅
- **Category:** Product / Visual
- **Location:** `next-themes` installed; `ThemeProvider` **not** wired into root providers ([app/layout.tsx](app/layout.tsx)); [app/settings/page.tsx](app/settings/page.tsx) toggle disabled "coming soon"; many pages hardcode light colors ([app/contact/page.tsx](app/contact/page.tsx)).
- **Why it's a problem:** A visible toggle that does nothing, and `dark:` classes scattered through components that never activate.
- **Impact:** Broken-feeling settings; wasted `dark:` styling effort; user confusion.
- **Fix:** Either finish it (wire ThemeProvider, audit hardcoded colors) or remove the toggle and dead `dark:` variants until it's real.

---

## High Priority Issues

### H-1 — Zoom disabled site-wide (WCAG failure) ✅
- **Location:** [app/layout.tsx:101](app/layout.tsx:101) — `maximum-scale=1.0, user-scalable=no`.
- **Why/Impact:** Blocks pinch-zoom for low-vision users; WCAG 1.4.4 failure; also hurts anyone reading a dense resume preview on mobile.
- **Fix:** `content="width=device-width, initial-scale=1, viewport-fit=cover"` (drop the scale/scalable locks).

### H-2 — "Portfolios" (auth area) linked for logged-out users ✅
- **Location:** [components/layout/navbar.tsx:66-78](components/layout/navbar.tsx:66) — a `user ? […] : […]` ternary that spreads the **identical** item in both branches (dead conditional).
- **Why/Impact:** Logged-out users see a link into a dashboard/auth area; the conditional's intent is silently broken.
- **Fix:** Gate the item behind `user`, or intentionally show it and remove the fake conditional.

### H-3 — Reorderable/deletable lists use array-index keys ✅
- **Location:** `key={index}` in [education-section.tsx](components/education-section.tsx), experience-section, skills-section, and highlight/achievement rows.
- **Why/Impact:** After reorder or mid-list delete, React reconciles the wrong rows → stale/ghost values in inputs, focus jumps. This is a real data-integrity/UX bug during editing.
- **Fix:** Give each item a stable `id` (crypto.randomUUID on create) and key on it.

### H-4 — Icon-only buttons without accessible names ⚠︎✅
- **Location:** portfolios external-link button [portfolios/page.tsx:194](app/(dashboard)/dashboard/portfolios/page.tsx:194) ✅; contact Instagram link ⚠︎; mobile header icon buttons ⚠︎; several `size="icon"` buttons.
- **Why/Impact:** Screen readers announce "button" with no purpose; keyboard/AT users are blocked.
- **Fix:** Add `aria-label` to every icon-only control.

### H-5 — AI modal: contradictory state + mobile overflow ⚠︎
- **Location:** [components/ai-resume-modal.tsx:291](components/ai-resume-modal.tsx:291) (button text "Login Required" while `title="Coming soon"`), and L320 raw JSON rendered with `whitespace-pre-line` and no `overflow-x` container.
- **Why/Impact:** Confusing gating message; long JSON keys overflow horizontally on phones.
- **Fix:** Make the label/title reflect the true reason; wrap output in `overflow-x-auto` / `<pre>`.

### H-6 — Settings discoverability / dead controls in the editor ✅
- **Location:** [components/CreateResumeHeader.tsx](components/CreateResumeHeader.tsx) — "Create with AI" button is both `disabled` **and** `hidden` yet rendered (incl. mobile sheet); the Settings modal is the only path to spacing/margins/condensed for guided users.
- **Why/Impact:** Dead DOM confuses AT and maintainers; key styling controls are one modal deep with no affordance that they exist.
- **Fix:** Remove the dead button (feature-flag, don't `disabled+hidden`); surface a hint that "Settings" controls layout/spacing.

---

## Medium Priority Issues

| ID | Category | Location | Problem | Fix |
|---|---|---|---|---|
| M-1 | Consistency | [cover-letter/editor/[id]/error.tsx:24](app/cover-letter/editor/[id]/error.tsx:24) | Plain hardcoded `<button className="bg-blue-500…">` instead of `Button` | Use `<Button>`; consistent styling + dark mode |
| M-2 | Consistency | manage-cloud delete button | Inline red classes instead of `variant="destructive"` | Use the destructive variant |
| M-3 | Content | [app/contact/page.tsx:117](app/contact/page.tsx:117) | Submit button hover gradient jumps green→purple (incoherent) | Coherent hover (`from-green-600 to-emerald-600 hover:...`) |
| M-4 | A11y | [app/globals.css](app/globals.css) | No `prefers-reduced-motion` handling | Add reduce-motion media query to damp animations |
| M-5 | A11y | [app/layout.tsx](app/layout.tsx) | No skip-to-content link with sticky nav | Add `sr-only focus:not-sr-only` skip link + `id="main-content"` |
| M-6 | A11y / touch | header icons `h-9 w-9`, color picker `h-8 w-12` | Below 44px tap target | Bump to ≥44px effective |
| M-7 | Robustness | [components/custom-fields-section.tsx](components/custom-fields-section.tsx) | `value={field.content}` risks controlled/uncontrolled warning | `value={field.content ?? ""}` |
| M-8 | Mobile | [Create.tsx](app/free-ats-resume-templates/create/Create.tsx) ~L750 | Mobile preview dialog close button commented out | Restore an explicit close affordance |
| M-9 | Z-index | navbar `z-50` vs drawer `z-50` vs bottom-nav `z-40` ⚠︎ | Ambiguous stacking; overlays can tie | Define a z-index scale (nav 40, drawer/sheet 50, modal 60) |
| M-10 | SEO/Content | blog images (`/blog/trends-2026.jpg`, etc.) ❓ | May 404 → gradient fallback shown | Verify assets exist in `/public/blog/` |

---

## Low Priority / Polish

- **L-1** ❓ Responsive padding: `px-6` on cover-letter editor, `p-8` portfolio cards, `md:grid-cols-5` on image-converter format buttons — tighten to mobile-first (`px-4 sm:px-6`, `p-4 sm:p-8`, `grid-cols-2 sm:grid-cols-3 md:grid-cols-5`).
- **L-2** ❓ Desktop preview `sticky top-32` assumes a fixed header height; can overlap the sidebar card on taller headers.
- **L-3** ✅ SafeImg fallback is a generic gradient + "Preview" — fine, but featured posts deserve real images.
- **L-4** ⚠︎ Focus-visible ring may be subtle on `size="icon"` buttons.
- **L-5** ✅ `metadataBase`/OG uses `createfreecv.com` but one blog OG url uses `www.` variant ([how-to-write-a-resume/page.tsx](app/how-to-write-a-resume/page.tsx)) — pick one canonical host.

---

## Area-by-area highlights (audit template coverage)

**1. First impression** — Home clearly communicates "free ATS resume builder"; template showcase is strong. Trust markers (ATS scores, "no signup") present. ❓ Confirm hero CTA above the fold on 360px.
**2–4. Creation journey / forms / sections** — Guided step flow (Personal → Summary → Education → Experience → Skills → Languages → Certs → Projects → Custom → Review) is logical. Gaps: index-key editing bug (H-3); no inline validation surfaced (email/phone/date formats accepted raw); no examples/placeholders in some fields; education now condensed-by-default with CGPA (good). Consider per-field validation + "example" ghost text.
**5. Content** — Core UI copy is clean; problems are the placeholder blog posts (C-2) and contradictory AI copy (H-5).
**8. User mistakes** — Little prevention: invalid email/phone, empty resume, and "Present" dates are accepted without guidance. Add lightweight validation + an empty-resume nudge.
**9. Accessibility** — Multiple failures (H-1, H-4, M-4, M-5, M-6). This is the weakest dimension.
**10–12. Responsive** ❓ — Code shows real mobile care (safe-area insets, sticky app bar, bottom-nav padding), but also fixed paddings and sub-44px targets. Needs the live 320→1920 matrix run.
**13–14. Preview & export** — Architecture is a genuine strength: one `mergeDesign` source drives Editable = PDF = DOCX; PDF text is selectable; DOCX uses real headings. ❓ Verify multi-page pagination and Word "opens without repair" live.
**24–25. Resume quality & ATS** — Strong: single-column ATS templates, plain headings, contact in body (not header), selectable text; sidebar/designer templates correctly flagged less-ATS. This is the product's best feature.
**26. AI opportunities** — AI summary/parse exist but gated/disabled; biggest untapped value is bullet-rewriting and summary generation surfaced inline.
**27. Edge cases** ❓ — Long strings, 50 entries, unicode/emoji, RTL, international phones — need live checks; TC-095–100 in [docs/test-cases-guided-editor.md](docs/test-cases-guided-editor.md) cover these.
**30. Competitive benchmark** — vs Resume.io / Zety / Enhancv / Reactive Resume: this app is competitive on *free + ATS + no-signup + live preview*. It lags on: content assistance (AI bullets), inline validation, real-time save affordances, dark mode, and polish/accessibility.

---

## Quick Wins (< 1 hour each)
1. ✅ Fix the 2 dead blog CTA links (C-1).
2. ✅ Remove the viewport zoom lock (H-1).
3. ✅ Auth-gate or de-fake the Portfolios nav item (H-2).
4. ✅ Add `aria-label` to icon-only buttons (H-4).
5. ✅ Add the `prefers-reduced-motion` block + skip-to-content link (M-4, M-5).
6. ✅ Delete/flag the placeholder blog posts from the listing & sitemap (C-2 interim).
7. ✅ Replace hardcoded buttons with `Button` variants (M-1, M-2).

## Long-Term Improvements
1. **Finish or remove dark mode** end to end (C-3).
2. **Inline validation + guidance** across forms (email/phone/date, empty-state nudges).
3. **Stable ids on all list items** (H-3) — foundational for reliable reorder/undo.
4. **AI writing assist** inline (summary, achievement bullets, action verbs) — the top competitive gap.
5. **Autosave affordance** ("Saving…/Saved", unsaved-changes guard) for user confidence.
6. **Accessibility pass to WCAG AA** (focus order, contrast tokens, labels, motion).
7. **Live device/breakpoint + Lighthouse CI** so responsive/perf regressions are caught.

---

## Final Verdict

**Would I launch today? No — not for a broad marketing push.** The engine, guided flow, and ATS output are genuinely good, but the app currently ships **user-facing broken links and placeholder blog pages** and **fails basic accessibility** (zoom lock, unlabeled controls). None are deep; most are quick wins. Fix the Critical + High list and it's a credible, launchable free product.

### Top 10 changes for user satisfaction
1. Fix dead resume CTA links in blog (C-1).
2. Replace/hide placeholder blog posts (C-2).
3. Re-enable zoom; accessibility quick wins (H-1, M-4/5/6).
4. Decide dark mode: finish or remove (C-3).
5. Stable list ids to stop edit/reorder data bugs (H-3).
6. Label every icon-only button (H-4).
7. Add inline form validation + empty-resume guidance (areas 3/8).
8. Surface layout/spacing controls better; kill dead buttons (H-6).
9. Add "Saving/Saved" + unsaved-changes safety (area 23).
10. Ship inline AI writing help for summary & bullets (area 26).

---

*Static findings; ❓ items need a live run. To convert this into an executed report with screenshots and real breakpoint/export checks, stop `next dev` (so I can start & drive the server) or connect Chrome with the Claude extension.*
