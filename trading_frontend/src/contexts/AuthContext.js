import React, { createContext, useState, useContext } from "react";

// PUBLIC_INTERFACE
export const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * AuthContextProvider provides authentication information and logic for the children components.
 */
export function AuthProvider({ children }) {
  // Placeholder state: In production, sync this with actual auth logic/API.
  const [user, setUser] = useState(null);

  // PUBLIC_INTERFACE
  const login = (userData) => setUser(userData);

  // PUBLIC_INTERFACE
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * useAuth returns the current auth context.
 */
export function useAuth() {
  return useContext(AuthContext);
}
