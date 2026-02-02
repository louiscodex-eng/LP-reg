import { useState, useEffect } from "react";
import logo from "../logo2.png";
import nigeriaStatesLGA from "../data/nigeriaStatesLGA";
import nigeriaWards from "../data/nigeriaWards.json"; // <-- local JSON
import Navbar from "../components/Navbar";

function Register() {
  // ===== Personal Details =====
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nin, setNin] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCitizen, setIsCitizen] = useState("");
  const [country, setCountry] = useState("");

  // ===== Other Details =====
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [ward, setWard] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isNigeria, setIsNigeria] = useState("");
  const [isVoters, setVoters] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  // ===== Wards Data =====
  const [wardsData, setWardsData] = useState({});
  const [loadingWards, setLoadingWards] = useState(true);

  // ===== Transform local JSON into usable wardsData =====
useEffect(() => {
  // Transform the array into a lookup object for easy access
  const transformed = {};
  nigeriaWards.forEach((stateObj) => {
    const stateName = stateObj.state.trim(); // remove extra spaces
    transformed[stateName] = {};
    stateObj.lgas.forEach((lgaObj) => {
      const lgaName = lgaObj.name.trim();
      transformed[stateName][lgaName] = lgaObj.wards.map((w) =>
        w.name.trim()
      );
    });
  });
  setWardsData(transformed);
  setLoadingWards(false);
}, []);


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
  NationalId: nin,
  gender,
  maritalStatus,

  // Residency
  isCitizen,        // "Yes" or "No"
  state: isCitizen === "Yes" ? state : null,
  lga: isCitizen === "Yes" ? lga : null,
  ward: isCitizen === "Yes" ? ward : null,

  // Voting
  isVoters,         // "Yes" or "No"

  // Country logic
  country:
    isNigeria === "Nigeria"
      ? "Nigeria"
      : country,    // Ghana, UK, USA, etc.
};

      const response = await fetch(
        "https://govtregistrationapi.onrender.com/api/Registration/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Registration failed");
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


  return (
    <>
      <Navbar active="register" />

      <div className="container pt-4 pb-5">
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="img-fluid mb-3"
            style={{ maxHeight: "120px" }}
          />
          <h3 className="fw-bold mb-1">Labour Party</h3>
          <h5 className="text-muted mb-3">Membership Registration Form</h5>
        </div>

        <div
          className="card shadow-sm mx-auto position-relative"
          style={{ maxWidth: "900px", overflow: "hidden" }}
        >
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

          <div className="card-body position-relative" style={{ zIndex: 1 }}>
            <form onSubmit={handleSubmit}>
              {/* Personal Details */}
              <h6 className="fw-bold mb-3">Personal Details</h6>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">FirstName</label>
                  <input
                    className="form-control"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Middle Name</label>
                  <input
                    className="form-control"
                    placeholder="Middle Name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Last Name</label>
                  <input
                    className="form-control"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Email Address</label>
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

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
                 <div className="col-md-6">
                  <label className="form-label fw-medium">Do you reside in Nigeria?</label>
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
                    <option value="">Do you reside in Nigeria?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {/* State / LGA / Ward */}
              {isCitizen === "Yes" && (
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">State of Origin</label>
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
                      <option value="">Select State of origin</option>
                      {Object.keys(nigeriaStatesLGA).map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Local Government Area (LGA)</label>
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
                    <label className="form-label fw-medium">Ward</label>
                    <select
                      className="form-select"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      disabled={!state || !lga || loadingWards}
                      required
                    >
                      <option value="">
                        {loadingWards ? "Loading wards..." : "Select Ward"}
                      </option>
                     {state && lga && wardsData[state] && wardsData[state][lga]
  ? wardsData[state][lga].map((wardName) => (
      <option key={wardName} value={wardName}>
        {wardName}
      </option>
    ))
  : null}

                    </select>
                  </div>
                </div>
              )}
          

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Phone Number</label>
                  <input
                    className="form-control"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">National Identity Number(NIN)</label>
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
                  <label className="form-label fw-medium">Gender</label>
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
                  <label className="form-label fw-medium">Marital Status</label>
                  <select
                    className="form-select"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    required
                  >
                    <option value="">Marital Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widow</option>
                    <option>Widower</option>
                  </select>
                </div>
              </div>

              {/* Citizenship
              <div className="row g-3 mb-3"> */}
               
           
              {/* Voter & Membership */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Do you have a voters card?</label>
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
                  {isVoters === "Yes" && (
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          placeholder="Enter Voter's Card No."
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">Country of Residence</label>
                  <select
                    className="form-select"
                    value={isNigeria}
                    onChange={(e) =>
                      setIsNigeria(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select country of residence
                    </option>
                    <option>Nigeria</option>
                    <option>Other Country</option>
                  </select>
                </div>
              </div>

              {/* If user selects Nigeria */}
{isNigeria === "Nigeria" && (
  <div className="row g-3 mb-3">
    <div className="col-md-6">
      <label className="form-label fw-medium">State of Residence</label>
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
  </div>
)}

{/* If user selects Other Country */}
{isNigeria === "Other Country" && (
  <div className="row g-3 mb-3">
    <div className="col-md-6">
      <label className="form-label fw-medium">Country of Residence</label>
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

              {/* Passport Upload */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Upload Passport Photograph
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  required
                />
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

                {pdfUrl && (
  <div className="mt-4">
    <h5 className="fw-bold text-center">Your Membership PDF</h5>

    <iframe
      src={pdfUrl}
      title="Membership PDF"
      width="100%"
      height="600px"
      style={{ border: "1px solid #ccc" }}
    />

    <div className="d-grid mt-3">
      <a href={pdfUrl} download="membership.pdf">
        <button className="btn btn-primary">
          Download PDF
        </button>
      </a>
    </div>
  </div>
)}

              </div>


              <p className="text-muted small">
                Note: This is a pre-membership registration form. You will be
                contacted by your Local Government / Ward Representative once
                your membership registration is approved and ready for pickup.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
