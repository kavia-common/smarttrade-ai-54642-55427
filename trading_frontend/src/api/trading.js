//
// PUBLIC_INTERFACE
// Trade execution API client
//
// All API calls use the following backend base URL (static, see README!):
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
//
// Don't use .env, process.env, or anything dynamic.
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/trades";

function handleNetworkError(err) {
  if (err instanceof TypeError && err.message &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))
    ) {
    return {
      message: "Network/CORS error: Trade service backend cannot be reached. Deploy backend + frontend on HTTPS to avoid mixed-content browser errors."
    };
  }
  return { message: err && err.message ? err.message : "A network error occurred." };
}

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
    throw { location: "executeTrade", ...(handleNetworkError(err)), err };
  }
}
