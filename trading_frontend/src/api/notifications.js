//
// PUBLIC_INTERFACE
// Notifications API client
//

const BASE_URL = (process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/notifications` : "/api/notifications");

// PUBLIC_INTERFACE
export async function listNotifications() {
  try {
    const resp = await fetch(`${BASE_URL}/`);
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "listNotifications", err };
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
    throw { location: "sendNotification", err };
  }
}
