

import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Listen for route changes

const handleLogout = useCallback(() => {
  localStorage.clear(); // Clears token, role, etc.
  setIsAuthenticated(false);
  setUser(null);
  navigate("/login");
  window.dispatchEvent(new Event("storage")); // Syncs other components
}, [navigate]); // Only recreates if navigate changes


  useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // 1. Define decoded
        const currentTime = Date.now() / 1000; // 2. Define currentTime

        if (decoded.exp < currentTime) {
          handleLogout();
        } else {
          setIsAuthenticated(true);
          setUser(decoded); // Now decoded is accessible here
        }
      } catch (error) {
        console.error("Token decoding failed", error);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  checkAuth();
  
  window.addEventListener("storage", checkAuth);
  return () => window.removeEventListener("storage", checkAuth);
}, [location, handleLogout]);
  const closeMenu = () => setMenuOpen(false);

 
  // Check roles (Handling both common casing for 'role')
  const isAdmin = user?.accountType === "Admin" || user?.role === "Admin" || user?.Role === "Admin";
    
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-logo">
          <img src="/logo2.jpeg" alt="Logo" />
          <span>Labour Party</span>
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {!isAuthenticated ? (
            /* --- PUBLIC NAV --- */
            <>
              <NavLink to="/register" className="nav-link" onClick={closeMenu}>
                Register
              </NavLink>
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/reset-password" className="nav-link" onClick={closeMenu}>
                Create/Reset Password
              </NavLink>
            </>
          ) : (
            /* --- PRIVATE NAV --- */
            <>
              <NavLink 
                to={isAdmin ? "/adminDashboard" : "/dashboard"} 
                className="nav-link" 
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>

              {!isAdmin && (
                <NavLink to="/modify-details" className="nav-link" onClick={closeMenu}>
                  Modify Details
                </NavLink>
              )}

              <NavLink to="/reset-password" className="nav-link" onClick={closeMenu}>
                Create/Reset Password
              </NavLink>

              <button
                className="nav-link logout-btn"
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                  padding: "0",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
