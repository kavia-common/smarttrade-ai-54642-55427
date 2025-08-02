//
// PUBLIC_INTERFACE
// Portfolio Management API client
//
// All API endpoints are fixed at:
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
//
// process.env/.env is not used, edit this file to update endpoint.
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/portfolio";

function handleNetworkError(err) {
  if (err instanceof TypeError && err.message &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))
    ) {
    return {
      message: "Network/CORS error: Portfolio backend not reachable. Likely mixed-content (HTTPS frontend, HTTP backend); browser will block the request."
    };
  }
  return { message: err && err.message ? err.message : "A network error occurred." };
}

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
    throw { location: "allocatePortfolio", ...(handleNetworkError(err)), err };
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
    throw { location: "manualRebalance", ...(handleNetworkError(err)), err };
  }
}
