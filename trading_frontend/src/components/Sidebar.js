import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// Sidebar labels and route paths
const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Signals", path: "/signals" },
  { label: "Trading", path: "/trading" },
  { label: "Notifications", path: "/notifications" },
  { label: "Settings", path: "/settings" }
];

/**
 * PUBLIC_INTERFACE
 * Sidebar renders navigation for all major app views.
 */
export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-title">SmartTrade.AI</div>
      <ul className="sidebar-nav">
        {navItems.map(({ label, path }) => (
          <li key={path}>
            <NavLink to={path} className={({ isActive }) => isActive ? "active" : ""}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
