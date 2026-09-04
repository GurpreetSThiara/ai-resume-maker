# Strict QA Audit — createfreecv.com

**Scope:** correctness, security, and code health.
**Branch:** `main` @ `06b9f95` · **Date:** 2026-09-04
**Stack:** Next 16.0.10 · React 19 · Supabase · MongoDB · 429 tracked files / 58,415 LOC

> Complements `AUDIT_REPORT.md` (SEO & policy compliance), which is not re-litigated here.
> Its "confirmed correct" items are taken as settled.

---

## Verdict

The presentation layer is in good shape — security headers, Supabase RLS, SEO plumbing and the
export engines are all sound. The problem is underneath: **this project moved to Next 16 without
the async-request-API migration**, and because `typescript.ignoreBuildErrors` is on and ESLint has
been silently broken since the ESLint 9 upgrade, nothing caught it.

Failures below were reproduced against a live server. Every cover-letter endpoint returns **500
instead of 401**; the AI resume import calls a model slug OpenRouter retired; and
`/api/ai/parse` spends the server's OpenRouter keys for anonymous callers with no auth and no
quota. **Cover letters, AI import, AI summary, and review voting are all dead in production.**

| Reading | Value |
| --- | --- |
| Live API routes failing at runtime | **8 / 14** |
| TypeScript errors, suppressed at build | **184** (45 files) |
| Working linter / tests / CI | **0** |
| npm advisories | **9** (8 high) |
| Parallel toast systems (1 mounted) | **4** |
| RLS · CSP · robots · sitemap | **Pass** |

**Legend** — `[VERIFIED]` reproduced by request against a running build.
`[STATIC]` found by compiler, config, and source analysis.

---

## CRITICAL — ship-blocking, features are dead in production

### C1. The Next 16 async-request migration was never done, so the whole cover-letter API 500s `[VERIFIED]`

In Next 16 `cookies()` returns a Promise and route `params` is a Promise. Six call sites pass
`cookies()` un-awaited into `createRouteHandlerClient`, and three handlers destructure `params`
synchronously. The auth check never runs — the handler throws first, so an unauthenticated request
gets a 500 rather than a 401, and each failure also raises an `unhandledRejection`.

```
$ curl -X POST /api/cover-letters      → HTTP 500   (expected 401)
$ curl      GET  /api/cover-letters/abc  → HTTP 500   (expected 401)

server: TypeError: this.context.cookies is not a function
server: ⨯ unhandledRejection: TypeError: this.context.cookies is not a function

un-awaited cookies()        app/api/cover-letters/route.ts:8,38
                            app/api/cover-letters/[id]/route.ts:10,51,105
                            app/api/ai/generate-summary/route.ts:6
un-awaited async factory    app/api/openrouter/route.ts:11
                            app/api/ai/track/route.ts:19
                            app/api/ai/usage/route.ts:15
sync params destructure     app/api/cover-letters/[id]/route.ts:7,48,102
```

The second group is the same class of bug from a different angle: `lib/supabase/server.ts:5`
declares `createServerComponentClient` as `async` (it awaits `cookies()` internally), but three
routes call it without `await` and then read `.auth` off the Promise. That takes
`/api/openrouter`, `/api/ai/track` and `/api/ai/usage` down too — including the credit-metering
path.

**Fix.** `await cookies()` at every call site and `await` the client factory; change the three
handler signatures to `{ params }: { params: Promise<{ id: string }> }` and `await params`. Then
drop `typescript.ignoreBuildErrors` (H5) — the compiler already flags all twelve of these.

---

### C2. AI resume import calls a model slug OpenRouter has retired `[VERIFIED]`

The model id is hardcoded in two routes as `openai/gpt-oss-20b:free`. That free tier no longer
exists; the provider answers 404 and names the replacement slug in the error. The retry wrapper
only retries on 429, so a 404 falls straight through to a bare `500 Internal Server Error` with no
message the UI can show.

```
$ curl -X POST /api/ai/parse -d '{"text":"..."}'  → HTTP 500

server: Error generating resume: Error: 404 This model is unavailable for free.
        The paid version is available now - use this slug instead: openai/gpt-oss-20b
          at async callAIWithRetry (app/api/ai/parse/route.ts:15)

app/api/ai/parse/route.ts:16             model: "openai/gpt-oss-20b:free"
app/api/ai/generate-summary/route.ts:61  model: "openai/gpt-oss-20b:free"
```

**Fix.** Move the slug to `config.ts` as a single env-backed value — a vendor model id is exactly
the tunable that should never be inlined twice — and point it at a model that exists. Add
404/model-unavailable to the error mapping so the UI can say what happened.

---

### C3. Anonymous callers can spend your OpenRouter credits `[VERIFIED]`

`/api/ai/parse` is the one route that calls a billed provider with no identity check and no quota.
An unauthenticated POST reached OpenRouter using the server's key — the request only failed because
of C2, not because anything stopped it. Every sibling AI route gates on a session and checks a
monthly USD ceiling; this one checks a 1 MB body size and nothing else.

| Route | Auth | Per-user quota |
| --- | --- | --- |
| `/api/ai/generate-summary` | yes | `credits_remaining` |
| `/api/ai/usage` | yes | — |
| `/api/ai/track` | yes | — |
| `/api/openrouter` | yes | `monthUsdLimit` |
| **`/api/ai/parse`** | **NONE** | **NONE** ← billed provider, wide open |

**Fix.** Gate it with `getUser()` and meter it through the same `ai_usage` ceiling
`/api/openrouter` already uses. If anonymous import is a deliberate funnel feature, then it needs
an IP-keyed rate limit and its own hard spend cap instead — but shipping it ungated is a blank
cheque.

---

### C4. AI summary calls `.chat` on the client factory, not a client `[STATIC]`

`lib/openrouter.ts:59` exports the factory under an instance-shaped name:
`export { createOpenRouterClient as openRouter }`. The parse route calls it correctly as
`openRouter()`; the summary route treats it as an object. `openRouter.chat` is `undefined`, so the
request throws on property access before any network call.

```
app/api/ai/generate-summary/route.ts:50
  const response = await openRouter.chat.completions.create({ ... })
                         ^ openRouter is () => OpenAI, so .chat is undefined

tsc: error TS2339: Property 'chat' does not exist on type '() => OpenAI'.
```

**Fix.** Call `openRouter()`, and rename the export to `createOpenRouterClient` so the next caller
can't make the same mistake.

---

## HIGH — security exposure and missing safety net

### H1. Mass assignment lets a caller hand their cover letter to another account `[STATIC]`

The PUT handler correctly verifies ownership, then spreads the raw request body into the update.
`user_id`, `id` and `created_at` are all writable, so an authenticated user can reassign a row they
own to any user id they choose — or overwrite fields the API was never meant to expose.

```
app/api/cover-letters/[id]/route.ts:76
  .update({ ...body, updated_at: new Date().toISOString() })
            ^ body is unvalidated JSON straight off the wire
```

**Fix.** Pick fields explicitly, or validate with a Zod schema that strips unknown keys — `zod` is
already a dependency and no route uses it yet. Same treatment for the POST handler.

---

### H2. `getSession()` used for server-side authorization in six places `[STATIC]`

Supabase documents `getSession()` as reading the session from the cookie without revalidating it
against the auth server, and warns against trusting it on the server; `getUser()` is the verified
path. Most of the codebase already gets this right — `lib/supabase-functions.ts` uses `getUser()`
in all seven of its checks — so this is drift in one corner, not a house style.

```
getSession() — unverified   app/api/cover-letters/route.ts:9,39
                            app/api/cover-letters/[id]/route.ts:11,52,106
                            app/api/ai/generate-summary/route.ts:7
getUser() — verified        app/api/reviews/route.ts:9
                            app/api/openrouter/route.ts:21
                            lib/supabase-functions.ts (×7)
```

**Fix.** Swap all six to `getUser()`. Do it in the same pass as C1 — those are the same three
files. Also worth planning the move off `@supabase/auth-helpers-nextjs`, which is deprecated in
favour of `@supabase/ssr` and is not Next 16-aware.

---

### H3. Review voting reads the wrong request field, so it can never succeed `[VERIFIED]`

Both handlers live under a `[reviewId]` dynamic segment but read
`searchParams.get('reviewId')`. The client calls them with the id in the path and no query string,
so the lookup is always `null` and every request 400s. "Helpful" and "Report" have never worked.
Both routes are also unauthenticated and uncapped, so once the id is read from the right place they
become a one-line vote amplifier.

```
$ curl -X POST /api/reviews/xyz/helpful  → HTTP 400 {"error":"Review ID is required"}

app/api/reviews/[reviewId]/helpful/route.ts:7   searchParams.get('reviewId')  ← always null
app/api/reviews/[reviewId]/report/route.ts:6    searchParams.get('reviewId')  ← always null
components/review-component.tsx:106             fetch(`/api/reviews/${reviewId}/helpful`)
components/review-component.tsx:121             fetch(`/api/reviews/${reviewId}/report`)
```

**Fix.** Read `const { reviewId } = await params`. While you're in there, require a session or an
IP-keyed rate limit and record one vote per user per review, so the counter means something.

---

### H4. Your OpenRouter keys are duplicated under a client-exposed variable name `[VERIFIED]`

`.env` holds the same 147-character `sk-or-…` value twice, once as `OPENROUTER_API_KEYS` and once
as `NEXT_PUBLIC_OPENROUTER_API_KEYS`. Anything prefixed `NEXT_PUBLIC_` is inlined into the browser
bundle wherever it is referenced. **It has not leaked yet** — the built client assets and
`public/` were grepped and the key is absent, because no code reads that variable. But it is one
import away from shipping every key to every visitor, and if the same variable is set in the Vercel
environment the next reference bakes it into the bundle.

```
.env  OPENROUTER_API_KEYS=…              147 chars
.env  NEXT_PUBLIC_OPENROUTER_API_KEYS=…  147 chars — identical, sk-or- prefixed

code references to NEXT_PUBLIC_OPENROUTER_API_KEYS   0
grep sk-or- .next/static public/                     0 matches  ← not leaked today
```

**Fix.** Delete the line from `.env` and from every deployment environment, then **rotate the
keys** — a secret that has been sitting under a publicly-prefixed name should be treated as
compromised rather than audited. Same clean-up for `ENCRYPTION_KEY`, `GOOGLE_CLIENT_SECRET` and the
three `EXPO_PUBLIC_*` vars, none of which any code reads.

---

### H5. Every static-analysis gate is switched off or silently broken `[VERIFIED]`

This is the finding that produced all the others. Nothing in this repo can fail a bad change: the
TypeScript gate is explicitly disabled while 184 errors accumulate behind it, ESLint has been
unable to start since the ESLint 9 upgrade, the `lint` script invokes a command Next 16 removed,
and the config key meant to suppress lint is now unrecognised — Next prints that warning on every
boot. There are no tests and no CI workflow.

```
next.config.mjs   typescript.ignoreBuildErrors: true   ← hides 184 errors / 45 files
next.config.mjs   eslint.ignoreDuringBuilds: true      ← key removed in Next 16
boot warning      ⚠ Unrecognized key(s) in object: 'eslint'
$ npx eslint .    ESLint couldn't find an eslint.config.(js|mjs|cjs) file   (.eslintrc.json is v8 format)
$ npx next lint   error: unknown option '--format'                         (next lint removed)
tests             none          .github/workflows   none

worst-affected    24  components/resumes/ats-green-headers.tsx
                  20  components/resumes/ats-elegant.tsx
                  16  utils/migrateResumeData.tsx
                  14  components/resumes/modern-resume.tsx
                  12  components/ai-resume-modal.tsx
```

The errors are not cosmetic. Beyond C1 and C4 the compiler is flagging real breakage:
`lib/api/cover-letters/client.ts:1` imports `createClient` from a module that doesn't export it,
`types/cover-letter.ts` is missing the `CreateCoverLetterInput` / `UpdateCoverLetterInput` types
three files import, and `lib/download-tracker.ts` has three ObjectId/schema mismatches. Roughly
two-thirds of the remaining errors are in the resume template components, where the `Section` union
doesn't match how templates read `.content`.

**Fix.** Port `.eslintrc.json` to `eslint.config.mjs` flat config, drop the dead `eslint` key, and
point `npm run lint` at `eslint .`. Then set `ignoreBuildErrors: false` and work the 184 down —
start with the ~40 in `app/`, `lib/` and `services/`, which are live server paths, and fix the
`Section` union once to clear most of the template errors as a block. Add a CI workflow running
typecheck and lint on PRs so this can't silently regress again.

---

### H6. Sonner toasts are never rendered, so the dashboard gives no feedback `[STATIC]`

Six files in the portfolio and dashboard flow import `toast` from `sonner`, but sonner's
`<Toaster />` is not mounted anywhere. `app/layout.tsx:131` mounts only the hand-rolled
`ToastContainer`, and shadcn's `<ToastProvider>` in `components/ui/toaster.tsx` is unmounted too.
Every one of those eleven success and error toasts is a silent no-op — including "Portfolio
deleted", "Portfolio created" and "Failed to save portfolio".

```
mounted       app/layout.tsx:131   <ToastContainer />   ← components/toast/ (custom)
not mounted   components/ui/sonner.tsx        <Toaster />   ← never rendered
not mounted   components/ui/toaster.tsx  <ToastProvider>   ← shadcn, unused

callers left silent   app/(dashboard)/dashboard/portfolios/page.tsx
                      components/dashboard/{create,edit,update}-portfolio-dialog.tsx
                      components/dashboard/portfolio-editor.tsx
                      components/public/portfolio-view.tsx
```

**Fix.** Pick one toast system and delete the other three (M1). Whichever you keep, point the six
dashboard files at it — the fastest correct move is to migrate those imports to the mounted
`components/toast` context, then remove `sonner`, `hooks/use-toast.tsx`,
`components/ui/use-toast.ts`, `components/ui/toast.tsx`, `components/ui/toaster.tsx` and
`utils/toast.tsx`.

---

### H7. Nine open advisories, and five dependencies float on `latest` `[VERIFIED]`

`npm audit` reports 9 vulnerabilities, 8 of them high, and one is `next` itself. All are fixable
with `npm audit fix`. Separately, five dependencies are pinned to the string `"latest"`, which
makes any fresh install non-reproducible — a lockfile refresh can silently move Radix or the
Supabase client a major version. Two lockfiles are also checked in (`package-lock.json` plus a
92-byte `pnpm-lock.yaml` stub), so which package manager a fresh CI runner uses is ambiguous.

```
high      next, browserslist, lodash, nanoid, postcss, preact, sharp, ws
moderate  fflate

"latest"  @radix-ui/react-dropdown-menu · react-progress · react-switch · react-tabs
          @supabase/supabase-js
```

**Fix.** Run `npm audit fix`, pin the five `latest` entries to the versions currently resolved in
the lockfile, and delete `pnpm-lock.yaml`.

---

## MEDIUM — duplication, dead weight, standards drift

**M1. Four parallel toast systems coexist.** A hand-rolled context, shadcn's `use-toast`, `sonner`,
and a fourth wrapper in `utils/toast.tsx` — which is the most-imported of the four. One
notification concern, four implementations, one of them mounted. Root cause of H6; consolidating
fixes both.
`components/toast/` · `hooks/use-toast.tsx` · `components/ui/use-toast.ts` · `utils/toast.tsx` · `sonner`

**M2. Two localStorage layers, both live.** `lib/local-storage.ts` (201 lines, resume CRUD) and
`utils/localstorage.ts` (88 lines, typed key helpers) overlap, and `Create.tsx` and
`profile/page.tsx` each import *both*. Fold the CRUD functions onto the `utils/localstorage.ts`
primitives so there is one keyspace and one place that touches storage.

**M3. Download tracking never records an IP.** `request.ip` was removed from `NextRequest`, so the
expression always falls through to the header reads. It works by accident — but the compiler flags
it (`TS2339`) and the leading term is dead. Drop `request.ip` and read `x-forwarded-for` directly,
taking the first hop.
`app/api/track-download/route.ts:18`

**M4. Dead code and dead config shipped in the repo.** Three `.new.tsx` components imported
nowhere, a 38 KB `scratch.js` at the root, and two imports in the root layout whose only usage is
commented out — so `@vercel/analytics` is bundled but never rendered. Removing these shrinks the
layout's client graph for free.
`components/{resume-preview,review-section,skills-section}.new.tsx` · `scratch.js` · `app/layout.tsx:6,10,124,132`

**M5. Component placement and Core-UI rules are widely bypassed.** 38 feature components sit loose
in `components/` and 22 more inside `app/<route>/`, rather than `components/appUI/` — the
marketplace and blog components in particular are stranded where no other route can reuse them.
Separately, 41 raw `<button>`/`<input>` elements are used outside Core UI, 27 of them in
`components/visual-editor/`, which hand-rolls its own toolbar buttons and confirm dialog instead of
composing `Button`.

**M6. Client components are the default, costing two public pages their metadata.** 200 of 290
files in `app/` and `components/` are `"use client"`, and eight pages are client-rendered end to
end — which is why those eight are the exact set missing `metadata`. Six are private or dev routes
and don't matter, but `/contact` and `/cover-letter` are public and listed in the sitemap, so they
ship with no title or description. Split a server `page.tsx` that exports `metadata` over a client
child.

**M7. Mongo connection cache can open a client per concurrent cold request.** `getMongoDb` caches
the resolved `Db`, so requests arriving before the first `connect()` settles all miss the cache and
each construct a `MongoClient`. Cache the connect *promise* instead, and hang it off `globalThis`
so dev HMR reuses one client rather than leaking one per reload.
`lib/mongo.ts:6-30`

---

## LOW — polish

**L1. Misspelled filenames are shipped and imported.** Three files carry typos that every import
has to reproduce — including the toast container mounted in the root layout. Rename them together
while the import sites are few.
`toast-contaner.tsx` · `resumeUplaodModal.tsx` · `Carausol/ResumeCarausol.tsx`

**L2. Two raw `alert()` calls in the upload modal.** File-size and file-type errors use the
browser's native `alert()`, which blocks the page and looks nothing like the rest of the app. Route
them through the toast system, and move the copy into `constants/messages.ts` — which currently
holds only five keys while eleven user-facing strings sit inline in components.
`components/appUI/modals/resumeUplaodModal.tsx:41,60`

**L3. Icon-only controls rely on `title` alone.** Six controls give screen readers no accessible
name — the visual editor's move-up, move-down and delete buttons, and the preview close button.
`title` is not a reliable substitute; add `aria-label`.
`components/visual-editor/FloatingToolbar.tsx:56-58` · `app/profile/page.tsx:486`

**L4. Hardcoded colors in UI chrome.** 173 raw hex values sit outside `globals.css`. Most are in
resume and cover-letter templates, where a fixed value has to match the PDF and DOCX engines
exactly — that's a defensible exception worth a comment, not a refactor. The ones actually worth
tokenising are the app chrome: the visual editor panels, the logo, and the root layout.
`components/visual-editor/{StudioRightPanel,StudioCanvas,FloatingToolbar}.tsx` · `components/ui/logo.tsx` · `app/layout.tsx`

**L5. Dev harness and placeholder project name ship to production.** `/dev/parity` is reachable in
production — `robots.ts` disallows `/dev/`, but that's a crawler hint, not access control. Gate it
on `NODE_ENV`. And `package.json` still reads `"name": "my-v0-project"`.

---

## Verified sound — no action needed

- **Supabase RLS is complete** on `portfolios` — owner-scoped select, insert, update and delete
  policies plus a separate `is_public = true` read policy. The public portfolio route can't read
  private rows.
- **OpenRouter keys are server-only in code.** `lib/openrouter.ts` reads the non-public variable,
  the client is constructed per request inside route handlers, and no key appears in any built
  asset. H4 is about the `.env` duplicate, not the code path.
- **Ownership is genuinely checked** before cover-letter update and delete — the flaw in H1 is the
  unfiltered payload, not a missing authorization check.
- **Security headers are set and scoped:** CSP with `object-src 'none'`, `base-uri 'self'` and
  `frame-ancestors 'self'`, plus nosniff, `X-Frame-Options` and a strict referrer policy.
  `connect-src` and `img-src` are allow-listed rather than wildcarded, and the `unsafe-inline` on
  `script-src` carries a comment explaining the GTM constraint.
- **The one meaningful `dangerouslySetInnerHTML` is escaped** — `components/seo/JsonLd.tsx`
  replaces `<` with the string `\u003c` before injection. The only other use is shadcn's chart component.
- **SEO plumbing is careful.** `sitemap.ts` uses a fixed `lastModified` rather than `new Date()`
  and deliberately excludes non-canonical blog slugs; `robots.ts` disallows the private routes.
  Both carry comments explaining why.
- **The immutable `Cache-Control` on `/_next/static` is correctly gated to production only**, with
  a comment on why applying it in dev breaks HMR.
- **No missing image `alt` attributes** anywhere in `app/` or `components/`.
- **Error and 404 boundaries exist** (`app/error.tsx`, `app/not-found.tsx`). Worth adding
  `global-error.tsx`, which would have surfaced C1's unhandled rejections.
- The two `/api/export/*` routes returning **410 Gone** are intentional and documented — export
  moved to client helpers. They are excluded from the 8-of-14 figure.

---

## Order of work

Sequenced so each step makes the next one safe.

1. **Restore the safety net first** — flat-config ESLint, fix the `lint` script, drop the dead
   `eslint` config key, and set `ignoreBuildErrors: false`. Do this *before* the fixes, not after:
   the compiler then points at every C1 and C4 site for you instead of you hunting them by hand.
   *(H5)*
2. **Complete the Next 16 async migration** — await `cookies()` and the client factory, await
   `params`, and swap the six `getSession()` calls to `getUser()` in the same pass; it's the same
   three files. Revives cover letters, AI summary, credit metering and usage reporting together.
   *(C1 · H2)*
3. **Close the spend and write exposures** — gate and meter `/api/ai/parse`, replace the `...body`
   spread with an explicit field list or a Zod schema, delete the `NEXT_PUBLIC_` key variable
   everywhere and rotate the keys. *(C3 · H1 · H4)*
4. **Repair the broken features** — move the model slug to config and point it at a live model,
   call `openRouter()` as a function, and read `reviewId` from `params`. Then `npm audit fix` and
   pin the five floating dependencies. *(C2 · C4 · H3 · H7)*
5. **Consolidate to one toast system** — choose one of the four, migrate the six dashboard files
   onto it, delete the rest. The single change that makes the portfolio flow give feedback again.
   *(H6 · M1)*
6. **Add CI, then pay down the rest** — a workflow running typecheck and lint on every PR, so none
   of the above can silently regress. After that the medium and low findings are safe to work
   incrementally, starting with the duplicate storage layers and the `Section` union, which
   together clear most of the remaining compiler errors. *(H5 · M2–M7 · L1–L5)*

---

## What this audit did not cover

- **No production build was run.** `next build` writes to `.next/` and would disturb the dev
  workflow, so build-time behaviour is inferred from `tsc`, the config, and a dev-server boot.
  `[VERIFIED]` findings were reproduced against a dev server on a spare port, which was shut down
  afterwards; the working tree was left unchanged.
- **Authenticated paths were probed only as an anonymous caller.** C1 and H3 reproduce without a
  session, but the logic behind each auth gate — quota accounting, ownership edge cases, the
  credits ledger — was read, not exercised.
- **No performance measurement.** No Lighthouse run, no bundle analysis, no Core Web Vitals. M6's
  client-component ratio is a structural observation, not a measured regression.
- **No browser accessibility pass.** Findings come from source analysis; keyboard traversal, focus
  order and contrast ratios were not tested in a browser.
- **The PDF and DOCX export engines were not verified for output fidelity** — the largest single
  subsystem here (roughly 2,000 lines across `lib/pdf-generators` and `lib/docx-generators`).
  Recent commits suggest active work on export parity; `/dev/parity` is the right harness for that
  and deserves its own pass.
- **The prior `AUDIT_REPORT.md` was not re-litigated.** It covers SEO and policy compliance; this
  audit covers correctness, security and code health.
