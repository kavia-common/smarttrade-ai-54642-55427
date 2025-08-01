import React, { createContext, useState, useEffect, useContext } from "react";

// PUBLIC_INTERFACE
export const ThemeContext = createContext();

/**
 * PUBLIC_INTERFACE
 * ThemeProvider supplies current theme and a toggle function.
 */
export function ThemeProvider({ children, initialTheme = "dark" }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTheme() {
  return useContext(ThemeContext);
}
