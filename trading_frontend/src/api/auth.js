//
// PUBLIC_INTERFACE
// Authentication API client: login, signup, logout.
//
// All API calls here are pinned to the backend at:
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
//
// There is no fallback to any environment variable.
// If you deploy the frontend from HTTPS but the backend is HTTP, browser CORS/mixed-content will block calls.
// Network/CORS errors are handled with explicit user messages!
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/auth";

/**
 * Utility to check fetch response and handle network/CORS/mixed-content errors clearly for the end-user.
 */
function handleNetworkError(err) {
  if (err instanceof TypeError && err.message && (
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError") ||
      err.message.includes("network error")
    )) {
    // Likely CORS or connectivity (e.g., frontend HTTPS, backend HTTP = mixed content)
    return {
      message:
        "Network/CORS error: Unable to reach backend. " +
        "This may be due to the backend running on HTTP while the frontend uses HTTPS, which is blocked by browsers for security. " +
        "Check your deployment and use HTTPS for both frontend and backend, or consult the deployment documentation."
    };
  }
  return { message: err && err.message ? err.message : "An unexpected network error occurred." };
}

// PUBLIC_INTERFACE
/**
 * Login user, returns { user: obj, accessToken: string }
 * Accepts headers optionally for Authorization propagation.
 */
export async function login({ email, password }, extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) throw await resp.json();
    const out = await resp.json();
    return {
      user: { email }, // User info is minimal here; will be enhanced later.
      accessToken: out.access_token,
    };
  } catch (err) {
    // Enhance with network/CORS docs
    throw { location: "login", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
/**
 * Signup user, returns { user: obj, accessToken: string }
 * Accepts headers optionally for Authorization propagation.
 */
export async function signup({ email, password, full_name }, extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify({ email, password, full_name }),
    });
    if (!resp.ok) throw await resp.json();
    // According to backend, response includes `{user_id, email}`
    const data = await resp.json();
    // The initial signup usually does not provide access_token immediately, you may still need login step.
    return {
      user: { email: data.email, user_id: data.user_id },
      accessToken: data.access_token || null,
    };
  } catch (err) {
    throw { location: "signup", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
/**
 * Logout user, accepts extra headers (for auth/JWT)
 */
export async function logout(_, extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/logout`, { method: "POST", headers: { ...extraHeaders }});
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "logout", ...(handleNetworkError(err)), err };
  }
}
