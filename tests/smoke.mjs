/**
 * Route smoke test.
 *
 * Boots a production server and visits every route, asserting that none of them
 * logs a console error or throws. That assertion is the whole point: the
 * hydration mismatch fixed in bed273d passed typecheck, lint, build and audit
 * while throwing on every page in production, because nothing was looking at
 * what the browser actually reported.
 *
 * Run with `npm run test:smoke` (expects `npm run build` to have run first).
 */
import { chromium } from "playwright"
import { spawn } from "node:child_process"
import { setTimeout as sleep } from "node:timers/promises"

/**
 * CI installs the browser Playwright manages, which is the default here.
 * SMOKE_CHROMIUM_PATH points at an existing Chrome/Chromium instead — useful on
 * a machine that cannot reach Playwright's CDN.
 */
const launchOptions = process.env.SMOKE_CHROMIUM_PATH
  ? { executablePath: process.env.SMOKE_CHROMIUM_PATH }
  : {}

// Deliberately not 3000 or 3005 — those belong to whoever is running `npm run dev`.
const PORT = Number(process.env.SMOKE_PORT ?? 3099)
const BASE = `http://127.0.0.1:${PORT}`
const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1440, height: 900 }

/** Routes the sitemap does not advertise but that must still render. */
const EXTRA_ROUTES = [
  "/free-ats-resume-templates/create?template=ats-classic",
  "/dashboard/portfolios",
  "/profile",
  "/settings",
  "/blog/ats-resume-guide",
]

/**
 * Errors that are environmental rather than the app's fault.
 *
 * Keep this list short and justified — every entry is a thing the gate can no
 * longer see. Anything added here needs a reason next to it.
 */
const IGNORED = [
  // No analytics/consent backends exist on a local production server, so the
  // requests these make are expected to fail here and only here.
  /net::ERR_(INTERNET_DISCONNECTED|NAME_NOT_RESOLVED|NETWORK_CHANGED|CONNECTION_REFUSED)/,
  // Favicon variants are resolved by the platform in deployment.
  /Failed to load resource.*favicon/i,
]

const isReal = (text) => !IGNORED.some((re) => re.test(text))

async function waitForServer(timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(3000) })
      if (res.ok) return
    } catch {
      // Server not up yet.
    }
    await sleep(1000)
  }
  throw new Error(`Server did not become ready on ${BASE}`)
}

/** Every path the sitemap claims is public, so new pages are covered automatically. */
async function routesFromSitemap() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p, i, a) => a.indexOf(p) === i)
}

async function visit(browser, route, viewport) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const errors = []

  page.on("pageerror", (err) => errors.push(err.message.split("\n")[0]))
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`)
  })

  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45_000 })
    // Hydration errors surface after the first paint, so give React a beat.
    await page.waitForTimeout(1200)
  } catch (err) {
    errors.push(`navigation: ${err.message.split("\n")[0]}`)
  }

  // A page that scrolls sideways on a phone is broken even if it logs nothing.
  const overflows =
    viewport === MOBILE &&
    (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2))

  await context.close()
  return { errors: errors.filter(isReal), overflows }
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  detached: true,
})

let failures = 0
try {
  await waitForServer()
  const routes = [...(await routesFromSitemap()), ...EXTRA_ROUTES]
  const browser = await chromium.launch(launchOptions)

  console.log(`\n  Smoke test — ${routes.length} routes on ${BASE}\n`)

  for (const route of routes) {
    const desktop = await visit(browser, route, DESKTOP)
    const mobile = await visit(browser, route, MOBILE)
    const problems = [
      ...desktop.errors.map((e) => `desktop: ${e}`),
      ...mobile.errors.map((e) => `mobile: ${e}`),
      ...(mobile.overflows ? ["mobile: horizontal overflow"] : []),
    ]

    if (problems.length) {
      failures++
      console.log(`  FAIL  ${route}`)
      for (const p of problems.slice(0, 4)) console.log(`          ${p.slice(0, 160)}`)
    } else {
      console.log(`  ok    ${route}`)
    }
  }

  await browser.close()
  console.log(
    failures === 0
      ? `\n  All ${routes.length} routes clean.\n`
      : `\n  ${failures} of ${routes.length} routes reported problems.\n`,
  )
} finally {
  process.kill(-server.pid, "SIGTERM")
}

process.exit(failures === 0 ? 0 : 1)
