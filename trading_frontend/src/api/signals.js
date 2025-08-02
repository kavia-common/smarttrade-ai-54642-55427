//
// PUBLIC_INTERFACE
// Signals & Sentiment API client
//
// This is hardcoded to backend base URL:
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
//
// No .env or process.env or variable support.
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/signals";

function handleNetworkError(err) {
  if (err instanceof TypeError && err.message &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))
    ) {
    return {
      message: "Network/CORS error: Backend signals service unreachable (mixed-content: HTTPS frontend/HTTP backend)."
    };
  }
  return { message: err && err.message ? err.message : "A network error occurred." };
}

// PUBLIC_INTERFACE
export async function exploreSignals({ asset, timeframe }) {
  try {
    const resp = await fetch(`${BASE_URL}/explore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset, timeframe }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "exploreSignals", ...(handleNetworkError(err)), err };
  }
}
