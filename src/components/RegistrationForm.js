import  { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getStates,
  getLgas,
  getWards,
  getPollingUnits,
} from "../APIs/locationservice";
import { Spinner } from "react-bootstrap";

const RegistrationForm = ({onSuccess, isAdminMode, initialData, isEdit }) => {
  // ===== State Management (Exact same as your Register.js) =====
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
  //const [formData,setFormData]= useState("")

  // Location Data
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [pollingUnits, setPollingUnits] = useState([]);

  // Loaders
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [loadingWardsApi, setLoadingWardsApi] = useState(false);
  const [loadingPollingUnits, setLoadingPollingUnits] = useState(false);

  // Helper for numeric restriction
  const handleNumericInput = (value, setter) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) setter(cleaned);
  };

  // ===== Location Effects (Exact same logic) =====
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const data = await getStates();
        setStates(data);
      } catch { toast.error("Failed to load states"); }
      finally { setLoadingStates(false); }
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
      } catch { toast.error("Failed to load LGAs"); }
      finally { setLoadingLgas(false); }
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
      } catch { toast.error("Failed to load wards"); }
      finally { setLoadingWardsApi(false); }
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
      } catch { toast.error("Failed to load polling units"); }
      finally { setLoadingPollingUnits(false); }
    };
    fetchPollingUnitsData();
  }, [state, lga, ward]);


  useEffect(() => {
  if (isEdit && initialData) {
    // --- 1. Fill non-cascading variables immediately ---
    setFirstName(initialData.firstName || "");
    setLastName(initialData.lastName || "");
    setMiddleName(initialData.middleName || "");
    setPhone(initialData.phoneNumber || "");
    setEmail(initialData.email || "");
    setDob(initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : "");
    setGender(initialData.gender || "");
    setNin(initialData.nationalId || "");
    setMaritalStatus(initialData.maritalStatus || "");
    setRegion(initialData.region || "");
    setOccupation(initialData.occupation || "");
    setPollingUnit(initialData.pollingUnit || "");
    setResidentialAddress(initialData.residentialAddress || "");
    setMaidenName(initialData.maidenName || "");
    setIsCitizen(initialData.isCitizen || "No");
    setVoters(initialData.isVoters || "No");
    setVotersCardNo(initialData.votersCardNo || "");

    if (initialData.country === "Nigeria") {
      setIsNigeria("Nigeria");
    } else {
      setIsNigeria("Other");
      setCountry(initialData.country || "");
    }
    setResidenceState(initialData.residenceState || "");

    // --- 2. Handle Cascading Locations (State -> LGA -> Ward) ---
    // First, set the State. This triggers your "fetchLgas" logic.
    if (initialData.state) {
      setState(initialData.state);

      // We use a small timeout to wait for the LGA list to populate in the UI
      setTimeout(() => {
        if (initialData.lga) {
          setLga(initialData.lga);

          // We wait again for the Ward list to populate based on the LGA
          setTimeout(() => {
            if (initialData.ward) {
              setWard(initialData.ward);
            }
          }, 500); // 0.5 second for Wards
        }
      }, 500); // 0.5 second for LGAs
    }
  }
}, [initialData, isEdit]);
 
// Helper for numeric restriction and digit limit
   
const calculateAge = (birthDate) => {
  if (!birthDate) return 0;

  const today = new Date();
  const dob = new Date(birthDate);

  // Return null if the date is in the future
  if (dob > today) return null;

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

  
  // ===== Submit Handler =====
 // ===== Submit Handler =====
  const handleSubmit = async (e) => {
  e.preventDefault();

  const currentAge = calculateAge(dob);
  if (currentAge === null) return toast.error("Birth date cannot be in the future!");
  if (currentAge < 18) return toast.error("You must be at least 18 years old to register.");

  // Validation
  if (phone.length !== 11) return toast.error("Phone number must be 11 digits");
  if (nin.length !== 11) return toast.error("NIN must be 11 digits");
  if (isVoters === "Yes" && votersCardNo.length !== 11) return toast.error("Voters Card No must be 11 digits");
  if (!isEdit && !passportFile) return toast.error("Please upload a passport photo");

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    let response;
    let payloadForIDCard = {};

    if (isEdit) {
      // --- 1. EDIT LOGIC (FormData) ---
      const formData = new FormData();
      
      formData.append("RegID", initialData?.regID);
      formData.append("FirstName", firstName.trim());
      formData.append("MiddleName", middleName?.trim() || "");
      formData.append("LastName", lastName.trim());
      formData.append("DOB", dob);
      formData.append("Email", email.trim());
      formData.append("PhoneNumber", phone);
      formData.append("NationalId", nin);
      formData.append("Gender", gender);
      formData.append("MaritalStatus", maritalStatus);
      formData.append("IsCitizen", isCitizen);
      formData.append("State", state);
      formData.append("LGA", lga);
      formData.append("Ward", ward);
      formData.append("Region", region);
      formData.append("Occupation", occupation);
      formData.append("PollingUnit", pollingUnit);
      formData.append("ResidentialAddress", residentialAddress);
      formData.append("IsVoters", isVoters);
      formData.append("Country", isNigeria === "Nigeria" ? "Nigeria" : country);
      formData.append("ResidenceState", residenceState);

      if (passportFile) {
        formData.append("PassportUrl", passportFile);
      }

      // response = await fetch("https://localhost:44332/api/Users/update", {
       response = await fetch("https://registration.labourpartynigeria.org.ng:8443/api/Users/update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          // CRITICAL: No "Content-Type" header here! Let the browser set it.
        },
        body: formData, // Send the formData object directly
      });
    } else {
      // --- 2. REGISTER LOGIC (FormData) ---
      const formData = new FormData();
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
      formData.append("State", isCitizen === "Yes" ? state : "Overseas");
      formData.append("LGA", isCitizen === "Yes" ? lga : "Overseas");
      formData.append("Ward", isCitizen === "Yes" ? ward : "Overseas");
      formData.append("IsVoters", isVoters);
      if (isVoters === "Yes" && votersCardNo) formData.append("VotersCardNo", votersCardNo);
      formData.append("Country", isNigeria === "Nigeria" ? "Nigeria" : country);
      if (isNigeria === "Nigeria" && residenceState) formData.append("ResidenceState", residenceState);
      formData.append("PassportUrl", passportFile);

      payloadForIDCard = {
        firstName,
        middleName,
        lastName,
        state: isCitizen === "Yes" ? state : "Overseas",
        lga: isCitizen === "Yes" ? lga : "Overseas",
        ward: isCitizen === "Yes" ? ward : "Overseas",
        passportUrl: passportFile ? URL.createObjectURL(passportFile) : null
      };

      // response = await fetch("https://localhost:44332/api/Users/register", {
      response = await fetch("https://registration.labourpartynigeria.org.ng:8443/api/Users/register", {
        method: "POST",
        body: formData,
      });
    }

    const data = await response.json();

    if (response.ok) {
      toast.success(isEdit ? "Profile updated successfully" : "Registration successful!");
      if (isEdit) {
        onSuccess();
      } else {
        const completeUser = { ...payloadForIDCard, regID: data.regId };
        onSuccess(completeUser);
      }
    } else {
      toast.error(data.message || "Operation failed");
    }
  } catch (error) {
    console.error("Submit Error:", error);
    toast.error("Network error, try again");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <h6 className="fw-bold mb-3 text-success">Personal Details</h6>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label small fw-bold">First Name *</label>
          <input className="form-control" value={firstName.trim()}  onChange={(e) => {
        // Regex: Matches only letters and spaces
        const val = e.target.value;
        if (val === "" || /^[a-zA-Z\s]+$/.test(val)) {
          setFirstName(val);
        }
      }} required />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Middle Name</label>
          <input className="form-control" value={middleName.trim()}  onChange={(e) => {
        // Regex: Matches only letters and spaces
        const val = e.target.value;
        if (val === "" || /^[a-zA-Z\s]+$/.test(val)) {
          setMiddleName(val);
        }
      }} />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Last Name *</label>
          <input className="form-control" value={lastName.trim()}  onChange={(e) => {
        // Regex: Matches only letters and spaces
        const val = e.target.value;
        if (val === "" || /^[a-zA-Z\s]+$/.test(val)) {
          setLastName(val);
        }
      }} required />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Email Address *</label>
          <input type="email" className="form-control" value={email.trim()} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div className="row g-3 mb-3">
        {/* <div className="col-md-6">
          <label className="form-label small fw-bold">Maiden Name</label>
          <input className="form-control" value={maidenName} onChange={(e) => setMaidenName(e.target.value)} />
        </div> */}
        <div className="col-md-6">
          <label className="form-label small fw-bold">Occupation *</label>
          <select className="form-select" value={occupation} onChange={(e) => setOccupation(e.target.value)} required>
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
          <label className="form-label small fw-bold">Select Region *</label>
          <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)} required>
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
          <label className="form-label small fw-bold">Date of Birth *</label>
          <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <label className="form-label small fw-bold">Residential Address *</label>
          <input className="form-control" value={residentialAddress} onChange={(e) => setResidentialAddress(e.target.value)} required />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label small fw-bold">Phone Number *</label>
          <input className="form-control" placeholder="11 digits" value={phone.trim()} onChange={(e) => handleNumericInput(e.target.value, setPhone)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">NIN *</label>
          <input className="form-control" placeholder="11 digits" value={nin.trim()} onChange={(e) => handleNumericInput(e.target.value, setNin)} required />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label small fw-bold">Gender *</label>
          <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Marital Status *</label>
          <select className="form-select" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} required>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widow">Widow</option>
            <option value="Widower">Widower</option>
          </select>
        </div>
      </div>


      <div className="row g-3 mb-3">
  {/* Conditional Rendering: Only show if Female AND Married */}
  {gender === "Female" && maritalStatus === "Married" && (
    <div className="col-md-6">
      <label className="form-label small fw-bold">Maiden Name</label>
      <input 
        type="text" 
        className="form-control" 
        value={maidenName} 
       onChange={(e) => {
        // Regex: Matches only letters and spaces
        const val = e.target.value;
        if (val === "" || /^[a-zA-Z\s]+$/.test(val)) {
          setMaidenName(val);
        }
      }}
      />
    </div>
  )}
  </div>

      <div className="row g-3 mb-3 border-top pt-3">
        <div className="col-md-6">
          <label className="form-label small fw-bold">Reside in Nigeria? *</label>
          <select className="form-select" value={isCitizen} onChange={(e) => { setIsCitizen(e.target.value); setState(""); setLga(""); setWard(""); }} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Have Voters Identification Number?</label>
          <select className="form-select" value={isVoters} onChange={(e) => setVoters(e.target.value)} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {isVoters === "Yes" && (
        <div className="col-md-12 mb-3">
          <label className="form-label small fw-bold">Voter's Identification Number</label>
          <input maxLength={20} className="form-control" value={votersCardNo} onChange={(e) =>setVotersCardNo (e.target.value)} required />
        </div>
      )}

      {isCitizen === "Yes" && (
        <>
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">State of Residence *</label>
              <select className="form-select" value={state} onChange={(e) => { setState(e.target.value); setLga(""); }} required>
                <option value="">{loadingStates ? "..." : "State"}</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">LGA</label>
              <select className="form-select" value={lga} onChange={(e) => setLga(e.target.value)} disabled={!state} required>
                <option value="">{loadingLgas ? "..." : "LGA"}</option>
                {lgas.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Ward</label>
              <select className="form-select" value={ward} onChange={(e) => setWard(e.target.value)} disabled={!lga} required>
                <option value="">{loadingWardsApi ? "..." : "Ward"}</option>
                {wards.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
          {ward && (
            <div className="col-md-12 mb-3">
              <label className="form-label small fw-bold text-success">Polling Unit</label>
              <select className="form-select border-success" value={pollingUnit} onChange={(e) => setPollingUnit(e.target.value)} required>
                <option value="">{loadingPollingUnits ? "Loading Units..." : "Select Polling Unit"}</option>
                {pollingUnits.map(pu => <option key={pu} value={pu}>{pu}</option>)}
              </select>
            </div>
          )}
        </>
      )}

      <div className="row g-3 mb-3 border-top pt-3">
        <div className="col-md-6">
          <label className="form-label small fw-bold">Country of Residence *</label>
          <select className="form-select" value={isNigeria} onChange={(e) => setIsNigeria(e.target.value)} required>
            <option value="">Select</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Other Country">Other Country</option>
          </select>
        </div>
        {isNigeria === "Nigeria" && (
          <div className="col-md-6">
            <label className="form-label small fw-bold">State of Origin</label>
            <select className="form-select" value={residenceState} onChange={(e) => setResidenceState(e.target.value)} required>
              <option value="">Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="mb-3">
  <label className="form-label small fw-bold">
    Passport Photo {isEdit ? "(Optional)" : "*"}
  </label>
  <input 
    type="file" 
    className="form-control" 
    accept="image/*" 
    onChange={(e) => setPassportFile(e.target.files[0])} 
    required={!isEdit} // 🔹 Only required if we are NOT in edit mode
  />
  {isEdit && !passportFile && initialData?.passportUrl && (
    <div className="mt-2 small text-muted">Current file: {initialData.passportUrl.split('/').pop()}</div>
  )}
</div>

      <button 
  type="submit" 
  className="btn btn-success w-100 py-2 fw-bold" 
  disabled={loading}
>
  {loading ? (
    <>
      <Spinner size="sm" className="me-2" />
      {isEdit ? "Updating..." : "Registering..."}
    </>
  ) : (
    // THIS LINE CHANGES THE TEXT BASED ON THE MODE
    isEdit ? "Update User Record" : "Register User"
  )}
</button>
    </form>
  );
};

export default RegistrationForm;