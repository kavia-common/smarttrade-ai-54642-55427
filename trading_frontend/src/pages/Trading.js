import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { getApiErrorMessage } from "../api/apiError";

/**
 * PUBLIC_INTERFACE
 * Trading UI: manual order form and result, for trade execution via backend API.
 */
export default function Trading() {
  const { TradingAPI } = useApi();
  const [symbol, setSymbol] = useState("");
  const [action, setAction] = useState("buy");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrade(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const resp = await TradingAPI.executeTrade({
        symbol,
        action,
        quantity: Number(quantity),
        price: price !== "" ? Number(price) : null
      });
      setResult(`Trade ${resp.status}: ${resp.detail||""} Order ID: ${resp.trade_id||"-"}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setLoading(false);
  }

  return (
    <div className="page-container" style={{maxWidth:480}}>
      <h1>Trading</h1>
      <form onSubmit={handleTrade} style={{display:"flex",flexDirection:"column",gap:12}}>
        <label>
          Symbol (e.g. <b>AAPL</b>)
          <input
            style={{width:"100%",padding:8,marginTop:4}}
            value={symbol}
            required
            disabled={loading}
            onChange={e=>setSymbol(e.target.value)}
          />
        </label>
        <label>
          Action
          <select
            style={{width:"100%",padding:8,marginTop:4}}
            value={action}
            disabled={loading}
            onChange={e=>setAction(e.target.value)}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <label>
          Quantity
          <input
            type="number"
            style={{width:"100%",padding:8,marginTop:4}}
            min={1}
            value={quantity}
            required
            disabled={loading}
            onChange={e=>setQuantity(e.target.value)}
          />
        </label>
        <label>
          Limit Price&nbsp;<span style={{fontSize:12,color:"#bbb"}}>(Optional)</span>
          <input
            type="number"
            style={{width:"100%",padding:8,marginTop:4}}
            value={price}
            min={0}
            disabled={loading}
            onChange={e=>setPrice(e.target.value)}
            placeholder="(optional)"
          />
        </label>
        <button className="btn btn-large" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Trade"}</button>
      </form>
      {result && <div style={{marginTop: 16, color:"limegreen", fontWeight:500}}>{result}</div>}
      {error && <div style={{marginTop: 16, color:"crimson", fontWeight:500}}>{error}</div>}
    </div>
  );
}
