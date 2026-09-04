import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import react from 'eslint-plugin-react'

/**
 * Flat config, required since ESLint 9 — the previous .eslintrc.json was
 * silently unusable, so nothing has been linted since that upgrade.
 *
 * eslint-config-next 16 already ships flat config (both entrypoints export
 * arrays directly), so no FlatCompat shim is needed.
 */
export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'scratch/**',
      // Vendored/minified assets and build output are not ours to lint.
      'public/**',
      'scratch.js',
      'google-apps-script-tracker.js',
      'instrumentation-client.js',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // The plugin has to be declared in the same object that overrides one of
    // its rules — flat config does not inherit plugin scope from earlier entries.
    plugins: { react },
    rules: {
      // Carried over from .eslintrc.json so this change stays behaviour-neutral.
      // Re-enable one at a time once the codebase is clean — exhaustive-deps in
      // particular will surface real stale-closure bugs and wants its own pass.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // 452 hits, essentially all apostrophes in marketing/blog copy. Kept
      // visible as warnings rather than errors: mass-editing user-facing prose
      // to satisfy a stylistic rule risks typos for no functional gain.
      // Promote to error once the backlog is worked (see REMEDIATION_PLAN 6d).
      'react/no-unescaped-entities': 'warn',
    },
  },
]
