import { useState, useEffect } from "react";
import { 
  FaUsers, FaUserShield, FaFilter,  
  FaUserCheck, FaUserPlus, FaUserCog, FaEdit, FaChevronLeft, FaChevronRight , FaFileDownload
} from "react-icons/fa";
import { Modal, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import IDCard from "../components/IDCard"; 
import "./AdminDashboard.css";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from 'xlsx';
import RegistrationForm from "../components/RegistrationForm";
import CreateAdminForm from "../components/CreateAdminForm";
import { jwtDecode } from "jwt-decode";
import IDCardActions from "../components/IDCardActions";
import BulkIDDownload from "../components/BulkIDDownload";

const AdminDashboard = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreated, setIsCreated] = useState(false); 
  const [totalPages,setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
// --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
 // const itemsPerPage = 10;

  const [dashboardStats, setDashboardStats] = useState({
    totalRegisteredUsers: 0,
    totalAdmins: 0,
    usersRegisteredLast7Days: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
// Inside AdminDashboard Component

const [adminRole, setAdminRole] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    // This matches the claim name in your C# JwtService
    setAdminRole(decoded.roleLevel); 
  }
}, []);

const [registeredUser, setRegisteredUser] = useState(null);


const exportAllToExcel = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    // We call a new endpoint (or the existing one without page/pageSize)
    // const response = await fetch("https://localhost:44332/api/Admin/all-users", {
     const response = await fetch("https://registration.labourpartynigeria.org.ng:8443/api/Admin/all-users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch all records");

    const allUsers = await response.json();

    if (allUsers.length === 0) {
      toast.warning("No data available to export");
      return;
    }

    // Prepare data (Mapping all users)
    const excelData = allUsers.map(user => ({
      "Registration ID": `LP/${user.regID}`,
      "First Name": user.firstName,
      "Middle Name": user.middleName || '',
      "Last Name": user.lastName,
      "Email": user.email,
      "Phone": user.phoneNumber,
      "State": user.state,
      "LGA": user.lga,
      "Ward": user.ward,
      "Polling Unit": user.pollingUnit || "N/A",
      "Address": user.residentialAddress,
      "Gender": user.gender,
      "Date of Birth": user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All_Registered_Users");

    const fileName = `Full_Database_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast.success(`Successfully exported ${allUsers.length} records!`);
  } catch (error) {
    console.error("Export Error:", error);
    toast.error("Could not download all records. Check server connection.");
  } finally {
    setLoading(false);
  }
};


const handleRegistrationSuccess = (userData) => {
  setRegisteredUser(userData);
  setIsCreated(true);
  handleSearch(); // Refresh the table so the new user appears
};

const exportToExcel = () => {
  if (users.length === 0) {
    toast.warning("No data available to export");
    return;
  }

  // 1. Prepare the data (cleaning up internal IDs or nulls)
  const excelData = users.map(user => ({
    "Registration ID": user.regID,
    "Full Name": `${user.firstName} ${user.middleName || ''} ${user.lastName}`,
    "Email": user.email,
    "Phone": user.phoneNumber,
    "State": user.state,
    "LGA": user.lga,
    "Ward": user.ward,
    "Polling Unit": user.pollingUnit || "N/A",
    "Gender": user.gender,
    "Date of Birth": user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"
  }));

  // 2. Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registered_Users");

  // 3. Define column widths for better readability
  const wscols = [
    { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, 
    { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 20 }
  ];
  worksheet['!cols'] = wscols;

  // 4. Trigger download
  const fileName = `Users_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  toast.success("Excel file generated successfully!");
};

// Helper to get token
  const getAuthHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  });

  const handleSearch = async (e, pageNumber = 1) => {
  if (e) e.preventDefault();
  setLoading(true);
  // 1. Create a cleaned version of the filters
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [
      key, 
      value === "" ? null : value  // Convert "" to null for the backend
    ])
  );
  // Determine if we are searching (POST) or fetching all (GET)
  const isFiltered = Object.values(filters).some(val => val !== "");
  
 const url = isFiltered 
    ? "https://registration.labourpartynigeria.org.ng:8443/api/Admin/search"
    : `https://registration.labourpartynigeria.org.ng:8443/api/Admin/users?page=${pageNumber}&pageSize=10`;
  // const url = isFiltered 
  //   ? "https://localhost:44332/api/Admin/search"
  //   : `https://localhost:44332/api/Admin/users?page=${pageNumber}&pageSize=10`;

  try {
    const response = await fetch(url, {
      method: isFiltered ? "POST" : "GET",
      headers: getAuthHeader(),
      ...(isFiltered && { body: JSON.stringify(cleanedFilters) })
    });

    const result = await response.json();

    if (response.ok) {
      if (isFiltered) {
        // --- SEARCH LOGIC (POST) ---
        // Search usually returns a simple array of results
        const userData = Array.isArray(result) ? result : [];
        setUsers(userData);
        setFilteredUsers(userData);
        setTotalPages(1); // Usually search results are single-page or local
        setTotalCount(userData.length);
      } else {
        // --- PAGINATED LOGIC (GET) ---
        // Based on the JSON you shared: { totalCount: 62, totalPages: 7, data: [...] }
        setUsers(result.data || []);
        setFilteredUsers(result.data); // <--- ADD THIS LINE HERE
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.totalCount || 0); // This fixes your 'not defined' error
      }
      
      setCurrentPage(pageNumber);
      
      if (isFiltered && result.length > 0) {
        toast.success("Filters applied successfully");
      }
    } else {
      toast.error(result.message || "Failed to fetch data");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Server connection failed");
  } finally {
    setLoading(false);
  }
};
  const handleClear = () => {
    setFilters({
      membershipId: "",
      region: "",
      state: "",
      email: "",        
    phoneNumber: "",  
      lga: "",
      ward: "",
      pollingUnit: "",
      fromDate: "",
      toDate: ""
    });
    // Trigger a fresh GET request for page 1
    handleSearch(null, 1);
    toast.info("Filters cleared");
  };


  // 2. Fetch data from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://registration.labourpartynigeria.org.ng:8443/api/Admin/dashboard-stats", {
      // const response = await fetch("https://localhost:44332/api/Admin/dashboard-stats", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Assuming your API requires the token
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch statistics");

        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error("Stats Error:", error);
        // Fallback or toast error if needed
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
  handleSearch(null, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  // Use State for permissions to ensure UI re-renders once data is found
  const [permissions] = useState({
    role: localStorage.getItem("role") || "",
    access: localStorage.getItem("access") || ""
  });
  // Add this back in
  const stats = [
    { 
      label: "Total Members", 
      count: loadingStats ? "..." : dashboardStats.totalRegisteredUsers.toLocaleString(), 
      icon: <FaUsers />, 
      color: "#088d01" 
    },
    { 
      label: "New This Week", 
      count: loadingStats ? "..." : dashboardStats.usersRegisteredLast7Days.toLocaleString(), 
      icon: <FaUserCheck />, 
      color: "#2ecc71" 
    },
    { 
      label: "Active Admins", 
      count: loadingStats ? "..." : dashboardStats.totalAdmins.toLocaleString(), 
      icon: <FaUserShield />, 
      color: "#f39c12" 
    },
  ];

  const [filters, setFilters] = useState({
    membershipId: "",
    region: "",
    state: "",
    email: "",       
  phoneNumber: "",
    lga: "",
    ward: "",
    pollingUnit: "",
    fromDate: "",
    toDate: ""
  });

  // Access rules derived from state
  const isNational = permissions.role === "National";
  const hasWriteAccess = permissions.access === "Write";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };


  const openRegisterModal = (type) => {
    setModalType(type);
    setSelectedUser(null);
    setIsCreated(false);
    setShowModal(true);
  };


 return (
    <div className="admin-wrapper">
      <Navbar />
      <ToastContainer />
      <div className="admin-container p-4">
        {/* --- HEADER SECTION --- */}
        <div className="dashboard-header d-flex justify-content-between align-items-md-center flex-column flex-md-row mb-4">
          <div>
            <h2 className="fw-bold m-0 text-success">Admin Command Center</h2>
            <p className="text-muted">
              Role: <span className="badge bg-success">{permissions.role || "N/A"}</span> | 
              Access: <span className="badge bg-primary">{permissions.access || "Read Only"}</span>
            </p>
          </div>

          <div className="action-buttons d-flex gap-2">
            <button
              className="btn btn-outline-success shadow-sm"
              onClick={exportToExcel}
              disabled={loading || users.length === 0}
            >
              <FaFileDownload className="me-2" /> Export Filtered Records
            </button>

            {/* NEW: Export All Records Button */}
  {isNational && (
    <button
      className="btn btn-outline-success shadow-sm"
      onClick={exportAllToExcel}
      disabled={loading}
    >
      <FaFileDownload className="me-2" /> Export All Records
    </button>
  )}
            {hasWriteAccess && (
              <button className="btn btn-success shadow-sm" onClick={() => openRegisterModal("registerUser")}>
                <FaUserPlus className="me-2" /> Register User
              </button>
            )}
           {/* UPDATED: Only show if user is National AND has Write Access */}
  {isNational && hasWriteAccess && (
    <button className="btn btn-success shadow-sm" onClick={() => openRegisterModal("addAdmin")}>
      <FaUserCog className="me-2" /> Add Admin
    </button>
  )}
          </div>
        </div>

        {/* --- STATS SECTION --- */}
        <div className="row mb-4">
          {stats.map((stat, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="stat-card shadow-sm border-0 d-flex align-items-center p-3 bg-white rounded-3">
                <div className="stat-icon me-3 p-3 rounded-circle text-white" style={{ backgroundColor: stat.color }}>{stat.icon}</div>
                <div>
                  <h4 className="fw-bold mb-0">{stat.count}</h4>
                  <span className="text-muted small">{stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- MAIN CONTENT SECTION (Filters + Table) --- */}
        <div className="row">
          {/* --- ADVANCED FILTER SECTION --- */}
          <div className={`col-md-${showFilters ? '3' : '1'} transition-all mb-4`}>
            <div className="filter-card shadow-sm bg-white p-3 rounded-4 border-0">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-success">{showFilters && "SEARCH FILTERS"}</h6>
                <FaFilter className="text-muted cursor-pointer" onClick={() => setShowFilters(!showFilters)} />
              </div>

              {showFilters && (
                <div className="filter-grid">
                  <label className="small fw-bold text-muted mb-1">Membership ID</label>
                  <input type="text" name="membershipId" className="form-control form-control-sm mb-2" placeholder="AB/KAD/XXX" onChange={handleInputChange} />
                    {/* ADDED: Email Field */}
                  <label className="small fw-bold text-muted mb-1">Email Address</label>
    <input 
      type="email" 
      name="email" 
      value={filters.email} 
      className="form-control form-control-sm mb-2" 
      placeholder="user@example.com" 
      onChange={handleInputChange} 
    />

    {/* ADDED: Phone Number Field */}
    <label className="small fw-bold text-muted mb-1">Phone Number</label>
    <input 
      type="text" 
      name="phoneNumber" 
      value={filters.phoneNumber} 
      className="form-control form-control-sm mb-2" 
      placeholder="080123..." 
      onChange={handleInputChange} 
    />

                  <div className="row g-2 mb-2">
                    {adminRole === "National" && (
                      <div className="col-6">
                        <label className="small fw-bold text-muted">State</label>
                        <input type="text" name="state" className="form-control form-control-sm" placeholder="State" onChange={handleInputChange} />
                      </div>
                    )}
                    {(adminRole === "National" || adminRole === "State") && (
                      <div className="col-6">
                        <label className="small fw-bold text-muted">LGA</label>
                        <input type="text" name="lga" className="form-control form-control-sm" placeholder="LGA" onChange={handleInputChange} />
                      </div>
                    )}
                  </div>

                  <div className="row g-2 mb-2">
                    {(adminRole === "National" || adminRole === "State" || adminRole === "LGA") && (
                      <div className="col-6">
                        <label className="small fw-bold text-muted">Ward</label>
                        <input type="text" name="ward" className="form-control form-control-sm" placeholder="Ward" onChange={handleInputChange} />
                      </div>
                    )}
                    <div className="col-6">
                      <label className="small fw-bold text-muted">P. Unit</label>
                      <input type="text" name="pollingUnit" className="form-control form-control-sm" placeholder="PU" onChange={handleInputChange} />
                    </div>
                  </div>

                  <label className="small fw-bold text-muted mb-1">From Date</label>
                  <input type="date" name="fromDate" className="form-control form-control-sm mb-2" onChange={handleInputChange} />

                  <label className="small fw-bold text-muted mb-1">To Date</label>
                  <input type="date" name="toDate" className="form-control form-control-sm mb-3" onChange={handleInputChange} />

                  <div className="d-flex gap-2">
                    <button className="btn btn-success flex-grow-1 btn-sm fw-bold py-2 shadow-sm" onClick={(e) => handleSearch(e, 1)} disabled={loading}>
                      {loading ? "Searching..." : "Search"}
                    </button>
                    <button className="btn btn-outline-secondary btn-sm fw-bold py-2 shadow-sm" onClick={handleClear} type="button">
                      Clear
                    </button>
                  </div>
                  {/* --- BULK DOWNLOAD SECTION --- */}
{filteredUsers && filteredUsers.length > 0 && (
  <>
    <hr className="my-3 text-muted" />
    <label className="small fw-bold text-muted mb-2 d-block">EXPORT OPTIONS</label>
    {/* Pass the same data array here */}
    <BulkIDDownload users={filteredUsers} /> 
    <p className="x-small text-muted mt-2 mb-0" style={{ fontSize: '11px' }}>
      * Generates a PDF of the current {filteredUsers.length} filtered records.
    </p>
  </>
)}
                </div>
              )}
            </div>
          </div>

          {/* --- TABLE & PAGINATION SECTION --- */}
          <div className={`col-md-${showFilters ? '9' : '11'}`}>
            <div className="table-card shadow-sm bg-white rounded-4 overflow-hidden border-0">
              <div className="table-responsive" style={{ maxHeight: '600px' }}>
                <table className="table table-hover align-middle mb-0 text-nowrap">
                  <thead className="table-light">
                    <tr>
                     <th className="ps-4" style={{ minWidth: '140px' }}>Reg ID</th>
            {/* New Columns for Names */}
            <th style={{ minWidth: '150px' }}>First Name</th>
            <th style={{ minWidth: '150px' }}>Middle Name</th>
            <th style={{ minWidth: '150px' }}>Last Name</th>
            <th style={{ minWidth: '200px' }}>Full Name</th>
            {/* New Column for Address */}
            <th style={{ minWidth: '250px' }}>Residential Address</th>
            <th style={{ minWidth: '120px' }}>State</th>
            <th style={{ minWidth: '120px' }}>LGA</th>
            <th style={{ minWidth: '150px' }}>Ward</th>
            <th style={{ minWidth: '150px' }}>Polling Unit</th>
            <th style={{ minWidth: '130px' }}>Phone</th>
            <th style={{ minWidth: '220px' }}>Email</th>
            <th style={{ minWidth: '120px' }}>Region</th>
            <th style={{ minWidth: '120px' }}>Date of Birth</th>                      {hasWriteAccess && <th className="text-center sticky-end bg-light" style={{ minWidth: '100px' }}>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="11" className="text-center p-5">
                          <Spinner animation="border" variant="success" />
                          <p className="mt-2 text-muted">Fetching records...</p>
                        </td>
                      </tr>
                    ) : users && users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                         <td className="ps-4 fw-bold text-success">LP/{user.regID}</td>
                {/* Individual Name Columns */}
                <td>{user.firstName || "N/A"}</td>
                <td>{user.middleName || "N/A"}</td>
                <td>{user.lastName || "N/A"}</td>
                {/* Full Name Combined */}
                <td className="fw-semibold">{user.firstName} {user.middleName} {user.lastName}</td>
                {/* Residential Address Column */}
                <td className="text-wrap" style={{ maxWidth: '250px' }}>
                   {user.residentialAddress || "N/A"}
                </td>
                <td>{user.state}</td>
                <td>{user.lga}</td>
                <td>{user.ward}</td>
                <td>{user.pollingUnit || "N/A"}</td>
                <td>{user.phoneNumber}</td>
                <td className="text-lowercase">{user.email}</td>
                <td>{user.region || "N/A"}</td>
                <td>{user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</td>
                          {hasWriteAccess && (
                            <td className="text-center sticky-end bg-light">
                              <div className="d-flex align-items-center justify-content-center gap-2">
      {/* Our New Component */}
      <IDCardActions user={user} />
      
      {/* Your Existing Edit Button */}
      <button 
        className="btn btn-sm btn-success px-3" 
        onClick={() => { setSelectedUser(user); setModalType("editUser"); setShowModal(true); }}
      >
        <FaEdit className="me-1" /> Edit
      </button>
    </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="15" className="text-center p-5 text-muted">No records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              <div className="d-flex justify-content-between align-items-center p-3 border-top bg-white">
                <small className="text-muted fw-medium ps-2">
                  Showing <strong>{(currentPage - 1) * 10 + 1}</strong> to <strong>{Math.min(currentPage * 10, totalCount)}</strong> of <strong>{totalCount}</strong>
                </small>
                <div className="pagination-btns pe-2">
                  <button className="btn btn-sm btn-outline-secondary border-0 me-2" disabled={currentPage === 1 || loading} onClick={() => handleSearch(null, currentPage - 1)}>
                    <FaChevronLeft /> Previous
                  </button>
                  <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button className="btn btn-sm btn-outline-secondary border-0 ms-2" disabled={currentPage === totalPages || totalPages === 0 || loading} onClick={() => handleSearch(null, currentPage + 1)}>
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- UNIFIED MODAL --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size={isCreated ? "lg" : "xl"} centered scrollable>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {isCreated ? "Registration Success" : (modalType === "registerUser" ? "New Membership Registration" : "Admin Account Creation")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {isCreated && (modalType === "registerUser" || modalType === "register") ? (
            <div className="text-center p-3">
              <div className="alert alert-success fw-bold">USER REGISTERED SUCCESSFULLY!</div>
              <div className="d-flex justify-content-center border p-3 rounded bg-white shadow-sm">
  {registeredUser ? <IDCard user={registeredUser} /> : <Spinner animation="border" />}
</div>
              <button className="btn btn-success mt-4 px-5" onClick={() => { setIsCreated(false); setShowModal(false); }}>
                Done & Close
              </button>
            </div>
          ) : (
            <div className="px-2">
              {modalType === "addAdmin" || modalType === "createAdmin" ? (
                <>
                  <h5 className="mb-4 text-dark fw-bold border-bottom pb-2">System Administrator Setup</h5>
                  <CreateAdminForm onSuccess={() => { setShowModal(false); toast.success("Admin created successfully"); }} />
                </>
              ) : (
                <>
                  <h5 className="mb-4 text-success fw-bold">{modalType === "editUser" ? "Update Member Record" : "New Member Enrollment"}</h5>
                  <RegistrationForm onSuccess={handleRegistrationSuccess} isAdminMode={true} initialData={modalType === "editUser" ? selectedUser : null} isEdit={modalType === "editUser"} />
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pb-4 px-4">
          <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;