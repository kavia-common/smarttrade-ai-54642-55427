import React, { createContext, useContext, useState, useCallback } from "react";
import * as AuthAPI from "../api/auth";
import * as OnboardingAPI from "../api/onboarding";
import * as DashboardAPI from "../api/dashboard";
import * as SignalsAPI from "../api/signals";
import * as PortfolioAPI from "../api/portfolio";
import * as TradingAPI from "../api/trading";
import * as NotificationsAPI from "../api/notifications";
import * as SettingsAPI from "../api/settings";
import { getApiErrorMessage } from "../api/apiError";

// PUBLIC_INTERFACE
export const ApiContext = createContext({});

// PUBLIC_INTERFACE
export function ApiProvider({ children }) {
  // Example: Caching dashboard data as demo –
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

  // Add similar logic for other API areas as needed (could be further modularized)

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

// PUBLIC_INTERFACE
export function useApi() {
  return useContext(ApiContext);
}
