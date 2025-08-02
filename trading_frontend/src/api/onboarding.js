//
// PUBLIC_INTERFACE
// Onboarding & KYC API client
//
// All backend calls use:
//   http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
// No .env or process.env support.
//
// If the browser is served with HTTPS but this backend is HTTP, browser will block with CORS/mixed-content error.
//

const BASE_URL = "http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/api/onboarding";

function handleNetworkError(err) {
  if (err instanceof TypeError && err.message &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))
    ) {
    return {
      message: "Network/CORS error: Unable to reach backend (mixed content: HTTPS frontend to HTTP backend is blocked by browsers)."
    };
  }
  return { message: err && err.message ? err.message : "A network error occurred." };
}

// PUBLIC_INTERFACE
export async function onboardingStart(data, extraHeaders={}) {
  // { email, full_name, agreed_terms }
  try {
    const resp = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "onboardingStart", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
export async function kycStart({ user_id }, extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/kyc/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify({ user_id }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "kycStart", ...(handleNetworkError(err)), err };
  }
}

// PUBLIC_INTERFACE
export async function kycSubmit({ user_id, answers }, extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/kyc/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify({ user_id, answers }),
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  } catch (err) {
    throw { location: "kycSubmit", ...(handleNetworkError(err)), err };
  }
}
