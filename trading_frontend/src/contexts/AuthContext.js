import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * AuthContext manages user authentication state and JWT session token.
 */
export const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * AuthProvider provides authentication status, user info, and helpers. 
 * Synchronizes JWT token to localStorage and propagates authorization.
 */
export function AuthProvider({ children }) {
  // Holds {user: {...}, accessToken: string}
  const [auth, setAuth] = useState(() => {
    try {
      const v = localStorage.getItem("auth");
      return v ? JSON.parse(v) : { user: null, accessToken: null };
    } catch {
      return { user: null, accessToken: null };
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    if (!auth || (!auth.user && !auth.accessToken)) {
      localStorage.removeItem("auth");
    } else {
      localStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);

  // PUBLIC_INTERFACE
  const login = (userData, accessToken) => {
    setAuth({ user: userData, accessToken });
  };

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setAuth({ user: null, accessToken: null });
    localStorage.removeItem("auth");
  }, []);

  // PUBLIC_INTERFACE
  const isLoggedIn = !!auth.accessToken;

  // PUBLIC_INTERFACE
  const getAuthHeader = () =>
    auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {};

  // PUBLIC_INTERFACE
  const setUser = (userData) => setAuth((prev) => ({ ...prev, user: userData }));

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        accessToken: auth.accessToken,
        login,
        logout,
        isLoggedIn,
        getAuthHeader,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * useAuth returns the current authentication context and helpers.
 */
export function useAuth() {
  return useContext(AuthContext);
}
