//
// PUBLIC_INTERFACE
// Dashboard API client
//

const BASE_URL = process.env.REACT_APP_API_URL || "/api/dashboard";

// PUBLIC_INTERFACE
export async function getPortfolio() {
  try {
    const resp = await fetch(`${BASE_URL}/portfolio`);
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "getPortfolio", err };
  }
}

// PUBLIC_INTERFACE
export async function getPnL(period = "1w") {
  try {
    const resp = await fetch(`${BASE_URL}/pnl?period=${encodeURIComponent(period)}`);
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "getPnL", err };
  }
}

// PUBLIC_INTERFACE
export async function getPredictions() {
  try {
    const resp = await fetch(`${BASE_URL}/predictions`);
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "getPredictions", err };
  }
}
