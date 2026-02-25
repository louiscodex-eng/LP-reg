import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../logo2.png";
import nigeriaStatesLGA from "../data/nigeriaStatesLGA";
import nigeriaWards from "../data/nigeriaWards.json";
import Navbar from "../components/Navbar";
import IDCard from "../components/IDCard";
import onlyStates from "../data/onlyStates";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
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
  const [residenceState, setResidenceState] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ===== Other Details =====
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [ward, setWard] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isNigeria, setIsNigeria] = useState("");
  const [isVoters, setVoters] = useState("");
  const [votersCardNo, setVotersCardNo] = useState("");
  const [passportFile, setPassportFile] = useState(null);
  const [occupation, setOccupation] = useState("");
  const [maidenName,setMaidenName] = useState("")

  // ===== Wards Data =====
  const [wardsData, setWardsData] = useState({});
  const [loadingWards, setLoadingWards] = useState(true);

  // ===== Transform local JSON into usable wardsData =====
  useEffect(() => {
    const transformed = {};
    nigeriaWards.forEach((stateObj) => {
      const stateName = stateObj.state.trim();
      transformed[stateName] = {};
      stateObj.lgas.forEach((lgaObj) => {
        const lgaName = lgaObj.name.trim();
        transformed[stateName][lgaName] = lgaObj.wards.map((w) => w.name.trim());
      });
    });
    setWardsData(transformed);
    setLoadingWards(false);
  }, []);

  // ===== Submit Function =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Debug: Log gender and marital status before sending
    console.log("Gender before submit:", gender);
    console.log("Marital Status before submit:", maritalStatus);

    // Validate gender and marital status
    if (!gender || gender === "") {
      toast.error("Please select a gender", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    if (!maritalStatus || maritalStatus === "") {
      toast.error("Please select a marital status", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      // ===== Personal Details =====
      formData.append("FirstName", firstName);
      formData.append("MiddleName", middleName);
      formData.append("LastName", lastName);
      formData.append("DOB", dob);
      formData.append("Email", email);
      formData.append("PhoneNumber", phone);
      formData.append("NationalId", nin);
      
      // ===== FIXED: Ensure gender and marital status are sent =====
      formData.append("Gender", gender);
      formData.append("MaritalStatus", maritalStatus);

      // ===== Residency =====
      formData.append("IsCitizen", isCitizen);
      formData.append("State", isCitizen === "Yes" ? state : "");
      formData.append("LGA", isCitizen === "Yes" ? lga : "");
      formData.append("Ward", isCitizen === "Yes" ? ward : "");

      // ===== Voting =====
      formData.append("IsVoters", isVoters);
      if (isVoters === "Yes" && votersCardNo) {
        formData.append("VotersCardNo", votersCardNo);
      }

      // ===== Country of Residence =====
      formData.append("Country", isNigeria === "Nigeria" ? "Nigeria" : country);
      
      // ===== State of Residence =====
      if (isNigeria === "Nigeria" && residenceState) {
        formData.append("ResidenceState", residenceState);
      }

      // ===== Passport Upload =====
      if (passportFile) {
        formData.append("passport", passportFile);
      }

      // Debug: Log what's being sent
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(
        "https://govtregistrationapi.onrender.com/api/Registration/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // ===== SUCCESS TOAST =====
        toast.success(
          "Registration successful! Kindly download your membership card below. Dont forget to reset your password",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        setRegisteredUser(data.data);
      } else {
        // ===== ERROR TOAST =====
        toast.error(data.message || "Something went wrong, try again", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      
      // ===== NETWORK ERROR TOAST =====
      toast.error("Something went wrong, try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar active="register" />
      
      {/* Toast Container - Required for notifications */}
      <ToastContainer />

      <div className="container pt-4 pb-5">
      <div className="text-center mb-5 d-flex flex-column align-items-center">

  {/* LOGO */}
  <img
    src={logo}
    alt="Labour Party Logo"
    className="img-fluid mb-3"
    style={{ maxHeight: "110px" }}
  />

  {/* PARTY NAME */}
  <h1 className="fw-bold mb-1" style={{ letterSpacing: "1px" }}>
    Labour Party (LP)
  </h1>

  {/* MOTTO */}
  <div
    className="mb-2 px-3 py-1 rounded"
    style={{
      backgroundColor: "#19875415",
      color: "#198754",
      fontWeight: "500",
      fontSize: "14px",
    }}
  >
    MOTTO: EQUAL OPPORTUNITY AND SOCIAL JUSTICE
  </div>

  {/* PORTAL TITLE */}
  <h5 className="text-muted mb-3" style={{ fontWeight: "500" }}>
    LABOUR PARTY E-MEMBERSHIP REGISTRATION PORTAL
  </h5>

  {/* DIVIDER */}
  <div
    style={{
      width: "260px",
      height: "1px",
      backgroundColor: "#198754",
      borderRadius: "10px",
      marginBottom: "15px",
    }}
  />

  {/* ADDRESS */}
  <h6 className="text-muted mb-1" style={{ lineHeight: "1.5" }}>
    Labour Party National Secretariat,<br />
    2 IBM Haruna Street, Utako, Abuja FCT
  </h6>

 {/* CONTACT INFO */}
<div
  className="d-flex justify-content-center align-items-center gap-4 mt-3"
  style={{ fontSize: "14px" }}
>
  {/* Phone */}
  <div className="d-flex align-items-center gap-2 text-muted">
    <FaPhoneAlt size={16} color="#198754" />
    <span> 07041004783, 08111114742</span>
  </div>

 {/* Email */}
<div className="d-flex align-items-center gap-2 text-muted">
  <a
    href="mailto:lpnationalsecretariat@gmail.com"
    className="d-flex align-items-center gap-2 text-muted text-decoration-none"
  >
    <FaEnvelope size={16} color="#198754" />
    <span>lpnationalsecretariat@gmail.com</span>
  </a>
</div>
</div>

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
            {/* display form conditionally */}
            {!showForm && (
  <div className="text-center my-5">
    <button
      className="btn btn-success btn-lg px-5 py-3 register-btn"
      onClick={() => setShowForm(true)}
    >
      Register Now
    </button>
  </div>
)}        
                { showForm && (
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
                  <label className="form-label fw-medium">Married? Please enter Maiden's Name</label>
                  <input
                    className="form-control"
                    placeholder="Maiden Name"
                    value={maidenName}
                    onChange={(e) => setMaidenName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Occupation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
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
                  <label className="form-label fw-medium">
                    Do you reside in Nigeria?
                  </label>
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
                    <label className="form-label fw-medium">
                      Local Government Area (LGA)
                    </label>
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
                  <label className="form-label fw-medium">
                    National Identity Number(NIN)
                  </label>
                  <input
                    className="form-control"
                    placeholder="National Identity Number"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Gender & Marital Status - FIXED */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Gender *</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => {
                      console.log("Gender selected:", e.target.value);
                      setGender(e.target.value);
                    }}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Marital Status *</label>
                  <select
                    className="form-select"
                    value={maritalStatus}
                    onChange={(e) => {
                      console.log("Marital Status selected:", e.target.value);
                      setMaritalStatus(e.target.value);
                    }}
                    required
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widow">Widow</option>
                    <option value="Widower">Widower</option>
                  </select>
                </div>
              </div>

              {/* Voter & Membership */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Do you have a voters card?
                  </label>
                  <select
                    className="form-select"
                    value={isVoters}
                    onChange={(e) => setVoters(e.target.value)}
                    required
                  >
                    <option value="">Do you have a voters card?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">Country of Residence</label>
                  <select
                    className="form-select"
                    value={isNigeria}
                    onChange={(e) => setIsNigeria(e.target.value)}
                    required
                  >
                    <option value="">Select country of residence</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Other Country">Other Country</option>
                  </select>
                </div>
              </div>

              {/* Voters Card Number - Shows when Yes is selected */}
              {isVoters === "Yes" && (
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Voter's Card Number</label>
                    <input
                      className="form-control"
                      placeholder="Enter Voter's Card No."
                      value={votersCardNo}
                      onChange={(e) => setVotersCardNo(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* If user selects Nigeria */}
              {isNigeria === "Nigeria" && (
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">State of Residence</label>
                    <select
                      className="form-select"
                      value={residenceState}
                      onChange={(e) => setResidenceState(e.target.value)}
                      required
                    >
                      <option value="">Select State</option>
                      {Object.keys(onlyStates).map((stateName) => (
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
                  onChange={(e) => setPassportFile(e.target.files[0])}
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
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>

              <p className="text-muted small">
                Note: This is a pre-membership registration form. You will be
                contacted by your Local Government / Ward Representative once
                your membership registration is approved and ready for pickup.
              </p>
            </form>
          </div>
                )}
        </div>

        {/* Show ID Card after successful registration */}
        {registeredUser && (
          <div className="mt-4">
            <IDCard user={registeredUser} />
          </div>
        )}
      </div>
    </>
  );
}

export default Register;