//
// PUBLIC_INTERFACE
// WebSocket wrapper for real-time data, Notification, Signals, etc.
// Stub: not actively used until component integration.
//

/**
 * Creates a WebSocket client connection for live features.
 * @param {string} endpoint - Relative or absolute ws:// URL.
 * @param {function} onMessage - Callback for each message event.
 * @param {function=} onError - Callback for error event.
 * @returns {WebSocket} WebSocket instance (caller should close when finished)
 */
export function createWebSocket(endpoint, onMessage, onError) {
  // Allow both ws:// and wss:// or relative paths
  let ws;
  try {
    ws = new window.WebSocket(endpoint);
    ws.onmessage = (e) => onMessage(e.data);
    ws.onerror = (e) => onError && onError(e);
  } catch (err) {
    onError && onError(err);
    return null;
  }
  return ws;
}

// PUBLIC_INTERFACE
// Special helper for the backend's notification websocket (see /api/notifications/websocket-doc):
export function connectNotificationWebSocket({ onMessage, onError }) {
  // Endpoint e.g. ws://localhost:3001/ws/notifications or configured via ENV
  // Use WSS for production by replacing http(s) with ws(s)
  let wsUrl = process.env.REACT_APP_WS_URL;
  if (!wsUrl && process.env.REACT_APP_API_URL) {
    wsUrl = process.env.REACT_APP_API_URL.replace(/^http/, "ws").replace(/\/api$/, "/ws/notifications");
  }
  if (!wsUrl) {
    wsUrl = "ws://localhost:3001/ws/notifications";
  }
  return createWebSocket(wsUrl, onMessage, onError);
}
