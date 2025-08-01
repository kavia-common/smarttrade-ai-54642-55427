import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GlobalStateProvider } from "./contexts/GlobalStateContext";
import { ApiProvider } from "./contexts/ApiContext";

// Pages
import Onboarding from "./pages/Onboarding";
import KYC from "./pages/KYC";
import Dashboard from "./pages/Dashboard";
import Signals from "./pages/Signals";
import Portfolio from "./pages/Portfolio";
import Trading from "./pages/Trading";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider initialTheme="dark">
          <GlobalStateProvider>
            <ApiProvider>
              <div className="main-layout">
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/kyc" element={<KYC />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/signals" element={<Signals />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/trading" element={<Trading />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<div style={{ padding: 40 }}><h1>404 – Not Found</h1></div>} />
                  </Routes>
                </div>
              </div>
            </ApiProvider>
          </GlobalStateProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
