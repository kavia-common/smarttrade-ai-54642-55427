//
// PUBLIC_INTERFACE
// Portfolio Management API client
//

const BASE_URL = process.env.REACT_APP_API_URL || "/api/portfolio";

// PUBLIC_INTERFACE
export async function allocatePortfolio(allocations) {
  try {
    const resp = await fetch(`${BASE_URL}/allocate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allocations }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "allocatePortfolio", err };
  }
}

// PUBLIC_INTERFACE
export async function manualRebalance(actions) {
  try {
    const resp = await fetch(`${BASE_URL}/rebalance/manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actions }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "manualRebalance", err };
  }
}
