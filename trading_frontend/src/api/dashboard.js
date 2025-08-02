//
// PUBLIC_INTERFACE
// Dashboard API client
//

const BASE_URL = (process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/dashboard` : "/api/dashboard");

/**
 * Attempts to parse the fetch response as JSON.
 * If the response is not JSON (e.g., HTML), it returns an error object indicating invalid format.
 */
async function parseJsonSafely(resp) {
  const text = await resp.text();
  try {
    // Try to parse as JSON
    return JSON.parse(text);
  } catch (e) {
    // Probably HTML or invalid JSON
    throw {
      status: resp.status,
      detail:
        text && text.startsWith("<")
          ? "Backend returned non-JSON response. Service may be unavailable or misrouted."
          : text || "Invalid response format from backend.",
    };
  }
}

/**
 * Checks for 404/invalid status and generates a user-facing error message.
 */
function handleResponseError(resp, context = "Unknown API") {
  if (resp.status === 404) {
    // Show user-friendly message for missing resource
    return `${context} not found (404). Please check with support if this persists.`;
  }
  if (resp.status === 500) {
    return `${context} returned server error. Please try again later.`;
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * Fetch user's portfolio (holdings). Handles non-JSON/HTML error responses gracefully.
 * Shows explicit user-facing errors for 404/bad responses.
 */
export async function getPortfolio(extraHeaders = {}) {
  try {
    const resp = await fetch(`${BASE_URL}/portfolio`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      // User-facing error for 404
      const custom = handleResponseError(resp, "Holdings summary");
      if (custom) throw { message: custom };
      throw await parseJsonSafely(resp);
    }
    const data = await parseJsonSafely(resp);
    // Defensive: verify essential fields, else return error
    if (!data || typeof data.total_value === "undefined" || !Array.isArray(data.positions)) {
      throw { message: "Portfolio data missing or malformed from backend." };
    }
    return data;
  } catch (err) {
    throw { location: "getPortfolio", err };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch user's P&L breakdown for given period. Handles non-JSON/HTML error responses gracefully.
 * Shows explicit user-facing errors for 404/bad responses.
 */
export async function getPnL(period = "1w", extraHeaders = {}) {
  try {
    const resp = await fetch(`${BASE_URL}/pnl?period=${encodeURIComponent(period)}`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      const custom = handleResponseError(resp, "P&L report");
      if (custom) throw { message: custom };
      throw await parseJsonSafely(resp);
    }
    const data = await parseJsonSafely(resp);
    if (!data || typeof data.pnl === "undefined" || typeof data.period === "undefined") {
      throw { message: "P&L data missing or malformed from backend." };
    }
    return data;
  } catch (err) {
    throw { location: "getPnL", err };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch ML-based market predictions for dashboard. Handles non-JSON/HTML error responses gracefully.
 * Shows explicit user-facing errors for 404/bad responses.
 */
export async function getPredictions(extraHeaders = {}) {
  try {
    const resp = await fetch(`${BASE_URL}/predictions`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      const custom = handleResponseError(resp, "AI Predictions");
      if (custom) throw { message: custom };
      throw await parseJsonSafely(resp);
    }
    const data = await parseJsonSafely(resp);
    if (!data || !Array.isArray(data.recommendations)) {
      throw { message: "Prediction data missing or malformed from backend." };
    }
    return data;
  } catch (err) {
    throw { location: "getPredictions", err };
  }
}
