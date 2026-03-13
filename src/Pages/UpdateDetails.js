import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../logo2.jpeg";
import Navbar from "../components/Navbar";
import { 
  getStates, 
  getLgas, 
  getWards, 
  getPollingUnits 
} from "../APIs/locationservice";
import { jwtDecode } from "jwt-decode";
// Added Modal import
import { Modal } from "react-bootstrap"; 
// Assuming you have this component based on your error log
import TermsAndConditions from "../components/TermsAndConditions";

function UpdateDetails() {
  // ===== State variables (matching your Register page) =====
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
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [ward, setWard] = useState("");
  const [isNigeria, setIsNigeria] = useState("");
  const [isVoters, setVoters] = useState("");
  const [votersCardNo, setVotersCardNo] = useState("");
  const [passportFile, setPassportFile] = useState(null);
  const [occupation, setOccupation] = useState("");
  const [maidenName, setMaidenName] = useState("");
  const [region, setRegion] = useState("");
  const [pollingUnit, setPollingUnit] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");

  // Location Data Lists
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [pollingUnits, setPollingUnits] = useState([]);

  // New states fixed for the 'no-undef' errors
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);



  // Loading States for Locations
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [loadingWardsApi, setLoadingWardsApi] = useState(false);
  const [loadingPollingUnits, setLoadingPollingUnits] = useState(false);

  // 1. Fetch Profile and Initial States
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingStates(true);
        const statesData = await getStates();
        setStates(statesData);
        
        // After loading states, fetch user profile
        const token = localStorage.getItem("token");
         const response = await fetch("https://registration.labourpartynigeria.org.ng:8443/api/Users/my-profile", {
          // const response = await fetch("https://localhost:44332/api/Users/my-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setFirstName(data.firstName || "");
          setMiddleName(data.middleName || "");
          setLastName(data.lastName || "");
          setDob(data.dob ? data.dob.split("T")[0] : "");
          setEmail(data.email || "");
          setPhone(data.phoneNumber || "");
          setNin(data.nationalId || "");
          setGender(data.gender || "");
          setMaritalStatus(data.maritalStatus || "");
          setOccupation(data.occupation || "");
          setRegion(data.region || "");
          setIsCitizen(data.isCitizen || "");
          setResidentialAddress(data.residentialAddress || "");
          setIsNigeria(data.country === "Nigeria" ? "Nigeria" : "Other Country");
          setCountry(data.country || "");
          setResidenceState(data.residenceState || "");
          setVoters(data.isVoters || "");
          setVotersCardNo(data.votersCardNo || "");
          setMaidenName(data.maidenName || "");
          
          // These set triggers for the cascaded useEffects
          setState(data.state || "");
          setLga(data.lga || "");
          setWard(data.ward || "");
          setPollingUnit(data.pollingUnit || "");
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoadingStates(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Cascade Logic (Identical to your Register page)
  useEffect(() => {
    if (!state) return;
    const fetchLgas = async () => {
      setLoadingLgas(true);
      try {
        const data = await getLgas(state);
        setLgas(data);
      } finally { setLoadingLgas(false); }
    };
    fetchLgas();
  }, [state]);

  useEffect(() => {
    if (!state || !lga) return;
    const fetchWards = async () => {
      setLoadingWardsApi(true);
      try {
        const data = await getWards(state, lga);
        setWards(data);
      } finally { setLoadingWardsApi(false); }
    };
    fetchWards();
  }, [state, lga]);

  useEffect(() => {
    if (!state || !lga || !ward) return;
    const fetchPollingUnitsData = async () => {
      setLoadingPollingUnits(true);
      try {
        const data = await getPollingUnits(state, lga, ward);
        setPollingUnits(data);
      } finally { setLoadingPollingUnits(false); }
    };
    fetchPollingUnitsData();
  }, [state, lga, ward]);

  // Handle Logic Functions (Copy-pasted from Register)
  const handleNumericInput = (value, setter) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) setter(cleaned);
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const dobDate = new Date(birthDate);
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
    return age;
  };

   // Fixed 'handleNameChange' error
  const handleNameChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s-]*$/.test(value)) {
      setter(value);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();




    if (validateAge(dob) < 18) {
      toast.error("You must be at least 18 years old.");
      return;
    }
const token = localStorage.getItem("token");

      if (!token) {
      toast.error("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    // --- DEFINE userId HERE ---
    const decoded = jwtDecode(token);
    console.log("My Token Data:", decoded);
    // Usually, .NET APIs store the ID in the 'nameid' or 'sub' claim
    const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    if (!userId) {
      toast.error("Could not verify user identity from token.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      
      const formData = new FormData();
      formData.append("RegId", userId);
      formData.append("FirstName", firstName.trim());
      formData.append("MiddleName", middleName.trim());
      formData.append("LastName", lastName.trim());
      formData.append("DOB", dob);
      formData.append("Email", email.trim());
      formData.append("PhoneNumber", phone.trim());
      formData.append("NationalId", nin.trim());
      formData.append("Gender", gender);
      formData.append("MaritalStatus", maritalStatus);
      formData.append("Region", region);
      formData.append("Occupation", occupation);
      formData.append("PollingUnit", pollingUnit);
      formData.append("ResidentialAddress", residentialAddress);
      formData.append("MaidenName", maidenName);
      formData.append("IsCitizen", isCitizen);
      formData.append("State", isCitizen === "Yes" ? state : "");
      formData.append("LGA", isCitizen === "Yes" ? lga : "");
      formData.append("Ward", isCitizen === "Yes" ? ward : "");
      formData.append("IsVoters", isVoters);
      if (isVoters === "Yes") formData.append("VotersCardNo", votersCardNo);
      formData.append("Country", isNigeria === "Nigeria" ? "Nigeria" : country);
      if (isNigeria === "Nigeria") formData.append("ResidenceState", residenceState);
      if (passportFile) formData.append("PassportUrl", passportFile);

       const response = await fetch("https://registration.labourpartynigeria.org.ng:8443/api/Users/update", {
      //const response = await fetch("https://localhost:44332/api/Users/update", {
      
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Update failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar active="update-details" />
      <ToastContainer />
      <div className="container pt-4 pb-5">
        <div className="text-center mb-4">
          <img src={logo} alt="LP" style={{ maxHeight: "100px" }} />
          <h2 className="fw-bold mt-2">Update Membership Details</h2>
        </div>

        <div className="card shadow-sm mx-auto" style={{ maxWidth: "900px" }}>
          <div className="card-body">
            <form onSubmit={handleUpdate}>
               <h6 className="fw-bold mb-3">Personal Details</h6>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">First Name *</label>
                    <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={handleNameChange(setFirstName)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Middle Name</label>
                    <input type="text" className="form-control" placeholder="Middle Name" value={middleName} onChange={handleNameChange(setMiddleName)} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Last Name *</label>
                    <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={handleNameChange(setLastName)}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Email Address *</label>
                    <input type="email" className="form-control" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                 <div className="col-md-6">
                    <label className="form-label fw-medium">Residential Address *</label>
                    <input className="form-control" placeholder="Enter Residential Address" value={residentialAddress} onChange={(e) => setResidentialAddress(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Occupation *</label>
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
                    <label className="form-label fw-medium">Select Region *</label>
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
                    <label className="form-label fw-medium">Date of Birth *</label>
                    <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)}/>
                  </div>
                </div>

                
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Phone Number *</label>
                    <input className="form-control" placeholder="11-digit phone number" value={phone} onChange={(e) => handleNumericInput(e.target.value, setPhone)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">National Identity Number(NIN) *</label>
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
                    <label className="form-label fw-medium">Do you reside in Nigeria? *</label>
                    <select className="form-select" value={isCitizen} onChange={(e) => { setIsCitizen(e.target.value); setState(""); setLga(""); setWard(""); setCountry(""); }}>
                      <option value="">Do you reside in Nigeria?</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Do you have a voters card? *</label>
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
        <label className="form-label fw-medium">State of Origin *</label>
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
                    <label className="form-label fw-medium">Country of Residence *</label>
                    <select className="form-select" value={isNigeria} onChange={(e) => setIsNigeria(e.target.value)} required>
                      <option value="">Select country of residence</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Other Country">Other Country</option>
                    </select>
                  </div>
                  {isNigeria === "Nigeria" && (
  <div className="col-md-6">
    <label className="form-label fw-medium">State of Residence *</label>
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
                      <label className="form-label fw-medium">Country Name *</label>
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
                  <label className="form-label fw-bold">Upload Passport Photograph *</label>
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
              Terms and Conditions *
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
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Update Details"}
                  </button>
                </div>

                <p className="text-muted small">Note: This is a pre-membership registration form. You will be contacted by your Local Government / Ward Representative once your membership registration is approved and ready for pickup.</p>            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateDetails;