// Shared user-facing/error copy that was previously copy-pasted across
// multiple files (toasts, thrown errors, console logs). Add new entries here
// instead of retyping a string literal that already exists.
export const MESSAGES = {
  AUTH_NOT_AUTHENTICATED: "User not authenticated",
  PORTFOLIO_LOAD_FAILED: "Failed to load resume data",
  PORTFOLIO_GENERIC_ERROR: "An error occurred",
  RESUME_DOWNLOAD_SUCCESS: "Resume downloaded successfully!",
  RESUME_DOWNLOAD_FAILED: "Failed to download resume.",
  AUTH_UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  COVER_LETTER_NOT_FOUND: "Cover letter not found",
  COVER_LETTER_LIMIT_REACHED: "You have reached the maximum number of saved cover letters.",
  COVER_LETTER_FETCH_FAILED: "Failed to fetch cover letters",
  COVER_LETTER_FETCH_ONE_FAILED: "Failed to fetch cover letter",
  COVER_LETTER_CREATE_FAILED: "Failed to create cover letter",
  COVER_LETTER_UPDATE_FAILED: "Failed to update cover letter",
  COVER_LETTER_DELETE_FAILED: "Failed to delete cover letter",
} as const
