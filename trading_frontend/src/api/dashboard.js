//
// PUBLIC_INTERFACE
// Dashboard API client
//
// All endpoints are pinned to:
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
//
// STRICT: This module does not use process.env or .env. All endpoints are hardcoded for clarity.
// If the frontend is on HTTPS but backend is HTTP, browser will block calls! UI will show user-facing explanations.
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/dashboard";

/**
 * Catches fetch response and returns JSON or meaningful HTML/network error diagnostics.
 */
async function parseJsonSafely(resp) {
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch (e) {
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
 * Checks HTTP failures and gives user-friendly frontend messages.
 */
function handleResponseError(resp, context = "Unknown API") {
  if (resp.status === 404) {
    return `${context} not found (404). Please check with support if this persists.`;
  }
  if (resp.status === 500) {
    return `${context} returned server error. Please try again later.`;
  }
  return null;
}
/**
 * Wrap TypeError/network errors as explicit user UI message.
 */
function handleNetworkError(err) {
  if (err instanceof TypeError && err.message &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))
    ) {
    return {
      message: "Network/CORS: Cannot connect to backend. The typical cause is running this frontend on HTTPS and backend on HTTP—browsers block mixed-content for security. Please deploy both using HTTPS or see developer instructions."
    };
  }
  return { message: err && err.message ? err.message : "A client or network error occurred." };
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
      const custom = handleResponseError(resp, "Holdings summary");
      if (custom) throw { message: custom };
      throw await parseJsonSafely(resp);
    }
    const data = await parseJsonSafely(resp);
    if (!data || typeof data.total_value === "undefined" || !Array.isArray(data.positions)) {
      throw { message: "Portfolio data missing or malformed from backend." };
    }
    return data;
  } catch (err) {
    throw { location: "getPortfolio", ...(handleNetworkError(err)), err };
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
    throw { location: "getPnL", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch ML-based market predictions for dashboard. Handles non-JSON/HTML/timeout error responses gracefully.
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
    throw { location: "getPredictions", ...(handleNetworkError(err)), err };
  }
}
