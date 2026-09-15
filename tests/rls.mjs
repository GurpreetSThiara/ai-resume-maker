/**
 * Row-level security tests against a live Supabase project.
 *
 * Everything above this ran as an anonymous caller, so the authenticated half
 * of the security model — who may read, write and reassign a row — had only
 * ever been read off the schema, never exercised.
 *
 * Two accounts are needed: an OWNER that creates and owns every row this file
 * touches, and an INTRUDER used only as a second identity attempting writes
 * that must fail. The intruder's own data is never the target, so a real
 * account can safely play that part.
 *
 * Skipped unless all four credentials are present, so CI without secrets stays
 * green rather than failing on a missing password.
 *
 *   RLS_OWNER_EMAIL / RLS_OWNER_PASSWORD
 *   RLS_INTRUDER_EMAIL / RLS_INTRUDER_PASSWORD
 *
 * Run with `npm run test:rls`.
 */
import { readFileSync } from "node:fs"

/** Reads NEXT_PUBLIC_* from .env so the suite needs no extra configuration. */
function envFromDotenv(key) {
  try {
    const line = readFileSync(".env", "utf8").split("\n").find((l) => l.startsWith(`${key}=`))
    return line?.slice(key.length + 1).trim().replace(/^["']|["']$/g, "")
  } catch {
    return undefined
  }
}

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? envFromDotenv("NEXT_PUBLIC_SUPABASE_URL")
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? envFromDotenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

const CREDS = {
  owner: { email: process.env.RLS_OWNER_EMAIL, password: process.env.RLS_OWNER_PASSWORD },
  intruder: { email: process.env.RLS_INTRUDER_EMAIL, password: process.env.RLS_INTRUDER_PASSWORD },
}

if (!URL_BASE || !ANON || !CREDS.owner.email || !CREDS.intruder.email) {
  console.log("\n  RLS tests skipped — credentials not configured.\n")
  process.exit(0)
}

let pass = 0
let fail = 0
const check = (name, ok, detail = "") => {
  if (ok) pass++
  else fail++
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`)
}

async function signIn({ email, password }) {
  const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const body = await res.json()
  if (!body.access_token) throw new Error(`sign-in failed for ${email}: ${body.error_description ?? body.msg}`)
  return { token: body.access_token, id: body.user.id }
}

/** PostgREST call as a given identity; `token` omitted means anonymous. */
async function rest(path, { token, method = "GET", body, prefer } = {}) {
  const headers = { apikey: ANON, "content-type": "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`
  if (prefer) headers.Prefer = prefer
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }
  return { status: res.status, body: json }
}

const owner = await signIn(CREDS.owner)
const intruder = await signIn(CREDS.intruder)
console.log(`\n  owner    ${CREDS.owner.email}  (${owner.id})`)
console.log(`  intruder ${CREDS.intruder.email}  (${intruder.id})\n`)

// Baseline: what the intruder owns, so the suite can prove it left it alone.
const intruderBefore = await rest(`portfolios?select=id,title,updated_at&user_id=eq.${intruder.id}`, { token: intruder.token })
const baseline = JSON.stringify(intruderBefore.body)

const slug = `__rls_test_${Date.now()}`
let rowId = null

try {
  /* ── create ─────────────────────────────────────────────────────────── */
  const created = await rest("portfolios", {
    token: owner.token,
    method: "POST",
    prefer: "return=representation",
    body: { user_id: owner.id, slug, title: "RLS test", is_public: false },
  })
  rowId = Array.isArray(created.body) ? created.body[0]?.id : null
  check("owner can create a portfolio", created.status === 201 && !!rowId, `status ${created.status}`)

  /* ── private rows are private ───────────────────────────────────────── */
  const ownerSees = await rest(`portfolios?select=id&id=eq.${rowId}`, { token: owner.token })
  check("owner sees their own private row", ownerSees.body?.length === 1)

  const intruderSees = await rest(`portfolios?select=id&id=eq.${rowId}`, { token: intruder.token })
  check("another user cannot see a private row", intruderSees.body?.length === 0, `saw ${intruderSees.body?.length}`)

  const anonSees = await rest(`portfolios?select=id&id=eq.${rowId}`)
  check("anonymous cannot see a private row", anonSees.body?.length === 0, `saw ${anonSees.body?.length}`)

  /* ── publishing exposes read, and only read ─────────────────────────── */
  await rest(`portfolios?id=eq.${rowId}`, { token: owner.token, method: "PATCH", body: { is_public: true } })

  const anonSeesPublic = await rest(`portfolios?select=id&id=eq.${rowId}`)
  check("anonymous can read a published row", anonSeesPublic.body?.length === 1)

  const intruderUpdate = await rest(`portfolios?id=eq.${rowId}`, {
    token: intruder.token,
    method: "PATCH",
    prefer: "return=representation",
    body: { title: "HIJACKED" },
  })
  const updatedRows = Array.isArray(intruderUpdate.body) ? intruderUpdate.body.length : 0
  check("a reader cannot update someone else's published row", updatedRows === 0, `${updatedRows} rows changed`)

  const intruderDelete = await rest(`portfolios?id=eq.${rowId}`, {
    token: intruder.token,
    method: "DELETE",
    prefer: "return=representation",
  })
  const deletedRows = Array.isArray(intruderDelete.body) ? intruderDelete.body.length : 0
  check("a reader cannot delete someone else's published row", deletedRows === 0, `${deletedRows} rows deleted`)

  const stillThere = await rest(`portfolios?select=title&id=eq.${rowId}`, { token: owner.token })
  check("the row survived both attempts unmodified", stillThere.body?.[0]?.title === "RLS test", stillThere.body?.[0]?.title)

  /* ── ownership cannot be reassigned ─────────────────────────────────── */
  // The update policy declares USING without WITH CHECK; Postgres then applies
  // USING to the post-update row too, which is what should block this.
  const reassign = await rest(`portfolios?id=eq.${rowId}`, {
    token: owner.token,
    method: "PATCH",
    prefer: "return=representation",
    body: { user_id: intruder.id },
  })
  const reassigned = Array.isArray(reassign.body) ? reassign.body.length : 0
  check("owner cannot hand a row to another account", reassigned === 0, `status ${reassign.status}, ${reassigned} rows`)

  const ownerStill = await rest(`portfolios?select=user_id&id=eq.${rowId}`, { token: owner.token })
  check("the row still belongs to its creator", ownerStill.body?.[0]?.user_id === owner.id)

  /* ── forging ownership on insert ────────────────────────────────────── */
  const forged = await rest("portfolios", {
    token: owner.token,
    method: "POST",
    prefer: "return=representation",
    body: { user_id: intruder.id, slug: `${slug}_forged`, title: "forged" },
  })
  check("cannot create a row owned by someone else", forged.status !== 201, `status ${forged.status}`)

  const anonInsert = await rest("portfolios", {
    method: "POST",
    body: { user_id: owner.id, slug: `${slug}_anon`, title: "anon" },
  })
  check("anonymous cannot create a row at all", anonInsert.status !== 201, `status ${anonInsert.status}`)
} finally {
  /* ── clean up everything this file created ──────────────────────────── */
  if (rowId) await rest(`portfolios?id=eq.${rowId}`, { token: owner.token, method: "DELETE" })
  await rest(`portfolios?slug=like.${slug}*`, { token: owner.token, method: "DELETE" })

  const leftovers = await rest(`portfolios?select=id&slug=like.__rls_test_*`, { token: owner.token })
  check("test rows cleaned up", (leftovers.body?.length ?? 0) === 0, `${leftovers.body?.length} left`)

  const intruderAfter = await rest(`portfolios?select=id,title,updated_at&user_id=eq.${intruder.id}`, { token: intruder.token })
  check("the other account's data is byte-identical to before", JSON.stringify(intruderAfter.body) === baseline)
}

console.log(`\n  ${pass} passed, ${fail} failed\n`)
process.exit(fail === 0 ? 0 : 1)
