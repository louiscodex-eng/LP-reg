import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FormCard from "../components/FormCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [regId, setRegId] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("Membership"); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("type") === "admin") {
      setLoginType("Administrative");
    }

    const setToAdmin = () => setLoginType("Administrative");
    const setToMember = () => setLoginType("Membership");

    window.addEventListener('loginTypeAdmin', setToAdmin);
    window.addEventListener('loginTypeMember', setToMember);

    return () => {
      window.removeEventListener('loginTypeAdmin', setToAdmin);
      window.removeEventListener('loginTypeMember', setToMember);
    };
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isAdmin = loginType === "Administrative";
    const apiUrl = isAdmin 
      ? "https://govtregistrationapi.onrender.com/api/Admin/login" 
      : "https://govtregistrationapi.onrender.com/api/Registration/login";

    const payload = isAdmin 
      ? { username: regId, password: password } 
      : { RegID: regId, Password: password };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // --- THE FIX IS HERE ---
      localStorage.setItem("token", data.token);
      
      if (isAdmin) {
        // Use values directly from API response, not the loginType state
        localStorage.setItem("role", data.role);     // This will be "National"
        localStorage.setItem("access", data.access); // This will be "Write"
        localStorage.setItem("username", data.username || regId);
      } else {
        localStorage.setItem("regId", data.regId);
        localStorage.setItem("role", "Member");
      }
      // -----------------------

      toast.success(data.message || "Login successful! Redirecting...");

      setTimeout(() => {
        if (isAdmin) {
          navigate("/adminDashboard");
        } else {
          navigate("/dashboard");
        }
      }, 800);

    } catch (error) {
      toast.error(error.message || "Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container pt-5">
        <ToastContainer />
        <FormCard title={`${loginType} Login`}>
          
          {/* --- MODERN TOGGLE PILL --- */}
          <div className="mb-4">
            <label className="form-label d-block text-center small fw-bold text-muted mb-3">
              PLEASE SELECT LOGIN ACCOUNT TYPE
            </label>
            <div 
              className="d-flex p-1 bg-light rounded-pill border" 
              style={{ position: "relative", cursor: "pointer" }}
            >
              <div
                onClick={() => setLoginType("Membership")}
                className={`flex-grow-1 text-center py-2 rounded-pill transition-all ${
                  loginType === "Membership" 
                    ? "bg-success text-white shadow-sm" 
                    : "text-muted"
                }`}
                style={{ fontSize: "14px", fontWeight: "600", transition: "0.3s" }}
              >
                Membership
              </div>
              <div
                onClick={() => setLoginType("Administrative")}
                className={`flex-grow-1 text-center py-2 rounded-pill transition-all ${
                  loginType === "Administrative" 
                    ? "bg-success text-white shadow-sm" 
                    : "text-muted"
                }`}
                style={{ fontSize: "14px", fontWeight: "600", transition: "0.3s" }}
              >
                Administrative
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                className="form-control py-2"
                style={{ borderRadius: "8px" }}
                placeholder={loginType === "Administrative" ? "Admin Username" : "Registration ID"}
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
                required
              />
            </div>

           {/* --- PASSWORD FIELD WITH EYE ICON --- */}
            <div className="mb-1">
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control py-2"
                  style={{ 
                    borderTopLeftRadius: "8px", 
                    borderBottomLeftRadius: "8px",
                    borderRight: "none" 
                  }}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span 
                  className="input-group-text bg-white" 
                  style={{ 
                    borderTopRightRadius: "8px", 
                    borderBottomRightRadius: "8px",
                    borderLeft: "none",
                    cursor: "pointer",
                    color: "#6c757d"
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="text-end mb-4">
              <Link 
                to="/reset-password" 
                className="text-success text-decoration-none small fw-bold"
              >
                Forgot Password? Reset here
              </Link>
            </div>
            <button 
              className="btn btn-success w-100 py-2 d-flex justify-content-center align-items-center" 
              disabled={loading}
              style={{ borderRadius: "8px", fontWeight: "600" }}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" /> Logging in...</>
              ) : ("Login")}
            </button>
          </form>
        </FormCard>
      </div>
    </>
  );
};

export default Login;