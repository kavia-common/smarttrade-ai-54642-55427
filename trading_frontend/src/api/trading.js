//
// PUBLIC_INTERFACE
// Trade execution API client
//

const BASE_URL = (process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/trades`
  : "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/trades");

// PUBLIC_INTERFACE
export async function executeTrade({ symbol, action, quantity, price }) {
  try {
    const resp = await fetch(`${BASE_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, action, quantity, price }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "executeTrade", err };
  }
}
