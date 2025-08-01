import React, { createContext, useContext, useState } from "react";

export const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  // Add app-wide state as needed
  const [notificationBanner, setNotificationBanner] = useState(null);

  return (
    <GlobalStateContext.Provider value={{ notificationBanner, setNotificationBanner }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
