// Shared user-facing/error copy that was previously copy-pasted across
// multiple files (toasts, thrown errors, console logs). Add new entries here
// instead of retyping a string literal that already exists.
export const MESSAGES = {
  AUTH_NOT_AUTHENTICATED: "User not authenticated",
  PORTFOLIO_LOAD_FAILED: "Failed to load resume data",
  PORTFOLIO_GENERIC_ERROR: "An error occurred",
  RESUME_DOWNLOAD_SUCCESS: "Resume downloaded successfully!",
  RESUME_DOWNLOAD_FAILED: "Failed to download resume.",
} as const
