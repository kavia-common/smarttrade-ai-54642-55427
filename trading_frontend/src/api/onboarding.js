//
// PUBLIC_INTERFACE
// Onboarding & KYC API client
//

const BASE_URL = (process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/onboarding` : "/api/onboarding");

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
    throw { location: "onboardingStart", err };
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
    throw { location: "kycStart", err };
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
    throw { location: "kycSubmit", err };
  }
}
