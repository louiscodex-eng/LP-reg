// // import { useState, useEffect } from "react";

// // import { NavLink, useNavigate } from "react-router-dom";

// // import "./Navbar.css";
// // import {jwtDecode} from "jwt-decode"



// // function Navbar() {

// //   const [menuOpen, setMenuOpen] = useState(false);

// //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// //   const navigate = useNavigate();
// // const [user, setUser] = useState(null);

// // useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       try {
// //         const decoded = jwtDecode(token);
// //         setUser(decoded); 
// //         // Note: Check if your token uses 'role', 'Role', or 'http://.../role'
// //       } catch (error) {
// //         console.error("Token decoding failed", error);
// //       }
// //     }
// //   }, []);

// //   const handleDashboardRedirect = () => {
// //     if (!user) return navigate("/login");
    
// //     // Reroute based on role
// //     if (user.role === "Admin" || user.Role === "Admin") {
// //       navigate("/adminDashboard");
// //     } else {
// //       navigate("/dashboard");
// //     }
// //   };

// //   useEffect(() => {

// //     // Check if user is logged in

// //     const token = localStorage.getItem("token");

// //     setIsAuthenticated(!!token);

// //   }, []);



// //   const closeMenu = () => setMenuOpen(false);



// //   const handleLogout = () => {

// //     localStorage.removeItem("token");

// //     setIsAuthenticated(false);

// //     closeMenu();

// //     navigate("/login");

// //   };



// //   return (

// //     <nav className="navbar">

// //       <div className="navbar-inner">

// //         {/* Logo */}

// //         <div className="nav-logo">

// //           <img src="/logo2.png" alt="Logo" />

// //           <span>Labour Party</span>

// //         </div>



// //         {/* Links - Conditional based on authentication */}

// //         <div className={`nav-links ${menuOpen ? "open" : ""}`}>

// //           {!isAuthenticated ? (

// //             // Show these links when NOT logged in

// //             <>

// //               <NavLink to="/register" className="nav-link" onClick={closeMenu}>

// //                 Register

// //               </NavLink>



// //               <NavLink to="/login" className="nav-link" onClick={closeMenu}>

// //                 Login

// //               </NavLink>



// //                <NavLink

// //                 to="/reset-password"

// //                 className="nav-link"

// //                 onClick={closeMenu}

// //               >

// //                 Reset Password

// //               </NavLink>

// //             </>

// //           ) : (

// //             // Show these links when logged in

// //             <>

// //               <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>

// //                 Dashboard

// //               </NavLink>



// //               <NavLink

// //                 to="/modify-details"

// //                 className="nav-link"

// //                 onClick={closeMenu}

// //               >

// //                 Modify Details

// //               </NavLink>



// //               <NavLink

// //                 to="/reset-password"

// //                 className="nav-link"

// //                 onClick={closeMenu}

// //               >

// //                 Reset Password

// //               </NavLink>



// //               <button

// //                 className="nav-link logout-btn"

// //                 onClick={handleLogout}

// //                 style={{

// //                   background: "none",

// //                   border: "none",

// //                   cursor: "pointer",

// //                   color: "inherit",

// //                   padding: "0",

// //                 }}

// //               >

// //                 Logout

// //               </button>

// //             </>

// //           )}

// //         </div>



// //         {/* Hamburger */}

// //         <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>

// //           ☰

// //         </div>

// //       </div>

// //     </nav>

// //   );

// // }



// // export default Navbar;

// import { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import "./Navbar.css";
// import { jwtDecode } from "jwt-decode";

// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsAuthenticated(true);
//       try {
//         const decoded = jwtDecode(token);
//         setUser(decoded);
//       } catch (error) {
//         console.error("Token decoding failed", error);
//       }
//     } else {
//       setIsAuthenticated(false);
//       setUser(null);
//     }
//   }, []);

//   const closeMenu = () => setMenuOpen(false);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     setUser(null);
//     closeMenu();
//     navigate("/login");
//   };

//   // Helper to check if the logged-in user is an Admin
//   const isAdmin = user?.accountType === "Admin";

//   return (
//     <nav className="navbar">
//       <div className="navbar-inner">
//         <div className="nav-logo">
//           <img src="/logo2.png" alt="Logo" />
//           <span>Labour Party</span>
//         </div>

//         <div className={`nav-links ${menuOpen ? "open" : ""}`}>
//           {!isAuthenticated ? (
//             <>
//               <NavLink to="/register" className="nav-link" onClick={closeMenu}>
//                 Register
//               </NavLink>
//               <NavLink to="/login" className="nav-link" onClick={closeMenu}>
//                 Login
//               </NavLink>
//               <NavLink to="/reset-password" className="nav-link" onClick={closeMenu}>
//                 Reset Password
//               </NavLink>
//             </>
//           ) : (
//             <>
//               {/* Dashboard Link: Points to Admin or User path based on accountType */}
//               <NavLink 
//                 to={isAdmin ? "/adminDashboard" : "/dashboard"} 
//                 className="nav-link" 
//                 onClick={closeMenu}
//               >
//                 Dashboard
//               </NavLink>

//               {/* Modify Details: ONLY shows if the user is NOT an admin */}
//               {!isAdmin && (
//                 <NavLink to="/modify-details" className="nav-link" onClick={closeMenu}>
//                   Modify Details
//                 </NavLink>
//               )}

//               <NavLink to="/reset-password" className="nav-link" onClick={closeMenu}>
//                 Reset Password
//               </NavLink>

//               <button
//                 className="nav-link logout-btn"
//                 onClick={handleLogout}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   color: "inherit",
//                   padding: "0",
//                 }}
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>

//         <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
//           ☰
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

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
          <img src="/logo2.png" alt="Logo" />
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
                Reset Password
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
                Reset Password
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
