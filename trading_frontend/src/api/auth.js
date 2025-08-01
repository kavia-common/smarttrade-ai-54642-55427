//
// PUBLIC_INTERFACE
// Authentication API client: login, signup, logout.
//

const BASE_URL = process.env.REACT_APP_API_URL || "/api/auth";

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  try {
    const resp = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "login", err };
  }
}

// PUBLIC_INTERFACE
export async function signup({ email, password, full_name }) {
  try {
    const resp = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "signup", err };
  }
}

// PUBLIC_INTERFACE
export async function logout() {
  try {
    const resp = await fetch(`${BASE_URL}/logout`, { method: "POST" });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "logout", err };
  }
}
