# Remediation Plan — createfreecv.com

Companion to `QA_AUDIT.md`. Eight phases, ordered so each one makes the next cheaper or safer.
Finding ids (C1, H5, M2 …) refer to that audit.

**Branch:** `main` @ `06b9f95` · **Written:** 2026-09-04

> **STATUS: phases 0-7 complete** on branch `qa-remediation`, one commit per phase.
> Final state: **0 type errors** (from 184), 0 lint errors, 0 npm advisories, and
> `check:env`/`typecheck`/`lint`/`build` all passing in CI. Deviations from this
> plan as written, and the work deliberately left undone, are recorded in the
> commit messages and summarised at the end of this file.

## Why this order

Three facts drive the sequence:

1. **The gates come back first.** 184 type errors are hidden behind
   `typescript.ignoreBuildErrors` and ESLint cannot start at all. Turn the compiler back on
   before touching code and it points at every async-migration site for you. Do the fixes first
   and you hunt them by hand.
2. **Most of the type debt deletes rather than gets fixed.** `components/resumes/index.ts`
   resolves *every* template through `ConfigurableResume` via `DESIGN_RESUME_COMPONENTS` — the
   standalone legacy template components are superseded and unreferenced. Six of them hold
   **84 of the 184 errors**. Deleting dead code before fixing types avoids paying to repair
   files nobody renders.
3. **Ship-blockers before cleanup.** Cover letters, AI import, AI summary and review voting are
   dead in production right now. Phases 2–4 restore them; everything after is debt paydown that
   can run at whatever pace suits.

| Phase | Goal | Effort | Blocking? |
| --- | --- | --- | --- |
| 0 | Restore lint + typecheck gates | ~2h | Yes — gates the rest |
| 1 | Delete dead code (−84 errors) | ~2h | No, but do it early |
| 2 | Next 16 async migration + auth | ~4h | **Ship-blocker** |
| 3 | Close security exposures | ~5h | **Ship-blocker** |
| 4 | Repair broken features | ~3h | **Ship-blocker** |
| 5 | Consolidate to one toast system | ~4h | No |
| 6 | Zero the type errors, add CI | ~2–3d | No |
| 7 | Standards, structure, polish | incremental | No |

Estimates are rough and assume one developer familiar with the codebase.

---

## Phase 0 — Restore the safety net

**Goal.** A linter that runs and a typechecker you can query. No behaviour changes.

Verified during the audit: `eslint-config-next@16.0.0` **already ships flat config** —
`eslint-config-next/core-web-vitals` exports a 4-entry array. No `FlatCompat` shim needed.

### Changes

1. Create `eslint.config.mjs`:

   ```js
   import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
   import nextTypescript from 'eslint-config-next/typescript'

   export default [
     { ignores: ['.next/**', 'node_modules/**', 'scratch.js', 'scratch/**', 'google-apps-script-tracker.js'] },
     ...nextCoreWebVitals,
     ...nextTypescript,
     {
       rules: {
         // Carried over from .eslintrc.json. Revisit once the codebase is clean —
         // no-explicit-any in particular is hiding real gaps.
         '@typescript-eslint/no-explicit-any': 'off',
         '@typescript-eslint/no-unused-vars': 'off',
         'react-hooks/exhaustive-deps': 'off',
       },
     },
   ]
   ```

2. Delete `.eslintrc.json`.
3. In `next.config.mjs`, delete the whole `eslint: { ignoreDuringBuilds: true }` block — Next 16
   removed the key and warns about it on every boot. **Leave `typescript.ignoreBuildErrors: true`
   in place for now**; it is flipped in Phase 6 once the count reaches zero. Flipping it here
   would block every build for the duration of the plan.
4. In `package.json`, replace the removed `next lint` and add a typecheck script:

   ```json
   "lint": "eslint .",
   "typecheck": "tsc --noEmit"
   ```

### Verification

```
npx eslint . --max-warnings=-1   # runs and reports, rather than failing to start
npm run typecheck 2>&1 | grep -c 'error TS'   # expect 184
npm run dev                      # boot log no longer warns about the 'eslint' key
```

### Exit criteria

- `npm run lint` produces a report instead of "couldn't find an eslint.config file".
- `npm run typecheck` prints a number you can track. **Record it (184) as the baseline.**
- No boot warning about an unrecognised config key.

> Expect the first lint run to surface a large backlog, much of it in files Phase 1 deletes.
> Do not fix lint findings in this phase — just get the tool running.

---

## Phase 1 — Delete dead code

**Goal.** Remove unreferenced files so later phases don't pay to repair code nobody renders.
Drops the error count from 184 to 100 without editing a single live line.

### Judgment call to settle first

The six error-heavy files are legacy standalone resume templates. `components/resumes/index.ts`
documents them as already migrated into `DESIGN_RESUME_COMPONENTS`, and none has an importer.
**Confirm no design here is meant to be re-registered later.** If one is, port it into
`RESUME_DESIGNS` in `lib/resume-designs.ts` rather than keeping a stale component that reads a
data shape the app no longer produces. Everything below is recoverable from git history.

### Changes

1. **Orphaned resume templates** — verified zero importers via both `@/components/resumes/<name>`
   and relative-path patterns:

   | File | TS errors |
   | --- | --- |
   | `components/resumes/ats-green-headers.tsx` | 24 |
   | `components/resumes/ats-elegant.tsx` | 20 |
   | `components/resumes/modern-resume.tsx` | 14 |
   | `components/resumes/ats-creative.tsx` | 13 |
   | `components/resumes/ats-compact.tsx` | 12 |
   | `components/resumes/ats-timeline.tsx` | 1 |
   | `components/resumes/ats-yellow-headers.tsx` | 0 |
   | `components/resumes/ats-compact-lines-resume.tsx` | 0 |
   | `components/resumes/bold-professional.tsx` | 0 |
   | `components/resumes/google-black-lines-resume.tsx` | 0 |
   | `components/resumes/modern-sidebar.tsx` | 0 |
   | `components/resumes/modern-split.tsx` | 0 |

   **Keep** `ats-classic.tsx` and `google-resume.tsx` (both imported by
   `components/appUI/Carausol/ResumeCarausol.tsx`), `design-resumes.tsx` (imported by
   `index.ts`), and `shared/ConfigurableResume.tsx`.

   These files read `section.content` as a keyed `Record<string, string[]>` — the pre-refactor
   shape. That is *why* they carry the errors, and it confirms they are stale rather than merely
   untyped.

2. **Superseded components** — zero importers:
   `components/resume-preview.new.tsx`, `components/review-section.new.tsx`,
   `components/skills-section.new.tsx`

3. **Root junk:** `scratch.js` (38 KB), `pnpm-lock.yaml` (92-byte stub — `package-lock.json` is
   the real one).

4. **Dead imports in `app/layout.tsx`** — lines 6 and 10 import `DevelopmentBanner` and
   `Analytics` whose only usages (124, 132) are commented out. Remove both imports and both
   commented lines. `@vercel/analytics` is currently bundled but never rendered; drop the
   dependency too if nothing else uses it.

5. **Unused env vars** — remove from `.env` and every deployment environment:
   `ENCRYPTION_KEY`, `GOOGLE_CLIENT_SECRET`, `EXPO_PUBLIC_SUPABASE_URL`,
   `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_GOOGLE_*` (3 vars).
   `NEXT_PUBLIC_OPENROUTER_API_KEYS` is handled in Phase 3 because it needs a key rotation.

### Verification

Before deleting each file, re-confirm it is unreferenced:

```
grep -rE "(@/components/resumes/|\./|\.\./resumes/)<name>[\"']" \
  --include='*.ts' --include='*.tsx' app components lib hooks utils services contexts
```

After the deletions:

```
npm run typecheck 2>&1 | grep -c 'error TS'   # expect 100
npm run build                                  # must still succeed
```

Then click through the template marketplace and the create flow and confirm every template still
renders — all of them route through `ConfigurableResume`, so nothing should change visually.

### Exit criteria

- Type errors: **184 → 100**.
- Build succeeds; every template still previews and exports.
- `git status` shows only deletions plus the small `app/layout.tsx` edit.

---

## Phase 2 — Complete the Next 16 async migration

**Goal.** Fix C1 and H2 together — the same three files, one pass. This revives cover letters, AI
summary, credit metering and usage reporting.

**Ship-blocker.** Every cover-letter endpoint currently returns 500 instead of 401 and raises an
`unhandledRejection` on each request.

### Changes

1. **Await `cookies()`** at all six sites — `cookies()` returns a Promise in Next 16:

   ```
   app/api/cover-letters/route.ts:8,38
   app/api/cover-letters/[id]/route.ts:10,51,105
   app/api/ai/generate-summary/route.ts:6
   ```

   `createRouteHandlerClient({ cookies: () => cookieStore })` after
   `const cookieStore = await cookies()`.

2. **Await the async client factory** — `lib/supabase/server.ts:5` is `async`; three routes read
   `.auth` off the returned Promise:

   ```
   app/api/openrouter/route.ts:11
   app/api/ai/track/route.ts:19
   app/api/ai/usage/route.ts:15
   ```

3. **Await `params`** — three handler signatures in
   `app/api/cover-letters/[id]/route.ts:7,48,102`:

   ```ts
   export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
     const { id } = await params
   ```

4. **`getSession()` → `getUser()`** (H2) at all six sites — same three files, so fold it into this
   pass. `getSession()` reads the cookie without revalidating against the auth server; Supabase
   documents `getUser()` as the trustworthy server-side call.

   ```
   app/api/cover-letters/route.ts:9,39
   app/api/cover-letters/[id]/route.ts:11,52,106
   app/api/ai/generate-summary/route.ts:7
   ```

5. **Add `app/global-error.tsx`.** The unhandled rejections in C1 had nowhere to surface. A root
   error boundary would have made this visible in week one.

### Verification

Anonymous requests must now be rejected cleanly rather than crashing:

```
curl -s -o /dev/null -w '%{http_code}\n' -X POST localhost:3005/api/cover-letters -d '{}'   # 401
curl -s -o /dev/null -w '%{http_code}\n' localhost:3005/api/cover-letters/abc                # 401
curl -s -o /dev/null -w '%{http_code}\n' localhost:3005/api/ai/usage                         # 401
```

Server log must show **no** `TypeError: this.context.cookies is not a function` and no
`unhandledRejection`. Then sign in and exercise the real flow: create, open, edit and delete a
cover letter, and confirm `/api/ai/usage` reports a credit balance.

### Exit criteria

- All three curls return 401, not 500.
- Signed-in cover-letter CRUD works end to end.
- Type errors: **100 → ~88** (12 async-related errors clear).
- No `unhandledRejection` in the log under any request.

---

## Phase 3 — Close the security exposures

**Goal.** Stop the spend leak and the write-path exposure. Independent changes; parallelisable.

### 3a. Gate and meter `/api/ai/parse` (C3)

The only route calling a billed provider with no identity check and no quota. Verified: an
anonymous POST reached OpenRouter on the server's key.

Add the same gate its siblings use — `getUser()` plus the `ai_usage` monthly USD ceiling from
`app/api/openrouter/route.ts:23-35`. Extract that ceiling check into a shared helper
(`lib/ai-usage.ts`) rather than copy-pasting it; two routes needing it is the threshold.

If anonymous import is a deliberate acquisition funnel, say so explicitly and give it an IP-keyed
rate limit plus its own hard monthly spend cap. **Do not ship it ungated either way.**

### 3b. Stop mass assignment on cover-letter writes (H1)

`app/api/cover-letters/[id]/route.ts:76` spreads unvalidated JSON into the update, so
`user_id` is writable and a user can hand their row to another account. Ownership *is* checked —
the payload is the hole.

`zod` is already a dependency and no route uses it. Define the input schemas in
`types/cover-letter.ts` (which is also missing the `CreateCoverLetterInput` /
`UpdateCoverLetterInput` types three files already import — see Phase 6) and parse with
`.strict()` so unknown keys are rejected rather than silently forwarded. Apply to the POST handler
too.

### 3c. Delete the client-exposed key variable and rotate (H4)

`.env` holds the same 147-char `sk-or-…` value as both `OPENROUTER_API_KEYS` and
`NEXT_PUBLIC_OPENROUTER_API_KEYS`. It has **not** leaked — no code reads it and it is absent from
built assets — but it is one import from shipping to every browser.

1. Delete the `NEXT_PUBLIC_` line from `.env` and from every deployment environment (Vercel
   included — check all three of Production, Preview and Development).
2. **Rotate the keys.** A secret that has sat under a publicly-prefixed name should be treated as
   compromised, not audited.
3. Add a guard so this cannot recur — a CI grep is enough:

   ```
   grep -rE 'NEXT_PUBLIC_[A-Z_]*(KEY|SECRET|TOKEN|PASSWORD)' .env* && exit 1
   ```

### 3d. Fix review voting and rate-limit it (H3)

`app/api/reviews/[reviewId]/helpful/route.ts:7` and `.../report/route.ts:6` read
`searchParams.get('reviewId')` inside a `[reviewId]` dynamic route, so both always 400. Read
`const { reviewId } = await params`.

Both routes are also unauthenticated and uncapped — fixing the id read turns a broken endpoint
into a working vote amplifier. Ship the fix *with* a session requirement or IP-keyed limit, and
record one vote per user per review so the counter means something.

### Verification

```
# 3a — anonymous must be refused before any provider call
curl -s -o /dev/null -w '%{http_code}\n' -X POST localhost:3005/api/ai/parse \
  -H 'content-type: application/json' -d '{"text":"x"}'        # 401

# 3b — unknown/protected keys must be rejected, not applied
#      (signed in, against your own row)
curl -X PUT .../api/cover-letters/<own-id> -d '{"user_id":"<other-uuid>"}'   # 400
#      then confirm the row's user_id is unchanged

# 3c
grep -c NEXT_PUBLIC_OPENROUTER .env                            # 0
grep -rl 'sk-or-' .next/static public/                         # no matches

# 3d — signed in
curl -X POST .../api/reviews/<real-id>/helpful                 # 200, count increments by 1
curl -X POST .../api/reviews/<real-id>/helpful                 # refused as duplicate
```

### Exit criteria

- No route reaches a billed provider without an authenticated, metered caller.
- A cover-letter update cannot change `user_id`, `id` or `created_at`.
- Old OpenRouter keys revoked; no `NEXT_PUBLIC_` secret anywhere; CI guard in place.
- Review voting works, once per user per review.

---

## Phase 4 — Repair the broken features

**Goal.** The remaining user-visible breakage. Small, independent fixes.

### Changes

1. **Live model slug (C2).** `openai/gpt-oss-20b:free` is retired; OpenRouter returns 404 and
   names `openai/gpt-oss-20b` as the replacement. Hardcoded in two places
   (`app/api/ai/parse/route.ts:16`, `app/api/ai/generate-summary/route.ts:61`).

   Move it to `config.ts` as one env-backed value — a vendor model id is exactly the tunable that
   should never be inlined, let alone twice. Then extend the error mapping in `callAIWithRetry`:
   it currently only handles 429, so a 404 falls through to a bare `500 Internal Server Error`
   with nothing the UI can show. Map model-unavailable to a distinct code and surface it.

2. **Call the factory (C4).** `app/api/ai/generate-summary/route.ts:50` does
   `openRouter.chat.completions.create(...)`, but `lib/openrouter.ts:59` exports the *factory*
   under an instance-shaped name. Call `openRouter()`, and rename the export to
   `createOpenRouterClient` so the next caller cannot repeat the mistake.

3. **Dependencies (H7).** `npm audit fix` — 9 advisories, 8 high, one of them `next` itself. Then
   pin the five `"latest"` entries (`@radix-ui/react-dropdown-menu`, `-progress`, `-switch`,
   `-tabs`, `@supabase/supabase-js`) to the versions the lockfile currently resolves, so a fresh
   install is reproducible.

4. **Dead `request.ip` (M3).** Removed from `NextRequest`, so
   `app/api/track-download/route.ts:18` always falls through to the header reads. Drop the term
   and read `x-forwarded-for`, taking the first hop.

### Verification

```
npm audit --omit=dev            # 0 high
npm run typecheck 2>&1 | grep -c 'error TS'   # ~86
```

Then, signed in: import a resume via AI parse and confirm structured JSON comes back; generate an
AI summary and confirm text comes back; download a resume and confirm the tracked row records an
IP. Temporarily point the model config at a nonexistent slug and confirm the UI shows a real
message rather than a bare 500.

### Exit criteria

- AI import and AI summary both work.
- `npm audit` clean at high severity; no dependency on `"latest"`.
- A provider-side model error produces an actionable message, not a bare 500.

---

## Phase 5 — Consolidate to one toast system

**Goal.** Fix H6 and M1 together. Four notification systems coexist; one is mounted; eleven
dashboard toasts are silent no-ops.

Current state:

```
mounted       app/layout.tsx:131  <ToastContainer />      components/toast/ (custom context)
not mounted   components/ui/sonner.tsx    <Toaster />     ← 6 files call its toast()
not mounted   components/ui/toaster.tsx   <ToastProvider> ← shadcn, unused
also present  utils/toast.tsx                             ← most-imported of the four
```

### Changes

1. **Pick the mounted custom context** (`components/toast/`) as the survivor — it is already
   wired into the root layout and `utils/toast.tsx` already fronts it, so this is the smallest
   migration. (Choosing sonner instead is defensible, but then you mount `<Toaster />` and
   migrate the other 12 call sites — more work for the same result.)

2. **Migrate the six sonner call sites** off `from 'sonner'`:
   `app/(dashboard)/dashboard/portfolios/page.tsx`,
   `components/dashboard/{create,edit,update}-portfolio-dialog.tsx`,
   `components/dashboard/portfolio-editor.tsx`,
   `components/public/portfolio-view.tsx`

3. **Delete the losers:** `components/ui/sonner.tsx`, `components/ui/toaster.tsx`,
   `components/ui/toast.tsx`, `components/ui/use-toast.ts`, `hooks/use-toast.tsx`, and the
   `sonner` dependency. This also clears **5 type errors** in `components/ui/toaster.tsx` for
   free.

4. **Move the inline copy to `constants/messages.ts`** while you are in these files. It currently
   holds only five keys while eleven user-facing strings sit inline — "Portfolio deleted",
   "Failed to load portfolios", "Resume data is missing" and so on. Also replace the two raw
   `alert()` calls in `components/appUI/modals/resumeUplaodModal.tsx:41,60` (L2), which block the
   page and look nothing like the rest of the app.

### Verification

```
grep -rn "from 'sonner'" --include='*.tsx' app components   # no matches
npm run typecheck 2>&1 | grep -c 'error TS'                 # ~81
```

Then exercise every migrated path in the browser — create, edit, delete and save a portfolio, and
download a resume from a public portfolio — confirming a visible toast each time. These are the
paths that have been silently failing.

### Exit criteria

- One toast system in the tree, mounted, with every call site pointing at it.
- All eleven previously-silent notifications visible.
- No user-facing string literal left inline in the files touched.

---

## Phase 6 — Zero the type errors and add CI

**Goal.** Get to zero, flip `ignoreBuildErrors`, and make regression impossible. This is the
longest phase; it is safe to split across several sessions.

Roughly 81 errors remain after Phases 1–5. Work them in this order — the first two groups unblock
real bugs, the rest are mechanical.

### 6a. Cover-letter type and client layer (~8 errors)

- `types/cover-letter.ts` is missing `CreateCoverLetterInput` and `UpdateCoverLetterInput`, which
  `lib/api/cover-letters/client.ts:2` and `app/api/cover-letters/route.ts:4` both import. The file
  already has `CoverLetterDraft` and `RequiredCoverLetterFields` to derive them from. Define them
  as the Zod-inferred types from Phase 3b so schema and type cannot drift.
- `lib/api/cover-letters/client.ts:1` imports `createClient` from `@/lib/supabase/client`, which
  exports `createClientComponentClient` and a `supabase` singleton — no `createClient`. Fix the
  import.
- `lib/api/cover-letters/client.ts:80` assigns `userId` to a `CoverLetter`, which uses snake_case
  on the wire. Settle on one casing at the API boundary and convert once.

### 6b. Resume data-shape migration (~35 errors)

`utils/migrateResumeData.tsx` (16), `components/ai-resume-modal.tsx` (12),
`components/custom-fields-section.tsx` (6) and `app/free-ats-resume-templates/create/Create.tsx`
(7) all touch the legacy-to-current resume shape. Phase 1 deleted the stale *templates*, but the
migration path itself is still untyped.

Type `migrateResumeData` explicitly against `Section` from `types/resume.ts` — its input is the
legacy keyed-`content` shape, its output the current `items` shape, and saying so in the signature
makes the remaining call-site errors self-explanatory. The `Create.tsx` errors are
`Property … does not exist on type 'never'`, which means a Supabase query result is being narrowed
to `never` — annotate the query's row type.

### 6c. Mechanical remainder (~38 errors)

`lib/supabase-functions.ts` (5), `services/resumeService.ts` (4), `lib/pdf-generator.ts` (4),
`lib/download-tracker.ts` (4 — ObjectId/schema mismatches), `components/toast/toast-context.tsx`
(3), `components/appUI/modals/DeleteConfirmModal.tsx` (3), `lib/profile.ts` (2),
`lib/mongo.ts` (2), `lib/compression.ts` (2), plus eight single-error files.

Fold **M7** in here: `lib/mongo.ts` caches the resolved `Db`, so concurrent cold requests each
construct a `MongoClient`. Cache the connect *promise* and hang it off `globalThis` so dev HMR
reuses one client instead of leaking one per reload.

### 6d. Flip the gate and add CI

1. Set `typescript.ignoreBuildErrors: false` in `next.config.mjs`. Delete the whole `typescript`
   block if nothing else lives in it.
2. Add `.github/workflows/ci.yml` running on pull requests:

   ```yaml
   - npm ci
   - npm run typecheck
   - npm run lint
   - npm run build
   - the Phase 3c NEXT_PUBLIC_ secret grep
   ```

3. Only now consider re-enabling the three rules Phase 0 carried over as `off`
   (`no-explicit-any`, `no-unused-vars`, `exhaustive-deps`). Turn them on one at a time as
   warnings first — `exhaustive-deps` in particular will surface real stale-closure bugs and
   deserves its own pass.

### Verification

```
npm run typecheck    # 0 errors
npm run lint         # 0 errors
npm run build        # succeeds with ignoreBuildErrors: false
```

Open a throwaway PR with a deliberate type error and confirm CI fails it.

### Exit criteria

- Zero type errors with the gate **on**.
- CI fails a PR that introduces a type error, a lint error, or a `NEXT_PUBLIC_` secret.
- The 184-error baseline from Phase 0 is closed out.

---

## Phase 7 — Standards, structure, polish

**Goal.** The remaining medium and low findings. No ship pressure; work these as you touch the
surrounding code. Grouped by the change that makes them worth doing together.

### 7a. One storage layer (M2)

`lib/local-storage.ts` (201 lines, resume CRUD) and `utils/localstorage.ts` (88 lines, typed key
helpers) overlap, and `Create.tsx` and `app/profile/page.tsx` each import **both**. Rebuild the
CRUD functions on top of the `utils/localstorage.ts` primitives so there is one keyspace and one
place that touches storage, then delete `lib/local-storage.ts`.

### 7b. Component placement and Core UI (M5)

38 feature components sit loose in `components/` and 22 more inside `app/<route>/` instead of
`components/appUI/`. The marketplace and blog components are the ones that actually hurt — they
are stranded where no other route can reuse them.

Separately, 41 raw `<button>`/`<input>` elements are used outside Core UI, **27 of them in
`components/visual-editor/`**, which hand-rolls its own toolbar buttons and confirm dialog rather
than composing `Button`. Start there: it is the densest cluster, and it needs an icon-button
variant in `components/ui/button.tsx` that carries `aria-label` — which also closes **L3** (six
icon-only controls with no accessible name).

Move files in small batches with the imports, one feature folder per commit, so review stays
readable.

### 7c. Server components for the two public pages (M6)

200 of 290 files are `"use client"`, and the eight fully-client pages are the exact eight missing
`metadata`. Six are private or dev routes and do not matter. `/contact` and `/cover-letter` are
public and listed in the sitemap, so they currently ship with no title or description: split a
server `page.tsx` that exports `metadata` over a client child.

Treat the broader client/server ratio as an observation, not a task — nothing here was measured,
and there is no evidence it is costing anything today.

### 7d. Naming and leftovers (L1, L4, L5)

- Rename the three misspelled files together, while the import sites are few:
  `components/toast/toast-contaner.tsx` (mounted in the root layout),
  `components/appUI/modals/resumeUplaodModal.tsx`,
  `components/appUI/Carausol/ResumeCarausol.tsx`.
- Gate `app/dev/parity` on `NODE_ENV`. `robots.ts` disallows `/dev/`, but that is a crawler hint,
  not access control.
- Set a real `name` in `package.json` (currently `my-v0-project`).
- Tokenise the hardcoded colors **in app chrome only** —
  `components/visual-editor/{StudioRightPanel,StudioCanvas,FloatingToolbar}.tsx`,
  `components/ui/logo.tsx`, `app/layout.tsx`. The 173-hex count is dominated by resume and
  cover-letter templates, where a fixed value must match the PDF and DOCX engines exactly; that is
  a defensible exception and deserves a comment saying so, not a refactor.

---

## Not in this plan

Two things the audit deliberately did not cover, both worth their own effort:

- **PDF/DOCX export fidelity.** The largest single subsystem here — roughly 2,000 lines across
  `lib/pdf-generators` and `lib/docx-generators` — was never verified for output correctness.
  Recent commit history suggests active work on export parity. `/dev/parity` is the right harness;
  give it a dedicated pass with a per-template checklist rather than folding it into the phases
  above.
- **Performance and accessibility measurement.** No Lighthouse run, no bundle analysis, no
  keyboard or contrast testing in a browser. Worth doing once Phase 6 lands and the build is
  trustworthy, so results are not confounded by the dead code Phase 1 removes.

Also deliberately excluded: adding a test suite. There is currently no test infrastructure at all,
and standing one up mid-remediation would compete with the ship-blockers. The CI in Phase 6d gives
you a real regression gate; pick a framework and start testing the export engines and
`migrateResumeData` once the phases above are closed.


---

## Outcome

Executed as phases 0-7, one commit each, on branch `qa-remediation`.

| Gate | Before | After |
| --- | --- | --- |
| Type errors | 184 (suppressed) | **0**, with the gate on |
| ESLint | could not start | **0 errors**, 33 tracked warnings, ratcheted |
| npm advisories | 9 (8 high) | **0** |
| Failing API routes | 8 of 14 | **0** |
| CI | none | typecheck + lint + build + secret scan |

### Where execution diverged from this plan

- **Phase 1 deleted more than planned.** 12 orphaned templates rather than the
  6 with errors, and phase 7d found `ResumeCarausol` was itself dead — it was the
  only importer of `ats-classic.tsx` and `google-resume.tsx`, so those went too.
  `components/resumes/` is now just the registry, the design factory and the
  shared canvas.
- **Phase 2 missed a route, caught in 6a.** The sweep grepped for un-awaited
  `cookies()` *calls* and missed `createServerComponentClient({ cookies })`,
  which passes the function by reference and fails identically. `POST
  /api/reviews` was still returning 500; review submission was dead too.
- **`@supabase/ssr` was not adopted.** Probing the adapter against a running
  server showed auth-helpers' types and runtime disagree — the form that
  typechecks throws, and the form that works does not typecheck. `requireUser()`
  keeps the working form behind a documented cast. The migration remains the
  real fix.
- **Most type debt deleted rather than got fixed.** Of 184 errors, ~130 were in
  code written against the pre-refactor resume shape that nothing rendered. The
  single largest genuine fix was one missing `Relationships` key in the
  hand-written Supabase `Database` type, which was collapsing every query result
  to `never` — 14 errors from one line.
- **Phase 6c and 7b found live bugs while typing**, none of which were in the
  original audit: the AI import preview read `parsedData.name` where the API
  returns `basics.name` (blank for every import), `review-component` passed
  `open` straight to `onClick` so React handed a MouseEvent to a redirect-path
  parameter, and `ai/track` read `.value` off `findOneAndUpdate`, which
  mongodb v6 does not return.
- **The component-placement move (M5) was not done wholesale.** The Core UI half
  was — 27 raw elements replaced, two new primitives, both hand-rolled confirm
  dialogs retired. Relocating 60 files was not: `app/**/_marketplace/` uses
  Next's `_`-prefix private-folder convention, and moving colocated route content
  would fight the framework for no functional gain. Best done per feature as that
  code is touched.

### Still outstanding

1. **Rotate the OpenRouter keys** (H4) and delete the removed variables from the
   Vercel Production, Preview and Development environments. `.env` is gitignored,
   so no commit can do this.
2. **31 react-hooks warnings** across 15 files — cascading setState in effects,
   components constructed during render, impure calls during render. Real, and
   they need restructuring rather than a sweep. CI blocks new errors; the ceiling
   stops the backlog growing.
3. **PDF/DOCX export fidelity** — still unverified, still the largest subsystem,
   still deserving its own pass through `/dev/parity` (now dev-gated).
4. **No test suite.** CI gives a regression gate; the export engines are the
   first thing worth actually testing.
5. **Authenticated paths verified only as an anonymous caller.** Every fix was
   confirmed to reject anonymous requests correctly, but signed-in flows —
   quota accounting, the credits ledger, ownership edge cases — were read, not
   exercised. Worth a manual pass before deploying.
