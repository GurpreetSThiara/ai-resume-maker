/**
 * Brand values that have to be literal, not CSS tokens.
 *
 * `theme-color` and `msapplication-TileColor` are read by the browser off the
 * meta attribute, so they cannot resolve a var(). Keep them here so they stay
 * in step with `--primary` in globals.css rather than being retyped inline.
 */
export const BRAND_THEME_COLOR = '#15803d'
