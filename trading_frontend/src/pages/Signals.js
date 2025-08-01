import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { getApiErrorMessage } from "../api/apiError";

/**
 * PUBLIC_INTERFACE
 * Signals Explorer: Lets users search for signals by asset/timeframe and see sentiment.
 */
export default function Signals() {
  const { SignalsAPI } = useApi();
  const [asset, setAsset] = useState("");
  const [timeframe, setTimeframe] = useState("1d");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setSearched(true);
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await SignalsAPI.exploreSignals({ asset, timeframe });
      setResults(res);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setLoading(false);
  }

  return (
    <div className="page-container" style={{maxWidth:520}}>
      <h1>Signal Explorer</h1>
      <form onSubmit={handleSearch} style={{display:"flex", flexDirection:"row", gap:10, marginBottom:18, flexWrap:"wrap"}}>
        <input
          style={{flex:"2 1 160px", padding:8, borderRadius:6, border:"1px solid #ddd"}}
          value={asset}
          onChange={e => setAsset(e.target.value)}
          placeholder="Asset (e.g., AAPL, BTC)"
          required
          disabled={loading}
        />
        <select
          style={{flex:"1 1 50px", minWidth:90, padding:8, borderRadius:6, border:"1px solid #ddd"}}
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          disabled={loading}
        >
          <option value="1h">1H</option>
          <option value="4h">4H</option>
          <option value="1d">1D</option>
          <option value="1w">1W</option>
        </select>
        <button
          className="btn"
          type="submit"
          disabled={loading}
        >{loading ? "Loading..." : "Explore"}</button>
      </form>
      {searched && (loading ? (
        <div style={{marginTop:14}}>Loading...</div>
      ) : error ? (
        <div style={{color:"crimson",marginTop:14}}>{error}</div>
      ) : results ? (
        <div>
          <h3 style={{marginTop:0}}>Signals</h3>
          {results.signals && results.signals.length > 0 ?
            <ul style={{marginLeft:10}}>
              {results.signals.map((sig, i) =>
                <li key={i} style={{fontFamily:"monospace", fontSize:15}}>
                  {Object.entries(sig).map(([k,v])=>
                    <span key={k}><b>{k}:</b> {v} </span>
                  )}
                </li>
              )}
            </ul>
            : <div>No signals found for this asset/timeframe.</div>
          }
          <div style={{marginTop:18}}>
            <b>Sentiment:</b> <span style={{
              color: results.sentiment > 0.2 ? "#11be3e" : results.sentiment < -0.2 ? "crimson" : "#ffa700",
              fontWeight: 500
            }}>
              {results.sentiment > 0.2 ? "Bullish" : results.sentiment < -0.2 ? "Bearish" : "Neutral"}
            </span>{" "}
            <span style={{marginLeft:12, fontSize:13, color:"#888"}}>
              ({results.sentiment})
            </span>
          </div>
        </div>
      ) : (
        <div style={{marginTop:14}}>No results yet.</div>
      ))}
    </div>
  );
}
