//
// PUBLIC_INTERFACE
// Dashboard API client
//

const BASE_URL = (process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/dashboard` : "/api/dashboard");

// PUBLIC_INTERFACE
// PUBLIC_INTERFACE
export async function getPortfolio(extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/portfolio`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      // Try to parse error as JSON if possible, otherwise as text
      let text = await resp.text();
      try {
        throw JSON.parse(text);
      } catch (e) {
        throw { status: resp.status, detail: text };
      }
    }
    return await resp.json();
  } catch (err) {
    throw { location: "getPortfolio", err };
  }
}

// PUBLIC_INTERFACE
// PUBLIC_INTERFACE
export async function getPnL(period = "1w", extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/pnl?period=${encodeURIComponent(period)}`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      let text = await resp.text();
      try {
        throw JSON.parse(text);
      } catch (e) {
        throw { status: resp.status, detail: text };
      }
    }
    return await resp.json();
  } catch (err) {
    throw { location: "getPnL", err };
  }
}

// PUBLIC_INTERFACE
// PUBLIC_INTERFACE
export async function getPredictions(extraHeaders={}) {
  try {
    const resp = await fetch(`${BASE_URL}/predictions`, { headers: { ...extraHeaders } });
    if (!resp.ok) {
      let text = await resp.text();
      try {
        throw JSON.parse(text);
      } catch (e) {
        throw { status: resp.status, detail: text };
      }
    }
    return await resp.json();
  } catch (err) {
    throw { location: "getPredictions", err };
  }
}
