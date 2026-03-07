// import { useState } from "react"; 
// import Navbar from "../components/Navbar";
// import FormCard from "../components/FormCard";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const ResetPassword = () => {
//   const [step, setStep] = useState(1);
//   const [regId, setRegId] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
// const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // ===== Send OTP Step =====
//   const handleSendOtp = async () => {
//     if (!regId) return toast.error("Please enter your Registration ID");
//     setLoading(true);

//     try {
//       const verifyRes = await fetch(`https://govtregistrationapi.onrender.com/api/Registration/verify/${regId}`);
//       const verifyData = await verifyRes.json();

//       if (!verifyRes.ok) {
//         throw new Error(verifyData.message || "Invalid Registration ID");
//       }
//       // If valid, call your Email OTP endpoint here
//       // const otpRes = await fetch("...");
//       setStep(2);
//       toast.success("OTP sent to your registered phone number");
//     } catch (error) {
//       toast.error(error.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };


//   // ===== Verify OTP Step =====
//   const handleVerifyOtp = () => {
//     if (!otp) return toast.error("Please enter the OTP");
//     // For now we skip actual OTP verification
//     setStep(3);
//     toast.success("OTP verified successfully");
//   };

//   // ===== Reset Password Step =====
//   const handleResetPassword = async () => {
//     if (!password || !confirm) return toast.error("Fill all fields");
//     if (password !== confirm) return toast.error("Passwords do not match");

//     setLoading(true);

//     try {
//       const response = await fetch(
//         "https://govtregistrationapi.onrender.com/api/Registration/reset-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ RegID: regId, Password: password }),
//         }
//       );

//       const data = await response.text();

//       if (!response.ok) {
//         throw new Error(data.message || "Password reset failed");
//       }

//       toast.success(data.message || "Password set successfully 🎉");
//       setStep(4);

//       // Redirect to login after 2s
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (error) {
//       toast.error(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

import { useState } from "react"; 
import Navbar from "../components/Navbar";
import FormCard from "../components/FormCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [regId, setRegId] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Store email for OTP steps
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // API Base URL - Update this based on environment
  const API_BASE = "https://govtregistrationapi.onrender.com/api/Registration";

  // ===== Step 1: Verify User & Send Email OTP =====
  const handleSendOtp = async () => {
    if (!regId) return toast.error("Please enter your Registration ID");
    setLoading(true);

    try {
      // 1. First Verify the RegID exists
      const verifyRes = await fetch(`${API_BASE}/verify/${regId}`);
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) throw new Error(verifyData.message || "Invalid Registration ID");

      // Extract details needed for OTP
      const email = verifyData.data.email || verifyData.data.Email; // Adjust based on your API response casing
      const firstName = verifyData.data.fullName.split(' ')[0];

      if (!email) throw new Error("No registered email found for this ID. Please contact support.");
      
      setUserEmail(email);

      // 2. Call the Send OTP Endpoint
      const otpRes = await fetch(`${API_BASE}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, FirstName: firstName })
      });

      if (!otpRes.ok) throw new Error("Failed to trigger OTP email. Try again.");

      setStep(2);
      toast.success(`OTP sent to ${email.replace(/(.{3})(.*)(?=@)/, "$1***")}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 2: Verify Email OTP =====
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: userEmail, Otp: otp })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Invalid or expired OTP");

      setStep(3);
      toast.success("Identity verified successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 3: Reset Password =====
  const handleResetPassword = async () => {
    if (!password || !confirm) return toast.error("Fill all fields");
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RegID: regId, Password: password }),
      });

      // Your backend returns text/plain for success sometimes, handle both
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) throw new Error(data.message || "Password reset failed");

      toast.success(data.message || "Password set successfully");
      setStep(4);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className="container pt-4">
        <FormCard title="Reset Password">

          {step === 1 && (
            <>
              <input
                className="form-control mb-3"
                placeholder="Registration ID"
                type="number"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
              />
              <button
                className="btn btn-success w-100"
                disabled={loading}
                onClick={handleSendOtp}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending OTP...
                  </>
                ) : "Send OTP to my registered email address"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
              type="text"
                className="form-control mb-2"
                placeholder="Enter OTP sent your registered email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="btn btn-success w-100"
                disabled={loading}
                onClick={handleVerifyOtp}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Verifying OTP...
                  </>
                ) : "Verify OTP"}
              </button>
            </>
          )}

     {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <div className="step-content">
              <label className="form-label fw-bold">New Password</label>
              <div className="input-group mb-3">
                <input 
                  type={showPass ? "text" : "password"} 
                  className="form-control" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <label className="form-label fw-bold">Confirm Password</label>
              <div className="input-group mb-4">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  className="form-control" 
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button className="btn btn-success w-100" onClick={handleResetPassword} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

         {/* STEP 4: SUCCESS MODAL */}
          {step === 4 && (
            <div className="modal fade show d-block" style={{background: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                  <div className="modal-body text-center p-5">
                    <div className="text-success mb-3">
                        <svg width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                    </div>
                    <h4 className="text-success fw-bold">Success!</h4>
                    <p className="mb-0">Your password has been changed.</p>
                    <p className="text-muted small">Redirecting you to login screen...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </FormCard>
      </div>
    </>
  );
};

export default ResetPassword;
