import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getStates, getLgas, getWards } from "../APIs/locationservice";

const CreateAdminForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roleLevel: "National", // Default
    accessType: "Read",    // Default
    state: "",
    lga: "",
    ward: ""
  });

  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);

  // Load States for State/LGA/Ward levels
  useEffect(() => {
    getStates().then(setStates).catch(() => toast.error("Error loading states"));
  }, []);

  // Cascading Location Logic
  useEffect(() => {
    if (formData.state) {
      getLgas(formData.state).then(setLgas).catch(() => toast.error("Error loading LGAs"));
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.state && formData.lga) {
      getWards(formData.state, formData.lga).then(setWards).catch(() => toast.error("Error loading Wards"));
    }
  }, [formData.state, formData.lga]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Get the token from storage
    const token = localStorage.getItem("token");

    const payload = {
      Username: formData.username,
      Password: formData.password,
      RoleLevel: formData.roleLevel,
      AccessType: formData.accessType,
      State: ["State", "LGA", "Ward"].includes(formData.roleLevel) ? formData.state : null,
      LGA: ["LGA", "Ward"].includes(formData.roleLevel) ? formData.lga : null,
      Ward: formData.roleLevel === "Ward" ? formData.ward : null,
    };

    try {
      const response = await fetch("https://govtregistrationapi.onrender.com/api/Admin/create-admin", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // 2. ADD THIS HEADER HERE:
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Admin created successfully");
        onSuccess();
      } else if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Optional: redirect to login
      } else {
        toast.error(data.message || "Failed to create admin");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3 p-2">
      <div className="col-md-6">
        <label className="form-label small fw-bold">USERNAME</label>
        <input name="username" type="text" className="form-control" onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-bold">PASSWORD</label>
        <input name="password" type="password" className="form-control" onChange={handleChange} required />
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-bold">ROLE LEVEL</label>
        <select name="roleLevel" className="form-select" onChange={handleChange} value={formData.roleLevel}>
          <option value="National">National</option>
          <option value="State">State</option>
          <option value="LGA">LGA</option>
          <option value="Ward">Ward</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-bold">ACCESS TYPE</label>
        <select name="accessType" className="form-select" onChange={handleChange} value={formData.accessType}>
          <option value="Read">Read Only</option>
          <option value="Write">Write Access</option>
        </select>
      </div>

      {/* Conditional Location Rendering */}
      {["State", "LGA", "Ward"].includes(formData.roleLevel) && (
        <div className="col-md-4">
          <label className="form-label small fw-bold">ASSIGNED STATE</label>
          <select name="state" className="form-select" onChange={handleChange} required>
            <option value="">Select State</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {["LGA", "Ward"].includes(formData.roleLevel) && (
        <div className="col-md-4">
          <label className="form-label small fw-bold">ASSIGNED LGA</label>
          <select name="lga" className="form-select" onChange={handleChange} disabled={!formData.state} required>
            <option value="">Select LGA</option>
            {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      )}

      {formData.roleLevel === "Ward" && (
        <div className="col-md-4">
          <label className="form-label small fw-bold">ASSIGNED WARD</label>
          <select name="ward" className="form-select" onChange={handleChange} disabled={!formData.lga} required>
            <option value="">Select Ward</option>
            {wards.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      )}

      <div className="col-12 mt-4">
        <button type="submit" className="btn btn-dark w-100 fw-bold" disabled={loading}>
          {loading ? "Creating..." : "CREATE ADMIN ACCOUNT"}
        </button>
      </div>
    </form>
  );
};

export default CreateAdminForm;