import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../logo2.png";
import Navbar from "../components/Navbar";
import IDCard from "../components/IDCard";
import { FaPhoneAlt, FaEnvelope,FaInfoCircle } from "react-icons/fa";
import {
  getStates,
  getLgas,
  getWards,
  getPollingUnits,
} from "../APIs/locationservice";
import TermsAndConditions from "../components/TermsAndConditions";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 


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
  const [maidenName, setMaidenName] = useState("");

  // ===== New Updates Fields =====
  const [region, setRegion] = useState("");
  const [pollingUnit, setPollingUnit] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [states, setStates] = useState([]);
const [lgas, setLgas] = useState([]);
const [wards, setWards] = useState([]);
const [pollingUnits, setPollingUnits] = useState([]);
const navigate = useNavigate();

const [showTermsModal, setShowTermsModal] = useState(false);

const resetForm = () => {
  setFirstName("");
  setMiddleName("");
  setLastName("");
  setDob("");
  setEmail("");
  setPhone("");
  setNin("");
  setGender("");
  setMaritalStatus("");
  setIsCitizen("");
  setCountry("");
  setResidenceState("");
  setLga("");
  setState("");
  setWard("");
  setVoters("");
  setVotersCardNo("");
  setPassportFile(null);
  setOccupation("");
  setMaidenName("");
  setRegion("");
  setIsNigeria("");
  setPollingUnit("");
  setResidentialAddress("");
  setAgreed(false);
  // Clear the file input manually if needed
  if (document.querySelector('input[type="file"]')) {
    document.querySelector('input[type="file"]').value = "";
  }
};


  // ===== Wards Data =====
  const handleNameChange = (setter) => (e) => {
  const value = e.target.value;
  // This regex allows only letters (uppercase/lowercase) and spaces
  const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
  setter(filteredValue);
};

  const [loadingWardsApi, setLoadingWardsApi] = useState(false); // Fixed
const [loadingLgas, setLoadingLgas] = useState(false);         // Fixed
const [loadingStates, setLoadingStates] = useState(false);
const [loadingPollingUnits, setLoadingPollingUnits] = useState(false);
 // const [loadingWards] = useState(true);
  const validateAge = (birthDate) => {
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  // Adjust age if birthday hasn't happened yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

  // Helper for numeric restriction and digit limit
  const handleNumericInput = (value, setter) => {
    const cleaned = value.replace(/\D/g, ""); // Remove non-numeric
    if (cleaned.length <= 11) {
      setter(cleaned);
    }
  };


useEffect(() => {
  const fetchStates = async () => {
    try {
      setLoadingStates(true);
      const data = await getStates();
      setStates(data);
    } catch (error) {
      toast.error("Failed to load states");
    } finally {
      setLoadingStates(false);
    }
  };

  fetchStates();
}, []);

useEffect(() => {
  if (!state) return;

  const fetchLgas = async () => {
    try {
      setLoadingLgas(true);
      const data = await getLgas(state);
      setLgas(data);
      setWards([]);
      setPollingUnits([]);
    } catch {
      toast.error("Failed to load LGAs");
    } finally {
      setLoadingLgas(false);
    }
  };

  fetchLgas();
}, [state]);

useEffect(() => {
  if (!state || !lga) return;

  const fetchWards = async () => {
    try {
      setLoadingWardsApi(true);
      const data = await getWards(state, lga);
      setWards(data);
      setPollingUnits([]);
    } catch {
      toast.error("Failed to load wards");
    } finally {
      setLoadingWardsApi(false);
    }
  };

  fetchWards();
}, [state, lga]);

useEffect(() => {
  if (!state || !lga || !ward) return;

  const fetchPollingUnitsData = async () => {
    try {
      setLoadingPollingUnits(true);
      const data = await getPollingUnits(state, lga, ward);
      setPollingUnits(data);
    } catch {
      toast.error("Failed to load polling units");
    } finally {
      setLoadingPollingUnits(false);
    }
  };

  fetchPollingUnitsData();
}, [state, lga, ward]);


  // ===== Submit Function =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Specific Validation for 11 digits
    if (phone.length !== 11) {
      toast.error("Phone number must be 11 digits");
      return;
    }
    if (nin.length !== 11) {
      toast.error("NIN must be 11 digits");
      return;
    }
    if (isVoters === "Yes" && votersCardNo.length !== 11) {
      toast.error("Voters Card No must be 11 digits");
      return;
    }

    if (validateAge(dob) < 18) {
    toast.error("Access Denied: You must be at least 18 years old to register.");
    return; // Stop the registration process
    }
   // ===== Inside handleSubmit =====
// 1. Define the Regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 2. Run the check
if (!emailRegex.test(email)) {
    toast.error("Invalid Email: Please enter a correct email address (e.g. name@example.com)");
    
    // Focus the email field so the user can fix it immediately
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) emailInput.focus();
    
    return; // CRITICAL: This stops the code from reaching the API call
}

    if (!firstName || !lastName) {
      toast.error("Please enter your First and Last Name");
      return;
    }
    if (!occupation) {
      toast.error("Please select an occupation");
      return;
    }
    if (!region) {
      toast.error("Please select your region");
      return;
    }
    if (!passportFile) {
        toast.error("Please upload a passport photograph");
        return;
    }
  

    setLoading(true);

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
      formData.append("Gender", gender);
      formData.append("MaritalStatus", maritalStatus);
      formData.append("Region", region);
      formData.append("Occupation", occupation);
      formData.append("PollingUnit", pollingUnit);
      formData.append("ResidentialAddress", residentialAddress);
      formData.append("MaidenName", maidenName);

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

      const response = await fetch(
        "https://govtregistrationapi.onrender.com/api/Registration/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Kindly download your membership card below.", {
          position: "top-right",
          autoClose: 5000,
        });
        setRegisteredUser(data.data);
        resetForm();
      } else {
        toast.error(data.message || "Something went wrong, try again");
      }
    } catch (error) {
      toast.error("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar active="register" />
      <ToastContainer />

      <div className="container pt-4 pb-5">
        {/* Header Section */}
        <div className="text-center mb-4 d-flex flex-column align-items-center">
          <img src={logo} alt="Labour Party Logo" className="img-fluid mb-3" style={{ maxHeight: "110px" }} />
          <h1 className="fw-bold mb-1">Labour Party (LP)</h1>
          <div className="mb-2 px-3 py-1 rounded" style={{ backgroundColor: "#19875415", color: "#198754", fontWeight: "500", fontSize: "14px" }}>
            MOTTO: EQUAL OPPORTUNITY AND SOCIAL JUSTICE
          </div>
          <h5 className="text-muted mb-3">LABOUR PARTY E-MEMBERSHIP REGISTRATION PORTAL</h5>
          <div style={{ width: "260px", height: "1px", backgroundColor: "#198754", borderRadius: "10px", marginBottom: "15px" }} />
          <h6 className="text-muted mb-1">Labour Party National Secretariat, 2 IBM Haruna Street, Utako, Abuja FCT</h6>

          <div className="d-flex justify-content-center align-items-center gap-4 mt-3 mb-4" style={{ fontSize: "14px" }}>
            <div className="d-flex align-items-center gap-2 text-muted">
              <FaPhoneAlt color="#198754" /> <span> 07041004783, 08111114742</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-muted text-decoration-none">
              <FaEnvelope color="#198754" /> <span>NationalSecretariat@LabourPartyNigeria.org.ng</span>
            </div>
          </div>

          {/* ATTRACTIVE CAVEAT UI */}
          <div className="card border-0 shadow-sm mb-4" style={{ maxWidth: "800px", borderRadius: "15px", background: "linear-gradient(135deg, #198754 0%, #145c3a 100%)" }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex align-items-center gap-3 text-start">
                <div className="bg-white p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ minWidth: "45px", height: "45px" }}>
                  <FaInfoCircle size={24} color="#198754" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Note:</h6>
                  <p className="small mb-0 opacity-90">
                    After registration is successful, you can download your card below and also click on <strong>Create/Reset Password</strong> to login to your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mx-auto position-relative" style={{ maxWidth: "900px", overflow: "hidden" }}>
          {/* Watermark */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "500px", height: "500px", opacity: 0.05, zIndex: 0, pointerEvents: "none", backgroundImage: `url(${logo})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
          
          {!showForm && (
            <div className="text-center my-5">
              <button className="btn btn-success btn-lg px-5 py-3 register-btn" onClick={() => setShowForm(true)}>Register Now</button>
            </div>
          )}

          {showForm && (
            <div className="card-body position-relative" style={{ zIndex: 1 }}>
              <form onSubmit={handleSubmit}>
                <h6 className="fw-bold mb-3">Personal Details</h6>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">First Name</label>
                    <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={handleNameChange(setFirstName)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Middle Name</label>
                    <input type="text" className="form-control" placeholder="Middle Name" value={middleName} onChange={handleNameChange(setMiddleName)} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Last Name</label>
                    <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={handleNameChange(setLastName)}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Email Address</label>
                    <input type="email" className="form-control" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                 <div className="col-md-6">
                    <label className="form-label fw-medium">Residential Address</label>
                    <input className="form-control" placeholder="Enter Residential Address" value={residentialAddress} onChange={(e) => setResidentialAddress(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Occupation</label>
                    <select className="form-select" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
                      <option value="">Select Occupation</option>
                      <option value="Government Workers">Government Workers</option>
                      <option value="Private Sector">Private Sector</option>
                      <option value="Self Employed">Self Employed</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Select Region</label>
                    <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                      <option value="">Select Region</option>
                      <option value="North Central">North Central</option>
                      <option value="North East">North East</option>
                      <option value="North West">North West</option>
                      <option value="South East">South East</option>
                      <option value="South South">South South</option>
                      <option value="South West">South West</option>
                      <option value="Abuja (FCT)">Abuja (FCT)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Date of Birth</label>
                    <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)}/>
                  </div>
                </div>

                
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Phone Number</label>
                    <input className="form-control" placeholder="11-digit phone number" value={phone} onChange={(e) => handleNumericInput(e.target.value, setPhone)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">National Identity Number(NIN)</label>
                    <input className="form-control" placeholder="11-digit NIN" value={nin} onChange={(e) => handleNumericInput(e.target.value, setNin)} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
  <div className="col-md-6">
    <label className="form-label fw-medium">Gender *</label>
    <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>
  <div className="col-md-6">
    <label className="form-label fw-medium">Marital Status *</label>
    <select className="form-select" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
      <option value="">Select Marital Status</option>
      <option value="Single">Single</option>
      <option value="Married">Married</option>
      <option value="Divorced">Divorced</option>
      <option value="Widow">Widow</option>
      <option value="Widower">Widower</option>
    </select>
  </div>
</div>

{/* Only show this row if Female AND Married */}
{gender === "Female" && maritalStatus === "Married" && (
  <div className="row g-3 mb-3">
    <div className="col-md-12">
      <label className="form-label fw-medium">Maiden's Name</label>
      <input 
        className="form-control" 
        placeholder="Enter Maiden Name" 
        value={maidenName} 
        onChange={(e) => setMaidenName(e.target.value)} 
      />
    </div>
  </div>
)}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Do you reside in Nigeria?</label>
                    <select className="form-select" value={isCitizen} onChange={(e) => { setIsCitizen(e.target.value); setState(""); setLga(""); setWard(""); setCountry(""); }}>
                      <option value="">Do you reside in Nigeria?</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Do you have a voters card?</label>
                    <select className="form-select" value={isVoters} onChange={(e) => setVoters(e.target.value)}>
                      <option value="">Do you have a voters card?</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {isVoters === "Yes" && (
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Voter's Card Number</label>
                      <input className="form-control" placeholder="11-digit Voter's Card No." value={votersCardNo} onChange={(e) => handleNumericInput(e.target.value, setVotersCardNo)} />
                    </div>
                  </div>
                )}

               {/* STATE, LGA, WARD ROW */}
{isCitizen === "Yes" && (
  <>
    <div className="row g-3 mb-3">
      <div className="col-md-4">
        <label className="form-label fw-medium">State of Origin</label>
        <select className="form-select" value={state} onChange={(e) => { setState(e.target.value); setLga(""); setWard(""); }} required>
          <option value="">{loadingStates ? "Loading..." : "Select State"}</option>
          {states.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label fw-medium">LGA</label>
        <select className="form-select" value={lga} onChange={(e) => setLga(e.target.value)} disabled={!state || loadingLgas} required>
          <option value="">{loadingLgas ? "Loading..." : "Select LGA"}</option>
          {lgas.map((l) => (<option key={l} value={l}>{l}</option>))}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label fw-medium">Ward</label>
        <select className="form-select" value={ward} onChange={(e) => setWard(e.target.value)} disabled={!lga || loadingWardsApi} required>
          <option value="">{loadingWardsApi ? "Loading..." : "Select Ward"}</option>
          {wards.map((w) => (<option key={w} value={w}>{w}</option>))}
        </select>
      </div>
    </div>

    {/* ONLY SHOW POLLING UNIT AFTER WARD IS SELECTED */}
    {ward && (
      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <label className="form-label fw-medium">Polling Unit</label>
          <select
            className="form-select"
            value={pollingUnit}
            onChange={(e) => setPollingUnit(e.target.value)}
            disabled={loadingPollingUnits}
            required
          >
            <option value="">
              {loadingPollingUnits ? "Loading Units..." : "Select Polling Unit"}
            </option>
            {pollingUnits.map((pu) => (
              <option key={pu} value={pu}>{pu}</option>
            ))}
          </select>
        </div>
      </div>
    )}
  </>
)}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Country of Residence</label>
                    <select className="form-select" value={isNigeria} onChange={(e) => setIsNigeria(e.target.value)} required>
                      <option value="">Select country of residence</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Other Country">Other Country</option>
                    </select>
                  </div>
                  {isNigeria === "Nigeria" && (
  <div className="col-md-6">
    <label className="form-label fw-medium">State of Residence</label>
    <select 
      className="form-select" 
      value={residenceState} 
      onChange={(e) => setResidenceState(e.target.value)} 
      required
    >
      <option value="">
        {loadingStates ? "Loading..." : "Select State"}
      </option>
      {states.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>
)}
                  {isNigeria === "Other Country" && (
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Country Name</label>
                      <select className="form-select" value={country} onChange={(e) => setCountry(e.target.value)} required>
                        <option value="">Select Country</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Upload Passport Photograph</label>
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => setPassportFile(e.target.files[0])} required />
                </div>

              <div className="form-check mb-4 mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="termsCheck"
            required
            checked={agreed} onChange={(e) => setAgreed(e.target.checked)} 
          />
          <label className="form-check-label small" htmlFor="termsCheck">
            I agree to the{" "}
            <span 
              className="text-success fw-bold" 
              style={{ cursor: "pointer", textDecoration: "underline" }}
              // Trigger the modal instead of navigating
              onClick={() => setShowTermsModal(true)} 
            >
              Terms and Conditions
            </span>{" "}
            and Privacy Policy.
          </label>
        </div>

      {/* --- THE MODAL --- */}
      <Modal 
        show={showTermsModal} 
        onHide={() => setShowTermsModal(false)} 
        size="lg" 
        centered 
        scrollable
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Legal Agreements</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0">
          {/* We pass a prop so the component knows it's inside a modal */}
          <TermsAndConditions isModal={true} closeModal={() => setShowTermsModal(false)} />
        </Modal.Body>
      </Modal>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Register"}
                  </button>
                </div>

                <p className="text-muted small">Note: This is a pre-membership registration form. You will be contacted by your Local Government / Ward Representative once your membership registration is approved and ready for pickup.</p>
              </form>
            </div>
          )}
        </div>

     {registeredUser && (
  <div className="mt-5 text-center">
    <div className="alert alert-success d-inline-block px-4 py-3 mb-4 rounded-pill shadow-sm">
      <h5 className="mb-0">Registration Successful!</h5>
    </div>

    <div className="mb-4 d-flex flex-wrap justify-content-center gap-3">
      {/* The Create Password Button */}
      <button 
        className="btn btn-success btn-lg px-4 d-flex align-items-center gap-2" 
        onClick={() => navigate("/reset-password")}
      >
        <i className="fa fa-key"></i> Create Password
      </button>
    </div>

    <IDCard user={registeredUser} />
  </div>
)}
      </div>
    </>
  );
}

export default Register;