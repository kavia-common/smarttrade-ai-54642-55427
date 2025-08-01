import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { getApiErrorMessage } from "../api/apiError";

/**
 * PUBLIC_INTERFACE
 * Settings: Update account info and manage API keys.
 */
export default function Settings() {
  const { SettingsAPI } = useApi();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [apiMsg, setApiMsg] = useState("");
  const [error, setError] = useState("");
  const [keysLoading, setKeysLoading] = useState(true);

  // Load settings & API keys on mount
  useEffect(() => {
    async function loadAll() {
      setKeysLoading(true);
      setError("");
      try {
        // No 'getSettings' endpoint -- just allow updating
        const keys = await SettingsAPI.listApiKeys();
        setApiKeys(keys.api_keys || []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
      setKeysLoading(false);
    }
    loadAll();
  }, [SettingsAPI]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const resp = await SettingsAPI.updateSettings({ email, full_name: fullName, notifications_enabled: notifEnabled });
      setApiMsg(resp.status + ": " + (resp.detail || ""));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setSaving(false);
  }

  async function createKey() {
    setSaving(true);
    setError("");
    try {
      const resp = await SettingsAPI.createApiKey();
      setApiKeys(k => [resp.api_key, ...k]);
      setApiMsg("API Key created: " + resp.api_key);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setSaving(false);
  }
  async function revokeKey(api_key_id) {
    setSaving(true); setError("");
    try {
      await SettingsAPI.revokeApiKey(api_key_id);
      setApiKeys(keys => keys.filter(k => k !== api_key_id));
      setApiMsg("API Key revoked");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setSaving(false);
  }

  return (
    <div className="page-container" style={{maxWidth:480}}>
      <h1>Settings</h1>
      <form onSubmit={handleSave} style={{display:"flex",flexDirection:"column",gap:12}}>
        <label>
          Email
          <input style={{padding:6,marginTop:4}} value={email} onChange={e=>setEmail(e.target.value)} type="email" disabled={saving}/>
        </label>
        <label>
          Full Name
          <input style={{padding:6,marginTop:4}} value={fullName} onChange={e=>setFullName(e.target.value)} type="text" disabled={saving}/>
        </label>
        <label>
          Notifications <input type="checkbox" checked={notifEnabled} onChange={e=>setNotifEnabled(e.target.checked)} disabled={saving}/>
        </label>
        <button className="btn btn-large" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</button>
      </form>
      <hr style={{margin:"22px 0"}}/>
      <div>
        <h3>API Keys</h3>
        <button className="btn" onClick={createKey} disabled={saving}>{saving ? "Working..." : "Create New API Key"}</button>
        {keysLoading && <div>Loading keys...</div>}
        <ul style={{marginTop:12}}>
          {(apiKeys || []).map(k => (
            <li key={k} style={{display:"flex",alignItems:"center",gap:9,background:"#232333",padding:"3px 7px",borderRadius:5}}>
              <span style={{fontFamily:"monospace"}}>{k}</span>
              <button className="btn" style={{fontSize:12,padding:"3px 10px"}} onClick={()=>revokeKey(k)} disabled={saving}>Revoke</button>
            </li>
          ))}
        </ul>
      </div>
      {(apiMsg || error) && <div style={{marginTop:10, color: error ? "crimson" : "#167f42"}}>{error || apiMsg}</div>}
    </div>
  );
}
