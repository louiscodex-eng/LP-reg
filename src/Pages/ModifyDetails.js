


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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { minutes, seconds, expired, startTimer } = useOtpTimer();

  // API Base URL
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

      setStep(2);
if (typeof startTimer === 'function') {
    startTimer(); // This is where the error was likely triggered
  }
      
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

      toast.success("Identity verified successfully");
      
      // Final Step: Redirect to the update page with the RegID
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

          {/* STEP 1: ENTER REG ID */}
          {step === 1 && (
            <>
              <p className="text-muted small mb-3">
                Enter your Registration ID to receive a verification code.
              </p>
              <input
                className="form-control mb-3"
                placeholder="Registration ID"
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
                    Verifying...
                  </>
                ) : "Proceed to Verify"}
              </button>
            </>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 2 && (
            <>
              <p className="text-muted small mb-1">Enter the code sent to {userEmail.replace(/(.{3})(.*)(?=@)/, "$1***")}</p>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={expired}
              />
              
              <small className={`d-block mb-3 ${expired ? "text-danger" : "text-muted"}`}>
                {expired
                  ? "OTP expired. Please restart the process."
                  : `OTP expires in ${minutes}:${seconds.toString().padStart(2, "0")}`}
              </small>

              <button
                className="btn btn-success w-100"
                disabled={loading || expired}
                onClick={handleVerifyOtp}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Verifying OTP...
                  </>
                ) : "Confirm & Proceed"}
              </button>

              <button 
                className="btn btn-link w-100 text-success mt-2 text-decoration-none btn-sm"
                onClick={() => setStep(1)}
              >
                Change ID
              </button>
            </>
          )}

        </FormCard>
      </div>
    </>
  );
};

export default ModifyDetails;