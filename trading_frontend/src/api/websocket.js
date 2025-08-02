//
// PUBLIC_INTERFACE
// WebSocket wrapper for notifications and other real-time UI, pinned to backend base URL.
//
// This frontend is configured to always use:
//     ws://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/ws/notifications
// For CORS, mixed-content, and browser restrictions: If you deploy the frontend as HTTPS but backend as HTTP (or ws:// not wss://), browser may block the websocket connection. This is detected and explained explicitly in user-visible error messages.
//

const WS_BACKEND_URL = "ws://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/ws/notifications";

/**
 * Creates a WebSocket connection, catches all errors and provides robust diagnostics for CORS/mixed-content issues.
 * @param {string} endpoint - Absolute ws:// or wss:// URL.
 * @param {function} onMessage - Callback for incoming messages.
 * @param {function=} onError - Callback for error/mixed-content issues.
 */
export function createWebSocket(endpoint, onMessage, onError) {
  let ws;
  try {
    ws = new window.WebSocket(endpoint);
    ws.onmessage = (e) => onMessage(e.data);
    ws.onerror = (e) => {
      // Browsers may not provide details!
      if (onError) {
        onError({
          message:
            "WebSocket error: Could not connect to backend. If the frontend is served with HTTPS and backend endpoint is ws:// (not wss://), " +
            "this will be blocked by browsers. Deploy both backend and frontend as HTTPS (wss:// for backend)."
        });
      }
    };
  } catch (err) {
    onError &&
      onError({
        message:
          "WebSocket connection failed. This may be due to browser security policy regarding mixed content (HTTPS frontend, ws:// backend). " +
          "Consult the documentation or deploy backend as HTTPS.",
        err,
      });
    return null;
  }
  return ws;
}

// PUBLIC_INTERFACE
/**
 * Special helper for notification updates, always uses backend URL defined above (see README).
 */
export function connectNotificationWebSocket({ onMessage, onError }) {
  return createWebSocket(WS_BACKEND_URL, onMessage, onError);
}
