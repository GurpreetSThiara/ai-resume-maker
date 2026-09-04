/**
 * Tunable AI spend and model settings. Everything here is environment- or
 * plan-dependent, which is why it lives in config rather than constants.
 */

/** Default monthly spend ceiling, in USD, for a user with no usage row yet. */
export const DEFAULT_MONTH_USD_LIMIT = Number(process.env.AI_MONTH_USD_LIMIT ?? 2)

/**
 * Charged per request when the provider does not report a cost. A heuristic,
 * not a real price — it exists so an unmetered request cannot cost nothing.
 */
export const DEFAULT_REQUEST_USD_COST = Number(process.env.AI_REQUEST_USD_COST ?? 0.02)

/**
 * OpenRouter model id. Was hardcoded in two routes as
 * `openai/gpt-oss-20b:free`, a slug OpenRouter has since retired — it answers
 * 404 and names the paid slug as the replacement.
 */
export const AI_MODEL = process.env.AI_MODEL ?? 'openai/gpt-oss-20b'

/** Largest resume text accepted for parsing, in bytes. */
export const AI_PARSE_MAX_BYTES = 1024 * 1024
