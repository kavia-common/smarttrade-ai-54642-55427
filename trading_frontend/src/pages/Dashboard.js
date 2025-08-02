import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { getApiErrorMessage } from "../api/apiError";

/**
 * PUBLIC_INTERFACE
 * Dashboard: Shows holdings summary, P&L chart, and market predictions.
 */
export default function Dashboard() {
  const { DashboardAPI } = useApi();
  const [portfolio, setPortfolio] = useState(null);
  const [pnl, setPnl] = useState(null);
  const [pred, setPred] = useState(null);
  const [pnlPeriod, setPnlPeriod] = useState("1w");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const pRes = await DashboardAPI.getPortfolio();
        setPortfolio(pRes);
        const nRes = await DashboardAPI.getPnL(pnlPeriod);
        setPnl(nRes);
        const mRes = await DashboardAPI.getPredictions();
        setPred(mRes);
      } catch (err) {
        // Detect backend returned HTML/plain text instead of JSON and show extra guidance
        let msg = getApiErrorMessage(err);
        if (
          msg &&
          typeof msg === "string" &&
          (msg.includes("non-JSON response") ||
            (msg.startsWith("<") && msg.includes("html")))
        ) {
          msg =
            "Dashboard data unavailable: Backend service returned HTML or invalid response. Service may be misconfigured or temporarily unavailable.";
        }
        setError(msg);
      }
      setLoading(false);
    }
    fetchAll();
    // eslint-disable-next-line
  }, [pnlPeriod]);

  return (
    <div className="page-container" style={{maxWidth: 900}}>
      <h1>Dashboard</h1>
      {error && <div style={{color:"crimson", fontWeight:"bold"}}>{error}</div>}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 24, margin: "26px 0 16px 0",
        justifyContent: "space-between", minHeight: 160
      }}>
        {/* Holdings Summary Card */}
        <div style={{
          minWidth: 200, background: "#2228", borderRadius: 10, flex: "1 0 220px",
          padding: "16px 24px", boxShadow: "0 2px 10px 2px rgba(0,0,0,.07)"
        }}>
          <h3 style={{marginTop:0}}>Holdings</h3>
          {loading || !portfolio
            ? <div>Loading...</div>
            : (
              <div>
                <b style={{fontSize:28}}>${portfolio.total_value?.toLocaleString?.() || "--"}</b>
                <ul style={{marginTop:10, fontSize:15, paddingLeft:"1.1em"}}>
                  {(portfolio.positions || []).map((pos, i) => (
                    <li key={i}>
                      {pos.symbol || pos.asset || "-"}: <span style={{fontWeight:500}}>{pos.value ? "$"+pos.value.toLocaleString() : "--"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
        {/* P&L Summary Card */}
        <div style={{
          minWidth: 200, background: "#2228", borderRadius: 10, flex: "1 0 220px",
          padding: "16px 24px", boxShadow: "0 2px 10px 2px rgba(0,0,0,.07)"
        }}>
          <h3 style={{marginTop:0}}>P&amp;L</h3>
          <label>
            <span style={{fontSize:11}}>Period: </span>
            <select value={pnlPeriod} onChange={e=>setPnlPeriod(e.target.value)} disabled={loading}>
              <option value="1w">1W</option>
              <option value="1m">1M</option>
              <option value="3m">3M</option>
              <option value="1y">1Y</option>
            </select>
          </label>
          {loading || !pnl
            ? <div>Loading...</div>
            : (
              <div style={{fontSize:24}}>
                <span style={{color: pnl.pnl >= 0 ? "limegreen" : "crimson"}}>
                  {pnl.pnl >= 0 ? "+" : ""}${pnl.pnl?.toLocaleString?.()}
                </span>
                <div style={{fontSize:12,marginTop:4}}>
                  Breakdown:<br />
                  {(pnl.breakdown && Object.entries(pnl.breakdown).length > 0)
                    ? Object.entries(pnl.breakdown).map(([k, v]) =>
                        <span key={k}>{k}: <b style={{color:v>=0?"limegreen":"crimson"}}>{v >= 0 ? "+" : ""}${v.toLocaleString()}</b><br/></span>
                      )
                    : <span>Not available</span>
                  }
                </div>
              </div>
            )}
        </div>
        {/* Prediction Summary */}
        <div style={{
          minWidth: 220, background: "#2228", borderRadius: 10, flex: "1 0 240px",
          padding: "16px 22px", boxShadow: "0 2px 10px 2px rgba(0,0,0,.07)"
        }}>
          <h3 style={{marginTop:0}}>AI Market Prediction</h3>
          {loading || !pred
            ? <div>Loading...</div>
            : (
              <div>
                <div>Recommendations:</div>
                <ul>
                  {(pred.recommendations || []).map((r, i) => (
                    <li key={i} style={{fontWeight:500, color: "#42d682"}}>{r}</li>
                  ))}
                </ul>
                <div style={{fontSize:12,marginTop:9}}>
                  Confidence:&nbsp;
                  <span style={{fontWeight:600, color:"#1976d2"}}>
                    {typeof pred.confidence === "number" ? Math.round(pred.confidence*100) + "%" : "--"}
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
