# Hardening Plan

Follows `REMEDIATION_PLAN.md`, whose eight phases are complete. This one covers
what the browser test pass found afterwards, plus the work that pass proved was
still missing.

**Branch:** `qa-remediation` @ `bed273d` · **Written:** 2026-09-12

## What the test pass changed about the priorities

The headline finding is already fixed (Phase 0 below), but *how* it was found is
what should shape the rest of the work:

1. **The bug was invisible to every gate we had.** Typecheck, lint, build and
   `npm audit` all passed while every page in production threw a hydration
   error and re-rendered itself on the client. It took a real browser against a
   production build to see it. That is the gap Phase 1 closes.
2. **Dev mode had been stripped of its own error reporting.** The CSP withheld
   `'unsafe-eval'`, which React needs in development to report hydration diffs.
   The bug was undiagnosable in dev and minified in prod — which is why it
   survived so long.
3. **It was not a one-off, it was a bug *class*.** `useWindowSize` read
   `window` in a `useState` initialiser. The `react-hooks/purity` warnings we
   are currently ignoring point at exactly this family of defect. Phase 2 hunts
   the rest deliberately rather than waiting for the next one to surface.

| Phase | Goal | Status |
| --- | --- | --- |
| 0 | Hydration fix + dev diagnostics | **done** — `bed273d` |
| 1 | Make the gate that would have caught it | **done** — `bf74ccb` |
| 2 | Hunt the same bug class | **done** — `bc342e0` |
| 3 | `set-state-in-effect` backlog | **done** — `d8d015c`, `65955d5` |
| 4 | A committed test suite | **done** — `ec8785b` |
| 5 | Signed-in coverage | blocked — needs a test account |
| 6 | `@supabase/ssr` migration | pending (~4h) |
| 7 | Deferred product calls | pending |

**Where the warning backlog landed.** 35 → 18. `purity`, `immutability` and
`refs` are enforced as errors. The eight remaining `set-state-in-effect` hits
are effects doing what effects are for — awaiting a fetch, or reading
localStorage after mount, which is what keeps that read out of the server
render. Driving those to zero would mean reintroducing the class of bug Phase 0
fixed, so they stay. The rest are `static-components` (5) and four one-offs,
all cosmetic.

**What the gates catch now.** `npm test` runs 38 unit tests, 27 routes checked
in a real browser for console errors and mobile overflow, and 10 flow
assertions including a PDF and a DOCX downloaded and checked for valid file
magic. All of it runs in CI on every PR. Both gates were verified to fail on a
deliberately reintroduced regression.

---

## Phase 0 — Done (`bed273d`)

Recorded here because the rest of the plan builds on it.

- **`hooks/use-window-size.ts`** seeded state from `window.innerWidth` when
  `window` existed. The server has no window, so it rendered `width: 0`; the
  client's first render — the one React hydrates against — read the real width.
  The navbar derives its visible-link count from that width, so the trees
  disagreed and React threw away the server HTML and re-rendered the entire page
  on the client. Minified error #418, every route. Seeding zeros makes both
  sides agree; the existing effect fills in the true size on mount.
- **CSP now allows `'unsafe-eval'` in development only**, restoring React's
  hydration diagnostics. Production is unchanged.
- **The root layout's hand-written `<meta name="viewport">`** duplicated the tag
  Next emits. Moved to the `viewport` export with `viewportFit` preserved, so
  `env(safe-area-inset-*)` still works for the mobile bottom nav.

Verified: eight routes that each reported an error now report none, and the
navbar still shows 6/4/3 links at xl/lg/md.

---

## Phase 1 — Build the gate that would have caught this

**Goal.** No route may regain a console error without CI failing. This is the
highest-value phase in the plan: it converts a class of invisible production bug
into a build failure.

### Changes

1. **Commit a headless smoke check.** The throwaway scripts used during the test
   pass proved the approach; make them real. `playwright-core` as a devDependency
   (the browser is already cached on dev machines and CI can fetch it), a single
   spec that:
   - builds, runs `next start`, and visits every route in the sitemap plus the
     editor and dashboard;
   - asserts **zero** `pageerror` and zero `console.error` per route;
   - asserts no horizontal overflow at 390px.

   The assertion that matters is the error count, because that is precisely what
   was silently non-zero for the entire life of this bug.

2. **Wire it into the existing CI workflow** after `build`, so a PR that
   reintroduces a hydration mismatch cannot merge.

3. **Fix dev HMR while you are in the CSP.** `connect-src` has no `ws:` entry, so
   the dev websocket handshake fails on every page load and HMR silently does not
   work. Same dev-only treatment as `'unsafe-eval'`:

   ```
   connect-src 'self' … ${dev ? "ws://localhost:* ws://127.0.0.1:*" : ""}
   ```

### Verification

Break it on purpose and confirm the gate catches it: revert
`hooks/use-window-size.ts` to the `typeof window` form, run the suite, watch it
fail with a non-zero error count on every route, then restore. Confirm HMR
actually reloads on a file save.

### Exit criteria

- CI fails a PR that introduces a console error on any route.
- `npm run dev` reloads on save with no websocket errors in the console.

---

## Phase 2 — Hunt the same bug class deliberately

**Goal.** Find the rest of the impure-render defects now, rather than one
production incident at a time.

The `react-hooks` warnings were switched off in the old `.eslintrc.json` and are
currently reported but not enforced. Three groups are the same family as the bug
just fixed:

```
react-hooks/purity          3   ← the rule that describes useWindowSize exactly
react-hooks/immutability    3
react-hooks/refs            2
```

### Changes

1. **Fix those 8 warnings**, then turn those three rules to `error` so they
   cannot come back. They are a small, bounded set — unlike Phase 3.

2. **Audit every `typeof window` / `typeof document` reachable during render.**
   `useWindowSize` will not be the only one. Anything in a `useState`
   initialiser, a module-level const consumed by a component, or a render body
   is a hydration mismatch waiting to happen. The correct shape is always: a
   server-safe initial value, with the real value set in an effect.

3. **`components/layout/footer.tsx:11` — `new Date().getFullYear()`.** On a
   statically prerendered page this bakes the build-year into the HTML. It is
   not currently a mismatch (build and today agree), but on 1 January every
   static page shows last year until something triggers a redeploy. Either
   compute it in an effect or accept it explicitly with a comment — but decide,
   rather than leaving it as an accident that happens to work.

### Verification

Phase 1's suite, plus a grep that returns nothing:

```
grep -rn "typeof window" --include='*.tsx' --include='*.ts' app components hooks \
  | grep -v useEffect
```

### Exit criteria

- Zero `purity`, `immutability` and `refs` warnings, all three rules enforced.
- No `typeof window` guard reachable from a render path.

---

## Phase 3 — The `set-state-in-effect` backlog

**Goal.** Work down the 15 remaining warnings, which are the ones needing real
restructuring rather than a one-line fix.

`react-hooks/set-state-in-effect` flags state set in an effect in response to
props or other state — a pattern that causes a second render pass and, in the
worst cases, a render loop. The clusters:

```
3  components/personal-info-section.tsx      2  app/image-converter/ImageConverter.tsx
1  hooks/use-template-selector.ts            1  components/visual-editor/useEditorHistory.ts
1  hooks/use-auth.ts                         1  components/toast/toast-context.tsx
1  hooks/use-ai.tsx                          1  components/resumes/shared/ConfigurableResume.tsx
…plus single warnings across 6 further files
```

Each wants one of: derive the value during render instead of storing it, key the
component to reset state, or `useSyncExternalStore` for genuinely external state.

Do it **one file per commit**, running Phase 1's suite between each — this is the
phase most likely to cause a visual regression, and the small commits are what
make a bisect cheap if one slips through.

`ConfigurableResume` is the highest-risk file in the list; leave it last, and pair
it with an export comparison against the previous commit.

### Exit criteria

- Zero `set-state-in-effect` warnings, rule enforced.
- No visual or export regression across the template matrix.

---

## Phase 4 — A test suite that actually exists

**Goal.** Replace "I tested it once" with something that runs on every PR. Right
now there is still no test infrastructure; Phase 1 adds a smoke gate, this adds
real coverage.

1. **Vitest for the pure logic** — no framework is installed yet, so this is a
   from-scratch setup. Start where the logic is dense and side-effect free:
   - `facetCounts` / `filterAndSort` / `colorFamilyOf` (the filter maths, whose
     relaxed-group behaviour is subtle and currently guaranteed by nothing);
   - `migrateResumeData` (the legacy-to-current shape conversion);
   - `consentRegionForCountry` and the consent helpers.

2. **Playwright for the flows** Phase 1's smoke check only touches shallowly:
   apply a filter and assert the grid, open the mobile sheet, export a PDF and
   a DOCX and assert the file magic bytes. The export assertions matter most —
   that subsystem is ~2,000 lines and had never been tested before this week.

3. **Both in CI**, with the Playwright browser cached between runs.

### Exit criteria

- `npm test` runs unit and browser suites.
- CI runs both on every PR.
- Export coverage for at least one template per layout family.

---

## Phase 5 — Signed-in coverage (needs you)

**Goal.** Close the largest remaining hole. Every automated check so far has run
as an anonymous caller. The signed-in paths have been *read*, never *executed*.

Blocked on a decision only you can make: a dedicated test Supabase project, or a
seeded test account in the existing one. Once that exists:

- cover-letter create / read / update / delete against real RLS;
- the mass-assignment defence — a `PUT` with a foreign `user_id` must be
  rejected, and the row must be unchanged afterwards (currently proven only by
  testing the Zod schema in isolation, never over the wire);
- AI quota accounting — that the monthly ceiling actually stops the Nth request;
- review voting — that the once-per-user constraint holds on a second vote.

Until this phase lands, treat signed-in behaviour as unverified regardless of
what the other gates say.

---

## Phase 6 — Move off the deprecated Supabase auth helpers

`@supabase/auth-helpers-nextjs` is deprecated in favour of `@supabase/ssr` and is
not Next 16-aware — the async-`cookies()` migration in the earlier plan was
working around exactly that. Only two files import it:

```
app/(dashboard)/dashboard/portfolios/page.tsx
lib/api/auth.ts
```

Small surface, but it touches every authenticated route through `requireUser`, so
it wants Phase 5's coverage in place first. Sequenced here for that reason.

---

## Phase 7 — Deferred, and deliberately so

- **URL-synced filters.** Standard for a storefront and good for shareability,
  but `AUDIT_REPORT.md` records the *absence* of query-param URLs on this page as
  the reason it has no canonical-duplication risk. Doing it properly means a
  canonical strategy decided at the same time — a product call, not a cleanup.
- **Remaining low-severity lint**: `static-components` (5), `next/no-img-element`
  (2), `no-unused-expressions` (1), `error-boundaries` (1),
  `no-anonymous-default-export` (1). Cosmetic; fold into whatever file you next
  touch rather than a dedicated pass.

---

## Not a commit — these need you

Carried forward from `REMEDIATION_PLAN.md` and still outstanding, because `.env`
is gitignored and deployment config lives outside the repo:

1. **Rotate the OpenRouter keys.** A secret that sat under a `NEXT_PUBLIC_` name
   should be treated as compromised. Unverifiable from here.
2. **Remove the deleted variables from the Vercel environments** — Production,
   Preview and Development each — starting with
   `NEXT_PUBLIC_OPENROUTER_API_KEYS` and the seven unused vars dropped earlier.
