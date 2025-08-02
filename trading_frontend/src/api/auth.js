//
// PUBLIC_INTERFACE
// Authentication API client: login, signup, logout.
//

const BASE_URL = (process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/auth`
  : "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/auth");

/**
 * PUBLIC_INTERFACE
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
    // The backend should return { access_token, token_type }
    return {
      user: { email }, // User info is minimal here; will be enhanced later.
      accessToken: out.access_token,
    };
  } catch (err) {
    throw { location: "login", err };
  }
}

/**
 * PUBLIC_INTERFACE
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
      // accessToken here will be null initially unless backend returns it
      accessToken: data.access_token || null,
    };
  } catch (err) {
    throw { location: "signup", err };
  }
}

/**
 * PUBLIC_INTERFACE
 * Logout user, accepts extra headers (for auth/JWT)
 */
export async function logout(_, extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/logout`, { method: "POST", headers: { ...extraHeaders }});
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "logout", err };
  }
}
