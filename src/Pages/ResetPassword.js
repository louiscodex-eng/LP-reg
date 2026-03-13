
// import { useState,useEffect } from "react"; 
// import Navbar from "../components/Navbar";
// import FormCard from "../components/FormCard";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const ResetPassword = () => {
//   const [step, setStep] = useState(1);
//   const [regId, setRegId] = useState("");
//   const [userEmail, setUserEmail] = useState(""); // Store email for OTP steps
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // API Base URL - Update this based on environment
//   // const API_BASE = "https://registration.labourpartynigeria.org.ng:8443/api/Users";
//   const API_BASE = "https://localhost:44332/api/Users";


// // New states for validation
//   const [strength, setStrength] = useState({
//     length: false,
//     number: false,
//     special: false,
//     upper: false
//   });

//   // Real-time password checking
//   useEffect(() => {
//     setStrength({
//       length: password.length >= 8,
//       number: /[0-9]/.test(password),
//       special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//       upper: /[A-Z]/.test(password),
//     });
//   }, [password]);

//   const isPasswordStrong = Object.values(strength).every(Boolean);

//   // ===== Step 1: Verify User & Send Email OTP =====
//   const handleSendOtp = async () => {
//     if (!regId) return toast.error("Please enter your Registration ID");
//     setLoading(true);

//     try {
//       // 1. First Verify the RegID exists
//       const verifyRes = await fetch(`${API_BASE}/verify?regId=${encodeURIComponent(regId)}`);
//       const verifyData = await verifyRes.json();

//       if (!verifyRes.ok) throw new Error(verifyData.message || "Invalid Registration ID");

//       // Extract details needed for OTP
//       const email = verifyData.data.email || verifyData.data.Email; // Adjust based on your API response casing
//       const firstName = verifyData.data.fullName.split(' ')[0];

//       if (!email) throw new Error("No registered email found for this ID. Please contact support.");
      
//       setUserEmail(email);

//       // 2. Call the Send OTP Endpoint
//       const otpRes = await fetch(`${API_BASE}/send-email-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ Email: email, FirstName: firstName })
//       });

//       if (!otpRes.ok) throw new Error("Failed to trigger OTP email. Try again.");

//       setStep(2);
//       toast.success(`OTP sent to ${email.replace(/(.{3})(.*)(?=@)/, "$1***")}`);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===== Step 2: Verify Email OTP =====
//   const handleVerifyOtp = async () => {
//     if (!otp) return toast.error("Please enter the OTP");
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_BASE}/verify-email-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ Email: userEmail, Otp: otp })
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || "Invalid or expired OTP");

//       setStep(3);
//       toast.success("Identity verified successfully");
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===== Step 3: Reset Password =====
//   const handleResetPassword = async () => {
//     if (!password || !confirm) return toast.error("Fill all fields");
//     if (password !== confirm) return toast.error("Passwords do not match");

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE}/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ RegID: regId, Password: password }),
//       });

//       // Your backend returns text/plain for success sometimes, handle both
//       const contentType = response.headers.get("content-type");
//       let data;
//       if (contentType && contentType.indexOf("application/json") !== -1) {
//         data = await response.json();
//       } else {
//         data = { message: await response.text() };
//       }

//       if (!response.ok) throw new Error(data.message || "Password reset failed");

//       toast.success(data.message || "Password set successfully");
//       setStep(4);
//       setTimeout(() => navigate("/login"), 3000);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const Requirement = ({ reached, text }) => (
//     <div className={`small d-flex align-items-center mb-1 ${reached ? "text-success" : "text-muted"}`}>
//       <span className="me-2">{reached ? "✔" : "○"}</span>
//       {text}
//     </div>
//   );

//   return (
//     <>
//       <Navbar />
//       <ToastContainer />

//       <div className="container pt-4">
//         <FormCard title="Reset Password">

//           {step === 1 && (
//             <>
//               <input
//                 className="form-control mb-3"
//                 placeholder="Registration ID"
//                 value={regId}
//                 onChange={(e) => setRegId(e.target.value)}
//               />
//               <button
//                 className="btn btn-success w-100"
//                 disabled={loading}
//                 onClick={handleSendOtp}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2"></span>
//                     Sending OTP...
//                   </>
//                 ) : "Send OTP to my registered email address"}
//               </button>
//             </>
//           )}

//           {step === 2 && (
//             <>
//               <input
//               type="text"
//                 className="form-control mb-2"
//                 placeholder="Enter OTP sent your registered email"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <button
//                 className="btn btn-success w-100"
//                 disabled={loading}
//                 onClick={handleVerifyOtp}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2"></span>
//                     Verifying OTP...
//                   </>
//                 ) : "Verify OTP"}
//               </button>
//             </>
//           )}

//      {/* STEP 3: NEW PASSWORD */}
//           {step === 3 && (
//             <div className="step-content">
//               <label className="form-label fw-bold">New Password</label>
//               <div className="input-group mb-3">
//                 <input 
//                   type={showPass ? "text" : "password"} 
//                   className="form-control" 
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPass(!showPass)}>
//                   {showPass ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>

//               <label className="form-label fw-bold">Confirm Password</label>
//               <div className="input-group mb-4">
//                 <input 
//                   type={showConfirm ? "text" : "password"} 
//                   className="form-control" 
//                   value={confirm}
//                   onChange={(e) => setConfirm(e.target.value)}
//                 />
//                 <button className="btn btn-outline-secondary" type="button" onClick={() => setShowConfirm(!showConfirm)}>
//                   {showConfirm ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>

//               <button className="btn btn-success w-100" onClick={handleResetPassword} disabled={loading}>
//                 {loading ? "Updating..." : "Update Password"}
//               </button>
//             </div>
//           )}

//          {/* STEP 4: SUCCESS MODAL */}
//           {step === 4 && (
//             <div className="modal fade show d-block" style={{background: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
//               <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content border-0 shadow">
//                   <div className="modal-body text-center p-5">
//                     <div className="text-success mb-3">
//                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
//                             <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
//                         </svg>
//                     </div>
//                     <h4 className="text-success fw-bold">Success!</h4>
//                     <p className="mb-0">Your password has been changed.</p>
//                     <p className="text-muted small">Redirecting you to login screen...</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//         </FormCard>
//       </div>
//     </>
//   );
// };

// export default ResetPassword;



import { useState, useEffect } from "react"; 
import Navbar from "../components/Navbar";
import FormCard from "../components/FormCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import useOtpTimer from "../components/useOtpTimer";

// Helper component for password requirements
const Requirement = ({ reached, text }) => (
  <div className={`small d-flex align-items-center mb-1 ${reached ? "text-success" : "text-muted"}`}>
    <span className="me-2">
      {reached ? <FaCheckCircle size={12} /> : <FaRegCircle size={12} />}
    </span>
    {text}
  </div>
);

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [regId, setRegId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP Timer Hook (600 seconds = 10 minutes)
  const { minutes, seconds, expired, startTimer } = useOtpTimer(600);

  const API_BASE = "https://registration.labourpartynigeria.org.ng:8443/api/Users";
  //const API_BASE = "https://localhost:44332/api/Users";

  // Password Strength Validation State
  const [strength, setStrength] = useState({
    length: false,
    number: false,
    special: false,
    upper: false
  });

  useEffect(() => {
    setStrength({
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      upper: /[A-Z]/.test(password),
    });
  }, [password]);

  const isPasswordStrong = Object.values(strength).every(Boolean);

  // ===== Step 1 & Resend: Send OTP Logic =====
  const handleSendOtp = async (isResend = false) => {
    if (!regId) return toast.error("Please enter your Registration ID");
    
    if (isResend) setResending(true); else setLoading(true);

    try {
      const verifyRes = await fetch(`${API_BASE}/verify?regId=${encodeURIComponent(regId.trim())}`);
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) throw new Error(verifyData.message || "Invalid Registration ID");

      const email = verifyData.data.email || verifyData.data.Email;
      const firstName = verifyData.data.fullName ? verifyData.data.fullName.split(' ')[0] : "Member";

      if (!email) throw new Error("No registered email found for this ID.");
      setUserEmail(email);

      const otpRes = await fetch(`${API_BASE}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, FirstName: firstName })
      });

      if (!otpRes.ok) throw new Error("Failed to trigger OTP email.");

      setStep(2);
      if (typeof startTimer === 'function') startTimer();
      
      toast.success(isResend ? "New OTP sent!" : `OTP sent to ${email.replace(/(.{3})(.*)(?=@)/, "$1***")}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setResending(false);
      setLoading(false);
    }
  };

  // ===== Step 2: Verify OTP Logic =====
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

  // ===== Step 3: Reset Password Logic =====
  const handleResetPassword = async () => {
    if (!password || !confirm) return toast.error("Fill all fields");
    if (!isPasswordStrong) return toast.error("Password is too weak");
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RegID: regId, Password: password }),
      });

      const contentType = response.headers.get("content-type");
      let data = (contentType && contentType.includes("application/json")) 
                 ? await response.json() 
                 : { message: await response.text() };

      if (!response.ok) throw new Error(data.message || "Reset failed");

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

          {/* STEP 1: REG ID */}
          {step === 1 && (
            <>
              <p className="text-muted small mb-3">Enter your Registration ID to receive a verification code.</p>
              <input
                className="form-control mb-3"
                placeholder="Registration ID"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
              />
              <button className="btn btn-success w-100" disabled={loading} onClick={() => handleSendOtp(false)}>
                {loading ? "Verifying..." : "Proceed to Verify"}
              </button>
            </>
          )}

          {/* STEP 2: OTP & TIMER */}
          {step === 2 && (
            <>
              <p className="text-muted small mb-1">Enter the code sent to {userEmail.replace(/(.{3})(.*)(?=@)/, "$1***")}</p>
              <input
                type="number"
                className="form-control mb-2 text-center"
                style={{ letterSpacing: "4px", fontSize: "1.2rem" }}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className={expired ? "text-danger fw-bold" : "text-muted"}>
                  {expired ? "OTP expired." : `Expires in ${minutes}:${seconds.toString().padStart(2, "0")}`}
                </small>

                <button 
                  className="btn btn-link p-0 text-success text-decoration-none small"
                  onClick={() => handleSendOtp(true)}
                  disabled={!expired || resending}
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              </div>

              <button className="btn btn-success w-100" disabled={loading || expired} onClick={handleVerifyOtp}>
                {loading ? "Verifying..." : "Confirm & Proceed"}
              </button>

              <button className="btn btn-link w-100 text-muted mt-2 text-decoration-none btn-sm" onClick={() => setStep(1)}>
                Back to Registration ID
              </button>
            </>
          )}

          {/* STEP 3: STRONG PASSWORD CREATION */}
          {step === 3 && (
            <div className="step-content">
              <label className="form-label fw-bold">New Password</label>
              <div className="input-group mb-2">
                <input 
                  type={showPass ? "text" : "password"} 
                  className={`form-control ${password && (isPasswordStrong ? "is-valid" : "is-invalid")}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="card bg-light p-2 mb-3 border-0">
                <Requirement reached={strength.length} text="8+ Characters" />
                <Requirement reached={strength.upper} text="Uppercase Letter" />
                <Requirement reached={strength.number} text="Include Number" />
                <Requirement reached={strength.special} text="Special Char (@#$)" />
              </div>

              <label className="form-label fw-bold">Confirm Password</label>
              <div className="input-group mb-4">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  className={`form-control ${confirm && (password === confirm ? "is-valid" : "is-invalid")}`}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button 
                className="btn btn-success w-100" 
                onClick={handleResetPassword} 
                disabled={loading || !isPasswordStrong || password !== confirm}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center p-4">
              <div className="text-success mb-3"><FaCheckCircle size={50} /></div>
              <h4 className="fw-bold text-success">Success!</h4>
              <p className="mb-0">Your password has been changed.</p>
              <p className="text-muted small">Redirecting to login...</p>
            </div>
          )}

        </FormCard>
      </div>
    </>
  );
};

export default ResetPassword;