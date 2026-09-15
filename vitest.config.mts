import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

/**
 * Unit tests for pure logic only — no DOM, no rendering.
 *
 * Anything that needs a browser is covered by tests/smoke.mjs and the flow
 * tests, which run against a real production build rather than a simulated DOM.
 */
export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
})
