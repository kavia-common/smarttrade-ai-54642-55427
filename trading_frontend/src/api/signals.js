//
// PUBLIC_INTERFACE
// Signals & Sentiment API client
//

const BASE_URL = (process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/signals`
  : "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/signals");

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
    throw { location: "exploreSignals", err };
  }
}
