//
// PUBLIC_INTERFACE
// Utility for normalizing/displaying client API errors
//

/**
 * Takes any error from an API module and formats a user-friendly message.
 */
export function getApiErrorMessage(error, fallback = "An error occurred") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error.err) {
    if (typeof error.err === "object" && error.err.detail) {
      return error.err.detail;
    } else if (typeof error.err === "object" && error.err.msg) {
      return error.err.msg;
    }
    return error.err.message || JSON.stringify(error.err);
  }
  if (error.message) return error.message;
  // Try to present as much as possible, fall back to JSON serialization
  return JSON.stringify(error);
}
