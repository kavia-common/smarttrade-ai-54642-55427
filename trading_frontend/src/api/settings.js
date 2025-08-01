//
// PUBLIC_INTERFACE
// Account & Settings API client
//

const BASE_URL = process.env.REACT_APP_API_URL || "/api/account";

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
    throw { location: "updateSettings", err };
  }
}

// PUBLIC_INTERFACE
export async function listApiKeys() {
  try {
    const resp = await fetch(`${BASE_URL}/apikeys`);
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "listApiKeys", err };
  }
}

// PUBLIC_INTERFACE
export async function createApiKey() {
  try {
    const resp = await fetch(`${BASE_URL}/apikeys/create`, { method: "POST" });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "createApiKey", err };
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
    throw { location: "revokeApiKey", err };
  }
}
