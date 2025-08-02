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

// PUBLIC_INTERFACE
/**
 * Fetch user's portfolio (holdings). Handles non-JSON/HTML error responses gracefully.
 */
export async function getPortfolio(extraHeaders = {}) {
  try {
    const resp = await fetch(`${BASE_URL}/portfolio`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      throw await parseJsonSafely(resp);
    }
    // Parse content as JSON and validate shape
    return await parseJsonSafely(resp);
  } catch (err) {
    throw { location: "getPortfolio", err };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch user's P&L breakdown for given period. Handles non-JSON/HTML error responses gracefully.
 */
export async function getPnL(period = "1w", extraHeaders = {}) {
  try {
    const resp = await fetch(`${BASE_URL}/pnl?period=${encodeURIComponent(period)}`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      throw await parseJsonSafely(resp);
    }
    return await parseJsonSafely(resp);
  } catch (err) {
    throw { location: "getPnL", err };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch ML-based market predictions for dashboard. Handles non-JSON/HTML error responses gracefully.
 */
export async function getPredictions(extraHeaders = {}) {
  try {
    const resp = await fetch(`${BASE_URL}/predictions`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      throw await parseJsonSafely(resp);
    }
    return await parseJsonSafely(resp);
  } catch (err) {
    throw { location: "getPredictions", err };
  }
}
