import React, { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { getApiErrorMessage } from "../api/apiError";
import { connectNotificationWebSocket } from "../api/websocket";

/**
 * PUBLIC_INTERFACE
 * Notifications: Shows alert list from API and real-time websocket events.
 */
export default function Notifications() {
  const { NotificationsAPI } = useApi();
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);
  const [wsMsg, setWsMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch from REST on mount
  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      try {
        const res = await NotificationsAPI.listNotifications();
        setNotifications(res.notifications || []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
      setLoading(false);
    }
    fetchList();
  }, [NotificationsAPI]);

  // WebSocket live updates
  useEffect(() => {
    const socket = connectNotificationWebSocket({
      onMessage: (msg) => {
        setWsMsg(msg);
        // For demo, add new notification
        setNotifications(prev =>
          [{ id: "ws-"+Date.now(), type: "live", content: msg, read: false }, ...prev]
        );
      },
      onError: (err) => setWsMsg("WebSocket error: "+(err?.toString()||""))
    });
    setWs(socket);
    return () => { socket && socket.close(); };
  }, []);

  return (
    <div className="page-container" style={{maxWidth: 620}}>
      <h1>Notifications & Alerts</h1>
      {error && <div style={{color:"crimson"}}>{error}</div>}
      {wsMsg && <div style={{color:"#d38009",marginBottom:10,fontSize: 13}}>Live: {wsMsg}</div>}
      <div style={{
        maxHeight: 350, overflowY: "auto", borderRadius: 7, background: "#282a35",
        border: "1px solid #1e2534", margin: "22px 0 0 0"
      }}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Content</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(notifications||[]).map((n, i) => (
              <tr key={n.id || i} style={{background: n.read ? "#2226" : "#ffa70011"}}>
                <td style={{padding:"8px"}}>{n.type}</td>
                <td>{n.content}</td>
                <td>{n.read ? "Read" : <span style={{color:"#ffa700"}}>New</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div style={{margin:12, color:"#aaa"}}>Loading...</div>}
        {(notifications.length === 0 && !loading) && (
          <div style={{margin:12, color:"#aaa"}}>No notifications yet.</div>
        )}
      </div>
    </div>
  );
}
