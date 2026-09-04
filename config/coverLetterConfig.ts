/**
 * Tunable limits for the cover-letter feature. Separate from
 * constants/coverLetterConstants.ts: these are values you would change per
 * environment or per plan, not fixed truths.
 */

/**
 * Saved cover letters allowed per user. Flat for now — when plans land, this
 * becomes a lookup keyed by the user's subscription tier.
 */
export const COVER_LETTER_SAVE_LIMIT = 3
