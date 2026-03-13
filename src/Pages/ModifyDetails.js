import { useState } from "react"; 
import Navbar from "../components/Navbar";
import FormCard from "../components/FormCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import useOtpTimer from "../components/useOtpTimer";

const ModifyDetails = () => {
  const [step, setStep] = useState(1);
  const [regId, setRegId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // New state for resend loading
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const { minutes, seconds, expired, startTimer } = useOtpTimer(600);

   const API_BASE = "https://registration.labourpartynigeria.org.ng:8443/api/Users";
   //const API_BASE = "https://localhost:44332/api/Users";


  // ===== Refactored Send/Resend OTP Logic =====
  const handleSendOtp = async (isResend = false) => {
    if (!regId) return toast.error("Please enter your Registration ID");
    
    // Use different loading states to avoid UI jumping
    if (isResend) setResending(true); else setLoading(true);

    try {
      // 1. Verify the RegID exists (only strictly necessary on first attempt, but safe to keep)

  
const verifyRes = await fetch(`${API_BASE}/verify?regId=${encodeURIComponent(regId.trim())}`);
      ///const verifyRes = await fetch(`${API_BASE}/verify/${regId}`);
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) throw new Error(verifyData.message || "Invalid Registration ID");

      const email = verifyData.data.email || verifyData.data.Email;
      const firstName = verifyData.data.fullName ? verifyData.data.fullName.split(' ')[0] : "Member";

      if (!email) throw new Error("No registered email found for this ID.");
      setUserEmail(email);

      // 2. Call the Send OTP Endpoint
      const otpRes = await fetch(`${API_BASE}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, FirstName: firstName })
      });

      if (!otpRes.ok) throw new Error("Failed to trigger OTP email. Try again.");

      // 3. UI Updates
      setStep(2);
      if (typeof startTimer === 'function') {
        startTimer(); // Restart the timer
      }
      
      toast.success(isResend ? "New OTP sent successfully!" : `OTP sent to ${email.replace(/(.{3})(.*)(?=@)/, "$1***")}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setResending(false);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP");
    setLoading(true);
// 2. Limit to exactly 6 digits
    if (otp.length !== 6) {
      setLoading(false)
        return toast.error("OTP must be exactly 6 digits");
        
    }
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: userEmail, Otp: otp })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid or expired OTP");

      toast.success("Identity verified successfully");
      navigate("/update-details", { state: { regId } });
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
        <FormCard title="Modify Membership Details">

          {step === 1 && (
            <>
              <p className="text-muted small mb-3">Enter your Registration ID to receive a verification code.</p>
              <input
              type="text"
                className="form-control mb-3"
                placeholder="Registration ID"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
              />
              <button
                className="btn btn-success w-100"
                disabled={loading}
                onClick={() => handleSendOtp(false)}
              >
                {loading ? "Verifying..." : "Proceed to Verify"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-muted small mb-1">Enter the code sent to {userEmail.replace(/(.{3})(.*)(?=@)/, "$1***")}</p>
              <input
              maxLength={6}
                type="number"
                className="form-control mb-2"
                placeholder="Enter OTP(e.g 123456)"
                value={otp}
               onChange={(e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  }}
              />
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className={expired ? "text-danger" : "text-muted"}>
                  {expired
                    ? "OTP expired."
                    : `Expires in ${minutes}:${seconds.toString().padStart(2, "0")}`}
                </small>

                {/* RESEND BUTTON: Only clickable when expired */}
                <button 
                  className="btn btn-link p-0 text-success text-decoration-none small"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => handleSendOtp(true)}
                  disabled={!expired || resending}
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              </div>

              <button
                className="btn btn-success w-100"
                disabled={loading || expired}
                onClick={handleVerifyOtp}
              >
                {loading ? "Verifying OTP..." : "Confirm & Proceed"}
              </button>

              <button 
                className="btn btn-link w-100 text-muted mt-2 text-decoration-none btn-sm"
                onClick={() => setStep(1)}
              >
                Back to Registration ID
              </button>
            </>
          )}

        </FormCard>
      </div>
    </>
  );
};

export default ModifyDetails;