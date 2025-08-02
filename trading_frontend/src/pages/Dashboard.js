import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { getApiErrorMessage } from "../api/apiError";

/**
 * PUBLIC_INTERFACE
 * Dashboard: Modern, clean, minimal dark-themed dashboard with portfolio, P&L, and AI prediction widgets.
 * Responsive grid and clear error/loading states. Feature parity with previous logic.
 */
export default function Dashboard() {
  const { DashboardAPI } = useApi();
  const [portfolio, setPortfolio] = useState(null);
  const [pnl, setPnl] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [pnlPeriod, setPnlPeriod] = useState("1w");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Polished dark tones & widget box colors
  const cardBg = "var(--bg-secondary,#23272f)";
  const cardBorder = "1.8px solid var(--border-color,#222)";
  const cardShadow = "0 2px 16px 2px rgba(0,0,0,0.14)";
  const accentColor = "#ff9800";

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const portfolioData = await DashboardAPI.getPortfolio();
        setPortfolio(portfolioData);
        const pnlData = await DashboardAPI.getPnL(pnlPeriod);
        setPnl(pnlData);
        const predData = await DashboardAPI.getPredictions();
        setPredictions(predData);
      } catch (err) {
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
    <div
      className="page-container"
      style={{
        maxWidth: "1040px",
        margin: "0 auto",
        background: "transparent",
        boxShadow: "none",
        padding: 0,
        marginTop: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <h1
          style={{
            margin: "0px 0px 8px 7px",
            fontWeight: 700,
            fontSize: "2.25rem",
            color: "var(--text-primary, #fff)",
            letterSpacing: "0.01em",
          }}
        >
           Dashboard
        </h1>
        <div style={{ flex: 1 }} />
        <span
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: 8,
            padding: "7px 16px",
            fontSize: 16,
            color: "#aaa",
            boxShadow: "none",
            margin: "0 6px 6px 0",
            display: "inline-block",
            letterSpacing: 1.1,
            fontFamily: "monospace",
          }}
        >
          SmartTrade.AI
        </span>
      </div>
      {error && (
        <div style={{
          color: "#f36a68",
          fontWeight: 700,
          background: "#381619cc",
          borderRadius: 7,
          padding: "14px 20px",
          textAlign: "center",
          marginBottom: 20,
          letterSpacing: ".01em"
        }}>
          {error}
        </div>
      )}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
          gap: "2.2rem",
          margin: "0 auto",
          marginBottom: 8,
        }}
      >
        {/* Holdings Widget */}
        <article
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: 15,
            boxShadow: cardShadow,
            padding: "26px 22px 22px 22px",
            minHeight: 210,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "1.15rem",
              fontWeight: 600,
              color: accentColor,
              letterSpacing: ".04em",
              marginBottom: 13,
            }}
          >
            Portfolio Value
          </div>
          {loading || !portfolio ? (
            <Skeleton style={{ height: 54 }} />
          ) : (
            <div>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "0.02em",
                  marginBottom: 5,
                  lineHeight: 1.1,
                }}
              >
                $
                {portfolio.total_value !== undefined
                  ? Number(portfolio.total_value).toLocaleString("en-US", { maximumFractionDigits: 2 })
                  : "--"}
              </div>
              <ul style={{ marginTop: 10, fontSize: 17, paddingLeft: "1.0em", color: "#cfcfcf" }}>
                {(portfolio.positions || []).map((pos, i) => (
                  <li key={i} style={{marginBottom: 2}}>
                    <span style={{ fontWeight: 600, color: "#62dfff" }}>
                      {pos.symbol || pos.asset || "-"}
                    </span>
                    {": "}
                    <span style={{ fontWeight: 400 }}>
                      {pos.value ? `$${Number(pos.value).toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "--"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
        {/* P&L Widget */}
        <article
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: 15,
            boxShadow: cardShadow,
            padding: "26px 22px 22px 22px",
            minHeight: 210,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "1.15rem",
              fontWeight: 600,
              color: accentColor,
              letterSpacing: ".04em",
              marginBottom: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            P&amp;L
            <label>
              <select
                value={pnlPeriod}
                onChange={(e) => setPnlPeriod(e.target.value)}
                disabled={loading}
                style={{
                  background: "#191a23",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 13,
                  marginLeft: 5,
                  padding: "3.5px 14px",
                }}
              >
                <option value="1w">1W</option>
                <option value="1m">1M</option>
                <option value="3m">3M</option>
                <option value="1y">1Y</option>
              </select>
            </label>
          </div>
          {loading || !pnl ? (
            <Skeleton style={{ height: 54 }} />
          ) : (
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: pnl.pnl >= 0 ? "#64e192" : "#fb5b7a",
                  marginBottom: 8
                }}
              >
                {pnl.pnl >= 0 ? "+" : ""}
                ${pnl.pnl?.toLocaleString?.("en-US", { maximumFractionDigits: 2 }) || "--"}
              </div>
              <div style={{
                fontSize: 13,
                color: "#b9b9b9"
              }}>
                {pnl.breakdown && Object.entries(pnl.breakdown).length > 0 ? (
                  Object.entries(pnl.breakdown).map(([k, v]) => (
                    <span key={k} style={{ marginRight: 10, display: "inline-block" }}>
                      <span style={{ color: "#aaa" }}>{k}: </span>
                      <b style={{ color: v >= 0 ? "#64e192" : "#fb5b7a" }}>
                        {v >= 0 ? "+" : ""}
                        ${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </b>
                    </span>
                  ))
                ) : (
                  <span>Breakdown not available</span>
                )}
              </div>
            </div>
          )}
        </article>
        {/* AI Prediction Widget */}
        <article
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: 15,
            boxShadow: cardShadow,
            padding: "26px 22px 22px 22px",
            minHeight: 210,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "1.16rem",
              fontWeight: 600,
              color: accentColor,
              letterSpacing: ".04em",
              marginBottom: 13,
            }}
          >
            AI Market Prediction
          </div>
          {loading || !predictions ? (
            <Skeleton style={{ height: 54 }} />
          ) : (
            <div>
              <div style={{ color: "#bbb", fontSize: 15, fontWeight: 400 }}>
                Recommendations:
              </div>
              <ul style={{ marginTop: 4, paddingLeft: 23 }}>
                {(predictions.recommendations || []).map((r, i) => (
                  <li key={i}
                    style={{
                      fontWeight: 600,
                      color: "#42d682",
                      fontFamily: "monospace",
                      fontSize: 17,
                      marginBottom: 3
                    }}
                  >
                    {r}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: 13, marginTop: 11, color: "#97b7fe", fontWeight: 600 }}>
                Confidence: &nbsp;
                <span style={{
                  color: predictions.confidence > 0.67
                    ? "#21e173"
                    : predictions.confidence < 0.33
                      ? "#ff6369"
                      : "#ffa700",
                  fontWeight: 700
                }}>
                  {typeof predictions.confidence === "number"
                    ? Math.round(predictions.confidence * 100) + "%"
                    : "--"}
                </span>
              </div>
            </div>
          )}
        </article>
      </section>

      {/* Minimal watermark or footer for engagement */}
      <footer
        style={{
          textAlign: "right",
          color: "#35363e",
          margin: "24px 3px 0 0",
          fontSize: 13,
          fontWeight: 400,
        }}
      >
        SmartTrade.AI &mdash; Automated Investing, AI Analysis, and Secure Trading
      </footer>
    </div>
  );
}

// Simple animated skeleton placeholder for minimal UI polish
function Skeleton({ style }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg,#191a23 32%,#23253b 64%,#191a23 90%)",
        borderRadius: 7,
        minHeight: 35,
        width: "100%",
        animation: "skeleton-slide 1.1s infinite linear",
        ...style,
      }}
    >
      <style>
        {`
        @keyframes skeleton-slide {
          0% { opacity: 0.87; }
          50% { opacity: 0.60; }
          100% { opacity: 0.87; }
        }
        `}
      </style>
    </div>
  );
}
