import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { getApiErrorMessage } from "../api/apiError";

/**
 * PUBLIC_INTERFACE
 * Portfolio page: Shows holdings and allows (demo) allocation/rebalance.
 */
export default function Portfolio() {
  const { PortfolioAPI, DashboardAPI } = useApi();
  const [portfolio, setPortfolio] = useState(null);
  const [allocationData, setAllocationData] = useState("");
  const [allLoading, setAllLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [error, setError] = useState("");

  async function fetchPortfolio() {
    setAllLoading(true);
    setError("");
    try {
      const resp = await DashboardAPI.getPortfolio();
      setPortfolio(resp);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setPortfolio(null);
    }
    setAllLoading(false);
  }

  useEffect(() => { fetchPortfolio(); }, []);

  async function handleAllocate(e) {
    e.preventDefault();
    setAllLoading(true);
    setError("");
    setResultMsg("");
    try {
      // Parse JSON allocation input
      let allocations = JSON.parse(allocationData);
      if (!Array.isArray(allocations)) allocations = [allocations];
      const resp = await PortfolioAPI.allocatePortfolio(allocations);
      setResultMsg(resp.status+": "+resp.message);
      fetchPortfolio();
    } catch (err) {
      setError("Allocation failed: "+getApiErrorMessage(err));
    }
    setAllLoading(false);
  }

  return (
    <div className="page-container" style={{maxWidth:610}}>
      <h1>Portfolio</h1>
      {error && <div style={{color:"crimson", fontWeight:"bold"}}>{error}</div>}
      <div style={{margin:"1.2em 0"}}>
        <h3>Current Holdings</h3>
        {allLoading || !portfolio
          ? <div>Loading...</div>
          : <table style={{width:"100%",background:"rgba(39,41,55,0.97)",borderRadius:8}}>
              <thead>
                <tr style={{color:"#62dfff"}}>
                  <th style={{padding:"8px"}}>Symbol</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {(portfolio.positions || []).map((pos, i) =>
                  <tr key={i}>
                    <td style={{padding:"7px"}}>{pos.symbol || pos.asset || "-"}</td>
                    <td>${pos.value ? pos.value.toLocaleString() : "--"}</td>
                  </tr>
                )}
              </tbody>
            </table>
        }
      </div>
      <div style={{marginTop:"2.4em"}}>
        <h3>Set Target Allocations (JSON array demo)</h3>
        <form onSubmit={handleAllocate} style={{display:"flex",gap:10,flexDirection:"column"}}>
          <textarea
            value={allocationData}
            onChange={e=>setAllocationData(e.target.value)}
            rows={3}
            placeholder={`Example: [{"symbol":"AAPL","value":12000},{"symbol":"SPY","value":6000}]`}
            style={{width:"100%", minHeight:68,borderRadius:8,background:"#191a23",color:"white",border:"1px solid #444",padding:"0.8em"}}
            disabled={allLoading}
          />
          <button className="btn" type="submit" disabled={allLoading || !allocationData.trim()}>Set Allocations</button>
          {resultMsg && <span style={{color:"#23c18d"}}>{resultMsg}</span>}
        </form>
      </div>
    </div>
  );
}
