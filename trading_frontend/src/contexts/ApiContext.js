import React, { createContext, useContext, useState, useCallback } from "react";
import * as AuthAPIBase from "../api/auth";
import * as OnboardingAPIBase from "../api/onboarding";
import * as DashboardAPIBase from "../api/dashboard";
import * as SignalsAPIBase from "../api/signals";
import * as PortfolioAPIBase from "../api/portfolio";
import * as TradingAPIBase from "../api/trading";
import * as NotificationsAPIBase from "../api/notifications";
import * as SettingsAPIBase from "../api/settings";
import { getApiErrorMessage } from "../api/apiError";
import { useAuth } from "./AuthContext";

/**
 * PUBLIC_INTERFACE
 * ApiContext provides all API modules and helper functions, auto-attaching user JWT tokens.
 */
export const ApiContext = createContext({});

export function ApiProvider({ children }) {
  const { getAuthHeader, logout } = useAuth();

  // Utility: Attach Authorization header (if JWT present)
  function injectAuthHeaders(opts = {}) {
    return {
      ...opts,
      headers: { ...(opts.headers || {}), ...getAuthHeader() },
      credentials: "include", // for cookies/session support if backend uses; safe w/ JWT
    };
  }

  // --- WRAPPED API MODULES with JWT header injection on every request ---

  // For each API method, auto inject Authorization
  function wrapApi(apiModule) {
    const api = {};
    for (const k in apiModule) {
      if (typeof apiModule[k] === "function") {
        api[k] = async (...args) => {
          try {
            // Infer options object if last argument is an options and supports headers
            // But our existing API modules use fetch directly, we override fetch globally below instead
            // So simply forward arguments
            return await apiModule[k](...args, getAuthHeader());
          } catch (err) {
            // Session expiration logic (HTTP error 401)
            if ((err?.err && (err.err.status === 401 || err.err.detail === "Not authenticated")) ||
                (err && err.status === 401)) {
              logout();
              throw { ...err, err: { ...err.err, detail: "Session expired. Please login again." }};
            }
            throw err;
          }
        };
      }
    }
    return api;
  }

  // --- Dashboard Data Demo: Caching logic ---
  const [dashboardPortfolio, setDashboardPortfolio] = useState(null);
  const [dashboardError, setDashboardError] = useState(null);

  // PUBLIC_INTERFACE
  const fetchDashboardPortfolio = useCallback(async () => {
    try {
      setDashboardError(null);
      const result = await DashboardAPI.getPortfolio();
      setDashboardPortfolio(result);
      return result;
    } catch (err) {
      setDashboardError(getApiErrorMessage(err));
      setDashboardPortfolio(null);
      throw err;
    }
  }, []);

  // -- Exported API context object --
  const AuthAPI = wrapApi(AuthAPIBase);
  const OnboardingAPI = wrapApi(OnboardingAPIBase);
  const DashboardAPI = wrapApi(DashboardAPIBase);
  const SignalsAPI = wrapApi(SignalsAPIBase);
  const PortfolioAPI = wrapApi(PortfolioAPIBase);
  const TradingAPI = wrapApi(TradingAPIBase);
  const NotificationsAPI = wrapApi(NotificationsAPIBase);
  const SettingsAPI = wrapApi(SettingsAPIBase);

  const value = {
    AuthAPI,
    OnboardingAPI,
    DashboardAPI,
    SignalsAPI,
    PortfolioAPI,
    TradingAPI,
    NotificationsAPI,
    SettingsAPI,
    dashboardPortfolio,
    dashboardError,
    fetchDashboardPortfolio,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useApi returns the API context object for use in components.
 */
export function useApi() {
  return useContext(ApiContext);
}
