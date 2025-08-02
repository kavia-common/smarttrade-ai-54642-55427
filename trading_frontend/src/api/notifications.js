//
// PUBLIC_INTERFACE
// Notifications API client
//
// All endpoints are pinned to:
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
// There is no process.env or .env support!
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/notifications";

function handleNetworkError(err) {
  if (err instanceof TypeError && err.message &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))
    ) {
    return {
      message: "Network/CORS error: Cannot reach backend (likely mixed-content: HTTPS frontend, HTTP backend—which browsers block)."
    };
  }
  return { message: err && err.message ? err.message : "A network error occurred." };
}

// PUBLIC_INTERFACE
export async function listNotifications() {
  try {
    const resp = await fetch(`${BASE_URL}/`);
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "listNotifications", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
export async function sendNotification(notification) {
  // { user_id, content, type }
  try {
    const resp = await fetch(`${BASE_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "sendNotification", ...(handleNetworkError(err)), err };
  }
}
