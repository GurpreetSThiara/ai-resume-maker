/**
 * Flow tests — the interactions the route smoke test only touches shallowly.
 *
 * Covers the marketplace filters and, more importantly, the PDF and DOCX export
 * engines: roughly 2,000 lines across lib/pdf-generators and lib/docx-generators
 * that had no automated coverage at all before this suite.
 *
 * Run with `npm run test:flows` (expects `npm run build` to have run first).
 */
import { chromium } from "playwright"
import { spawn } from "node:child_process"
import { setTimeout as sleep } from "node:timers/promises"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const launchOptions = process.env.SMOKE_CHROMIUM_PATH
  ? { executablePath: process.env.SMOKE_CHROMIUM_PATH }
  : {}

const PORT = Number(process.env.SMOKE_PORT ?? 3098)
const BASE = `http://127.0.0.1:${PORT}`

/** One template per layout family, so both export paths are exercised. */
const EXPORT_TEMPLATES = ["ats-classic", "modern-sidebar"]

/** File magic each format must start with; a truncated or HTML error page fails. */
const MAGIC = { pdf: "25504446", docx: "504b0304" }

let pass = 0
let fail = 0
const check = (name, ok, detail = "") => {
  if (ok) pass++
  else fail++
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`)
}

async function waitForServer(timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      if ((await fetch(BASE, { signal: AbortSignal.timeout(3000) })).ok) return
    } catch {
      // not up yet
    }
    await sleep(1000)
  }
  throw new Error(`Server did not become ready on ${BASE}`)
}

async function testFilters(browser) {
  console.log("\n  Marketplace filters")
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(`${BASE}/free-ats-resume-templates`, { waitUntil: "networkidle" })

  const designCount = async () =>
    Number((await page.locator("text=/\\d+ designs?/").first().innerText()).match(/(\d+) design/)[1])

  const baseline = await designCount()
  check("gallery renders a design count", baseline > 0, `${baseline} designs`)

  const rail = page.locator('aside[aria-label="Filter templates"]')
  check("filter rail is present on desktop", await rail.isVisible())

  // Each facet must actually narrow the grid, and never to nothing.
  for (const [group, option] of [
    ["Price", "Premium"],
    ["Layout", "Sidebar left"],
    ["Download formats", "PDF only"],
  ]) {
    const trigger = page.locator(`button[data-slot="accordion-trigger"]:has-text("${group}")`).first()
    if ((await trigger.getAttribute("aria-expanded")) === "false") {
      await trigger.click()
      await page.waitForTimeout(300)
    }
    await page.locator(`label:has-text("${option}")`).first().click()
    await page.waitForTimeout(400)

    const narrowed = await designCount()
    check(`${group} › ${option} narrows the grid`, narrowed > 0 && narrowed < baseline, `${baseline} → ${narrowed}`)

    await page.getByRole("button", { name: /Clear all/ }).first().click()
    await page.waitForTimeout(350)
  }

  check("Clear all restores the full gallery", (await designCount()) === baseline)
  await context.close()
}

async function testExport(browser, downloadDir, template, format) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  })
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message.split("\n")[0]))

  try {
    await page.goto(`${BASE}/free-ats-resume-templates/create?template=${template}`, {
      waitUntil: "networkidle",
    })
    // The editor hydrates its sample resume before the canvas is exportable.
    await page.waitForTimeout(2600)

    await page.getByRole("button", { name: "Download", exact: true }).first().click()
    await page.waitForTimeout(1000)

    const label = format === "pdf" ? /Download PDF/i : /Word|docx/i
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 60_000 }),
      page.locator("button,[role=menuitem]").filter({ hasText: label }).first().click(),
    ])

    const file = path.join(downloadDir, `${template}.${format}`)
    await download.saveAs(file)
    const bytes = await readFile(file)
    const magic = bytes.subarray(0, 4).toString("hex")

    check(
      `${template} exports a valid ${format.toUpperCase()}`,
      magic === MAGIC[format] && bytes.length > 1000 && errors.length === 0,
      `${bytes.length}B magic=${magic}${errors.length ? ` errors=${errors[0]}` : ""}`,
    )
  } catch (err) {
    check(`${template} exports a valid ${format.toUpperCase()}`, false, err.message.split("\n")[0].slice(0, 90))
  }

  await context.close()
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true })
const downloadDir = await mkdtemp(path.join(tmpdir(), "cfc-export-"))

try {
  await waitForServer()
  const browser = await chromium.launch(launchOptions)

  await testFilters(browser)

  console.log("\n  Export engines")
  for (const template of EXPORT_TEMPLATES) {
    for (const format of ["pdf", "docx"]) {
      await testExport(browser, downloadDir, template, format)
    }
  }

  await browser.close()
  console.log(`\n  ${pass} passed, ${fail} failed\n`)
} finally {
  process.kill(-server.pid, "SIGTERM")
  await rm(downloadDir, { recursive: true, force: true })
}

process.exit(fail === 0 ? 0 : 1)
