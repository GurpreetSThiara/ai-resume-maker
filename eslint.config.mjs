import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

/**
 * Flat config, required since ESLint 9 — the previous .eslintrc.json was
 * silently unusable, so nothing has been linted since that upgrade.
 *
 * eslint-config-next 16 already ships flat config (both entrypoints export
 * arrays directly), so no FlatCompat shim is needed.
 */
/**
 * `npm run lint` runs with --max-warnings=18, the current count. Errors always
 * fail; the ceiling stops the warning backlog growing while it is worked down.
 * Lower the number as warnings are fixed — never raise it.
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
    // Build scripts are CommonJS by extension; require() is correct there.
    files: ['**/*.cjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // shadcn primitives use `interface X extends Y {}` as an extension point.
    files: ['components/ui/**'],
    rules: { '@typescript-eslint/no-empty-object-type': 'off' },
  },
  {
    // The plugin has to be declared in the same object that overrides one of
    // its rules — flat config does not inherit plugin scope from earlier entries.
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      // Carried over from .eslintrc.json so this change stays behaviour-neutral.
      // Re-enable one at a time once the codebase is clean — exhaustive-deps in
      // particular will surface real stale-closure bugs and wants its own pass.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // Off, not warned. All 452 hits are apostrophes in marketing and blog
      // prose, which React renders correctly — the rule exists to catch stray
      // `>`/`}` typos and earns nothing here. Left as warnings it would bury
      // the ~36 actionable ones below in noise, which is how a warning list
      // stops being read.
      'react/no-unescaped-entities': 'off',
      // eslint-plugin-react-hooks 7 adds the React-compiler ruleset. It finds
      // 31 real issues across 15 files — cascading setState in effects,
      // components constructed during render, impure calls during render.
      // They want genuine restructuring, not a sweep, so they are warnings for
      // now: CI blocks any NEW error while these are worked down. Promote each
      // to 'error' as its backlog clears.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/error-boundaries': 'warn',
      // Enforced: this family produced the hydration bug in bed273d — a value
      // measured or generated during render that the server could not match.
      // The one purity hit left is a documented false positive on an event
      // handler (ImageConverter).
      'react-hooks/immutability': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/refs': 'error',
    },
  },
]
