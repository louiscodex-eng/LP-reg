import { useState } from "react";
import logo from "../logo2.png";
import nigeriaStatesLGA from "../data/nigeriaStatesLGA";
import Navbar from "../components/Navbar";
import nigeriaLgaWards from "../data/nigeriaStatesLgaWards.json"; 

function Register() {
  // ===== Personal Details =====
  const [firstName, setFirstName] = useState("");
  const [isNigerianCitizen, setIsNigerianCitizen] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nin, setNin] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [loading, setLoading] = useState(false);
const [pdfUrl, setPdfUrl] = useState(null);
const [isCitizen, setIsCitizen] = useState("");
const [country, setCountry] = useState("");




  // ===== Other Details =====
  const [lga, setLga] = useState("");
  const [state,setState] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [city, setCity] = useState("");
  const [ward, setWard] = useState("");
  const [isNigerian, setIsNigerian] = useState("");
    const [isMembershipApplied, setIsMembershipApplied] = useState("");
    const [isVoters, setVoters] = useState("");

  // ===== Account Info =====
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //======Helper Functions ======
  function base64ToBlob(base64, contentType = "application/pdf") {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}

  // ===== Submit Function =====
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      firstName,
      middleName,
      lastName,
      dob,
      email,
      phoneNumber: phone,
      NationalId:nin,
      gender,
      maritalStatus,
      state,
      lga,
      city,
      ward,
      isNigerian,
      isVoters,
      isMembershipApplied,
      country: "Nigeria",
      username,
      password,
    };

    const response = await fetch(
      "https://govtregistrationapi.onrender.com/api/Registration/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();

    // 🔑 Convert Base64 → PDF
    const pdfBlob = base64ToBlob(data.pdfBase64);
    const pdfObjectUrl = URL.createObjectURL(pdfBlob);

    setPdfUrl(pdfObjectUrl);
    alert("Registration successful! PDF generated.");

  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {/* NAVBAR (already imported) */}
    <Navbar active="register" />

    {/* PAGE CONTENT */}
    <div className="container pt-4 pb-5">

      {/* LOGO + HEADER */}
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="Logo"
          className="img-fluid mb-3"
          style={{ maxHeight: "120px" }}
        />
        <h3 className="fw-bold mb-1">Labour Party</h3>
        <h5 className="text-muted mb-3">
          Membership Registration Form
        </h5>
      </div>

      {/* FORM CARD WITH WATERMARK */}
      <div className="card shadow-sm mx-auto position-relative" style={{ maxWidth: "900px", overflow: "hidden" }}>

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            opacity: 0.05,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />

        {/* FORM BODY */}
        <div className="card-body position-relative" style={{ zIndex: 1 }}>
          <form onSubmit={handleSubmit}>

            {/* Personal Details */}
            <h6 className="fw-bold mb-3">Personal Details</h6>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Middle Name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* DOB & Email */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input
                  type="date"
                  className="form-control"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone & NIN */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="National Identity Number"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Gender & Marital Status */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  required
                >
                  <option value="">Marital Status</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>
              </div>
            </div>

            {/* Citizenship Check */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={isCitizen}
                  onChange={(e) => {
                    setIsCitizen(e.target.value);
                    setState("");
                    setLga("");
                    setWard("");
                    setCountry("");
                  }}
                  required
                >
                  <option value="">Are you a Nigerian Citizen?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Conditional State/LGA/Ward */}
            {isCitizen === "Yes" && (
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setLga("");
                      setWard("");
                    }}
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(nigeriaStatesLGA).map((stateName) => (
                      <option key={stateName} value={stateName}>
                        {stateName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    disabled={!state}
                    required
                  >
                    <option value="">Select LGA</option>
                    {state &&
                      nigeriaStatesLGA[state].map((lgaName) => (
                        <option key={lgaName} value={lgaName}>
                          {lgaName}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    disabled={!state || !lga}
                    required
                  >
                    <option value="">Select Ward</option>
                    {state &&
                      lga &&
                      nigeriaLgaWards?.[state]?.[lga]?.map((wardName) => (
                        <option key={wardName} value={wardName}>
                          {wardName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* Country if not Nigerian */}
            {isCitizen === "No" && (
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="">Select your Country</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
            )}

            {/* Voter & Membership */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={isVoters}
                  onChange={(e) => setVoters(e.target.value)}
                  required
                >
                  <option value="">Do you have a voters card?</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="col-md-6">
                <select
                  className="form-select"
                  value={isMembershipApplied}
                  onChange={(e) => setIsMembershipApplied(e.target.value)}
                  required
                >
                  <option value="">Have you applied for a membership card before?</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                />
                <label className="form-check-label" htmlFor="terms">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>

            {/* Register Button */}
            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-success btn-lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Register"}
              </button>
            </div>

            {/* Note */}
            <p className="text-muted small">
              Note: This is a pre membership registration form. You will be contacted
              by your Local Government / Ward Representative once your membership
              registration is approved and ready for pickup.
            </p>

          </form>
        </div>
      </div>
    </div>
  </>
);

}

export default Register;
