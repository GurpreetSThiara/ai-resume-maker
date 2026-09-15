#!/usr/bin/env node
/**
 * Fails if a secret-shaped value is exposed under a NEXT_PUBLIC_ name.
 *
 * Anything prefixed NEXT_PUBLIC_ is inlined into the client bundle wherever it
 * is referenced. This guard exists because .env carried the OpenRouter API
 * keys under both OPENROUTER_API_KEYS and NEXT_PUBLIC_OPENROUTER_API_KEYS —
 * identical 147-character values. Nothing read the public one, so it never
 * shipped, but it was one import away from handing every visitor the keys.
 *
 * Run: node scripts/check-public-env.mjs [...files]
 */
import { readFileSync, existsSync } from 'node:fs'

/**
 * NEXT_PUBLIC_ names that are public by design. Both are meant to reach the
 * browser: the Supabase anon key is the client's identity and is gated by RLS,
 * and a PostHog project key is a write-only ingest token.
 */
const PUBLIC_BY_DESIGN = new Set([
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_POSTHOG_KEY',
])

const SECRET_SHAPED = /^NEXT_PUBLIC_[A-Z0-9_]*(KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL|PRIVATE)[A-Z0-9_]*$/

const files = process.argv.slice(2)
const targets = (files.length ? files : ['.env', '.env.local', '.env.production']).filter(existsSync)

const violations = []

for (const file of targets) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const name = trimmed.slice(0, trimmed.indexOf('=')).trim()
    if (!name || PUBLIC_BY_DESIGN.has(name) || !SECRET_SHAPED.test(name)) return

    violations.push({ file, line: i + 1, name })
  })
}

if (violations.length) {
  console.error('\nSecret-shaped variables exposed to the client bundle:\n')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.name}`)
  }
  console.error(
    '\nAnything named NEXT_PUBLIC_* is inlined into client JS. Move these to a\n' +
      'server-only name, or add them to PUBLIC_BY_DESIGN in this script if they\n' +
      'genuinely belong in the browser.\n',
  )
  process.exit(1)
}

console.log(`No client-exposed secrets in ${targets.length ? targets.join(', ') : '(no env files found)'}`)
