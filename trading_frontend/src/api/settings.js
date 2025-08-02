//
// PUBLIC_INTERFACE
// Account & Settings API client
//
// All endpoints are hardcoded to backend base URL:
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
//
// NO .env or process.env fallback.
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/account";

function handleNetworkError(err) {
  if (err instanceof TypeError && err.message &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))
    ) {
    return {
      message: "Network/CORS error: Cannot reach backend account service. Mixed-content errors (HTTPS frontend, HTTP backend) are common here."
    };
  }
  return { message: err && err.message ? err.message : "A network error occurred." };
}

// PUBLIC_INTERFACE
export async function updateSettings(data) {
  try {
    const resp = await fetch(`${BASE_URL}/settings/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "updateSettings", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
export async function listApiKeys() {
  try {
    const resp = await fetch(`${BASE_URL}/apikeys`);
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "listApiKeys", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
export async function createApiKey() {
  try {
    const resp = await fetch(`${BASE_URL}/apikeys/create`, { method: "POST" });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "createApiKey", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
export async function revokeApiKey(api_key_id) {
  try {
    const resp = await fetch(`${BASE_URL}/apikeys/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key_id }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "revokeApiKey", ...(handleNetworkError(err)), err };
  }
}
